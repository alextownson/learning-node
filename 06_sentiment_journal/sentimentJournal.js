// performs sentiment analysis on arbitrary blocks of input text
import Sentiment from 'sentiment';
// import a dictionary for use with spell-checker
import dictionary from 'dictionary-en';
// import spell-checker - had to use a different package than textbook
import nspell from 'nspell';
import { SentimentScore } from './db.js';
import prompt from 'prompt';

// create an nspell instance with the dictionary
const spell = nspell(dictionary);

prompt.start({});
prompt.message = '';

class SentimentJournal {
  constructor() {
    // sentiment analysis object
    this.sentiment = new Sentiment();
    // array of sentiment scores
    this.scores = [0];
    // this stores the users entry
    this.entry = '';
  }

  // corrects spelling of input string
  correctSpelling = async (inputString) => {
    // create an array of words
    const words = inputString.split(' ');
    const corrections = [];
    // iterate through the array
    for (let word of words) {
      // if a word is misspelled
      if (!spell.correct(word)) {
        // create an array of suggestions for the misspelled word
        const options = spell.suggest(word);
        // use original word if there are no suggestions
        if (options.length === 0) {
          console.log('No suggestions');
          corrections.push(word);
          continue;
          // truncate the options if it's a large array
        } else if (options.length > 5) options.length = 5;
        // turn the truncated options into a numbered list
        const optionsString = options
          .map((option, i) => `${i + 1}. ${option}`)
          .join('\n');
        // prompt user for correction
        try {
          const correctWord = await prompt.get([
            {
              description: `You misspelled ${word}. Did you mean\n${optionsString}\nEnter the number of the correct word`,
            },
          ]);
          // parse the string and return an integer
          const index = parseInt(correctWord, 10);
          // validate the response
          if (!index || index < 1 || index > options.length) {
            console.log('Invalid choice, using original word.');
            corrections.push(word);
          } else {
            corrections.push(options[correctWord - 1]);
          }
        } catch (e) {
          console.log(`An error occurred: ${e}`);
        }
      } else {
        // if not misspelled push the word into the array
        corrections.push(word);
      }
    }
    // return the string
    return corrections.join(' ');
  };

  // creates a new SentimentScore record in the database using the the score parameter
  async saveScore(score) {
    await SentimentScore.create({ score });
  }

  // fetches all persisted scores from the database
  async fetchEntries() {
    // limits to 100 most recent scores
    const results = await SentimentScore.findAll({ limit: 100 });
    if (results.length) {
      // if the records exist, only take the score values
      this.scores = results.map(({ score }) => score);
    }
  }

  // analysis method
  async analyzeSentiment() {
    // check if the entry exists
    if (!this.entry || this.entry === '') return;
    // analyze and get the score
    const { score } = this.sentiment.analyze(this.entry);
    // calculate the score between -1 and 1
    const normalizedScore = Math.min(Math.max(score / 10, -1), 1);
    // save the score to the database
    await this.saveScore(normalizedScore);
    // add the score to the scores array field
    this.scores.push(normalizedScore);
  }

  // prompt entry method
  async promptEntry() {
    // wait for the user's response to the prompt
    const { response } = await prompt.get([
      {
        name: 'response',
        description: 'How do you feel?',
      },
    ]);
    // assign the spelling corrected response to this.entry
    this.entry = await this.correctSpelling(response);
  }
}

export default SentimentJournal;
