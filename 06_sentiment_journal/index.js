// import a dictionary for use with spell-checker
import dictionary from 'dictionary-en';
// import spell-checker - had to use a different package than textbook
import nspell from 'nspell';

// create an nspell instance with the dictionary
const spell = nspell(dictionary);

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

console.log(correctSpelling(inputString));
