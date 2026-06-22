import { Sequelize, DataTypes } from 'sequelize';

// instantiate a new database configuration with Sequelize, using SQlite database stored as journal.sqlite
const db = new Sequelize({
  dialect: 'sqlite',
  storage: './journal.sqlite',
});
// define a sentiment score sequelize model that saves a score field as a decimal value
export const SentimentScore = db.define('SentimentScore', {
  score: DataTypes.DECIMAL,
});

// register the sentiment score model with the SQLite database
await SentimentScore.sync();
