// create a sequelize model called Book
// this model name later maps in the SQLite database to create a corresponding table of the same name

import config from '../db/config.js';

const { Sequelize, db } = config;

// define the Book model with Sequelize
const Book = db.define(
  'Book',
  {
    // define a title field as a string that may not have a duplicate value in the database
    title: {
      type: Sequelize.STRING,
      unique: true,
    },
    // define an author field as a string
    author: {
      type: Sequelize.STRING,
    },
    // define a count field as an integer that will increment with each POST request
    count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {},
);

// sync the Book model with the SQLite database
await Book.sync();

export default Book;
