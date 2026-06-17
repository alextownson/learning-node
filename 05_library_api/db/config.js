// configurations needed to set up the database
// import the sequelize class form the sequelize package
import { Sequelize } from 'sequelize';

// instantiate a new sequelize database connection, db, using SQLite
const db = new Sequelize({
  dialect: 'sqlite',
  storage: './db/database.sqlite',
});

try {
  // connect to db
  await db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  // log an error if connection fails
  console.error('Unable to connect to the database:', error);
}

// export sequelize and the db
export default {
  Sequelize,
  db,
};
