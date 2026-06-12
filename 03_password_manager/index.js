// a library to help hash passwords
import bcrypt from 'bcrypt';
// sync prompt for node
import promptModule from 'prompt-sync';
// mongodb
import { MongoClient } from 'mongodb';

const prompt = promptModule();
const dbUrl = 'mongodb://localhost:27017';
const client = new MongoClient(dbUrl);
let hasPasswords = false;
let passwordsCollection, authCollection;
// sets the db name
const dbName = 'passwordManager';

const main = async () => {
  try {
    // attempts to connect to my local MongoDB server
    await client.connect();
    console.log('Connected successfully to server');
    // connects to the named database
    const db = client.db(dbName);
    // create the two collections
    authCollection = db.collection('auth');
    passwordsCollection = db.collection('passwords');
    // search for an existing hash password hash
    const hashedPassword = await authCollection.findOne({ type: 'auth' });
    // converts the search result to a boolean
    hasPasswords = !!hashedPassword;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

// Prompts for a new password for the password manager if one doesn't already exist
const promptNewPassword = () => {
  const response = prompt('Enter a main password: ');
  const saltRounds = Number(prompt('Enter the number of salt rounds: '));
  return saveNewPassword(response, saltRounds);
};

// Saves the new password manager password hash to the database
const saveNewPassword = async (password, saltRounds) => {
  const hash = bcrypt.hashSync(password, saltRounds);
  await authCollection.insertOne({ type: 'auth', hash, saltRounds });
  console.log('Password has been saved!');
  await showMenu();
};

// Prompts for the existing password to login to the password manager
const promptOldPassword = async () => {
  let verified = false;
  while (!verified) {
    const response = prompt('Enter your password: ');
    const result = await compareHashedPassword(response);
    if (result) {
      console.log('Password is verified.');
      verified = true;
      showMenu();
    } else {
      console.log('Password incorrect. Try again.');
    }
  }
};

// Compares the existing password manager password to the one saved in the data base to ensure that they match
const compareHashedPassword = async (password) => {
  const { hash } = await authCollection.findOne({ type: 'auth' });
  return bcrypt.compare(password, hash);
};

// lists the passwords that are stored in the password manager
const viewPasswords = async () => {
  const passwords = await passwordsCollection.find({}).toArray();
  passwords.forEach(({ source, password }, index) => {
    console.log(`${index + 1}. ${source} => ${password}`);
  });
  await showMenu();
};

// Add or update a password in stored in the password manager
const promptManageNewPassword = async () => {
  const source = prompt('Enter name for password: ');
  const password = prompt('Enter password to save: ');
  await passwordsCollection.findOneAndUpdate(
    { source },
    { $set: { password } },
    {
      returnDocument: 'after',
      upsert: true,
    },
  );
  console.log(`Password for ${source} has been saved!`);
  await showMenu();
};

// Finds a password stored in the database by the source name
const findPasswordBySource = async () => {
  const source = prompt(
    'Enter the source name of the password you are looking for:',
  );

  const sourceDoc = await passwordsCollection.findOne({ source });
  if (sourceDoc) {
    console.log(`${source}: ${sourceDoc.password}`);
  } else {
    console.log('No password saved for that source.');
  }
  await showMenu();
};

// menu for user to select options from
const showMenu = async () => {
  console.log(`
    1. View passwords
    2. Manage new password
    3. Verify password
    4. Find password by source
    5. Exit`);
  const response = prompt('>');

  switch (response) {
    case '1':
      await viewPasswords();
      break;
    case '2':
      await promptManageNewPassword();
      break;
    case '3':
      await promptOldPassword();
      break;
    case '4':
      await findPasswordBySource();
      break;
    case '5':
      process.exit();
    default:
      console.log("That's an invalid response.");
      await showMenu();
  }
};

await main();
// if there is already a password set, ask for it, if not, make a password
if (!hasPasswords) promptNewPassword();
else promptOldPassword();
