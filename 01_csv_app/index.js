// package that converts object/arrays into CSV string or writes them to a file
import { createObjectCsvWriter } from 'csv-writer';
// package that simplifies command-line prompts
import prompt from 'prompt';

prompt.start();
prompt.message = '';

const csvWriter = createObjectCsvWriter({
  // where to write the file
  path: './contacts.csv',
  // create the CSV headers
  header: [
    { id: 'name', title: 'NAME' },
    { id: 'number', title: 'NUMBER' },
    { id: 'email', title: 'EMAIL' },
    { id: 'createdAt', title: 'CREATED_AT' },
  ],
});

class Person {
  constructor(name = '', number = '', email = '') {
    this.name = name;
    this.number = number;
    this.email = email;
    this.createdAt = Temporal.Now.zonedDateTimeISO('America/Toronto');
  }
  // method to save the person to the CSV file
  async saveToCSV() {
    try {
      const { name, number, email, createdAt } = this;
      await csvWriter.writeRecords([{ name, number, email, createdAt }]);
      console.log(`${name} Saved!`);
    } catch (err) {
      console.error('Error saving contact:', err);
    }
  }
}

const startApp = async () => {
  const questions = [
    { name: 'name', description: 'Contact Name' },
    {
      name: 'number',
      description: 'Contact Number',
      // input validation to ensure it's a phone number
      pattern: /^\d{10}$/,
      message: 'Phone number must be numbers only',
    },
    {
      name: 'email',
      description: 'Contact Email',
      // input validation to ensure it's an email
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Must be a valid email',
    },
  ];

  const responses = await prompt.get(questions);
  // instantiate a new person object with the command-line input
  const person = new Person(responses.name, responses.number, responses.email);
  // call the method that saves the new person to the file
  await person.saveToCSV();

  // continue or end the application
  const { again } = await prompt.get([
    { name: 'again', description: 'Continue [y to continue]' },
  ]);
  if (again.toLowerCase() === 'y') await startApp();
};

startApp();
