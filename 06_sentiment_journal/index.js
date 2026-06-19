// import a dictionary for use with spell-checker
import dictionary from 'dictionary-en';
// import spell-checker - had to use a different package than textbook
import nspell from 'nspell';
// import natural language processor
import natural from 'natural';

// create an nspell instance with the dictionary
const spell = nspell(dictionary);

// instantiate a new tokenizer
const tokenizer = new natural.WordTokenizer();

// test input string
const inputString = 'I am feling grat!';

const correctSpelling = (inputString) => {
  // create an array of words
  const words = inputString.split(' ');
  const corrections = [];
  // iterate through the array
  for (let word of words) {
    // if a word is misspelled
    if (!spell.correct(word)) {
      // create an array of suggestions for the misspelled word
      const options = spell.suggest(word);
      // select the first suggestion option - ask for user input once cli is added
      corrections.push(options[0]);
    } else {
      // if not misspelled push the word into the array
      corrections.push(word);
    }
  }
  // return the string
  return corrections.join(' ');
};

// turn the corrected spelling string into tokens
const tokenizeInput = (inputString) => {
  return tokenizer.tokenize(inputString);
};

// correct spelling
const correctedSpelling = correctSpelling(inputString);
// pass the corrected spelling string to the tokenizer
const tokens = tokenizeInput(correctedSpelling);
// log the tokens
console.log(tokens);
