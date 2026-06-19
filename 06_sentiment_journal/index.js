// import a dictionary for use with spell-checker
import dictionary from 'dictionary-en';
// import spell-checker - had to use a different package than textbook
import nspell from 'nspell';
// import natural language processor
import natural from 'natural';
import { removeStopwords } from 'stopword';

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

// // stemming -> a fast, rule-based text preprocessing technique that reduces inflected or derived words to their root or base form by stripping away suffixes and prefixes
// const stemWords = (tokens) => {
//   const stems = [];
//   // loop through each token
//   for (let token of tokens) {
//     // break each word down to it's stem
//     const stem = natural.PorterStemmer.stem(token);
//     // add the stems to the stems array
//     stems.push(stem);
//   }
//   return stems;
// };

// correct spelling
const correctedSpelling = correctSpelling(inputString);
// pass the corrected spelling string to the tokenizer
const tokens = tokenizeInput(correctedSpelling);
// // pass the tokens to the stemming function
// const stems = stemWords(tokens);
// // pass the stems to the remove stop words function
// const removedStopWords = removeStopwords(stems);
// log the stems

// destructure sentiment analyzing and stemming from natural
const { SentimentAnalyzer, PorterStemmer } = natural;
// instantiate a new analyzer that includes stemming configurations instead of stemming in a separate function
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
// analyze hte input string's sentiment by running get sentiment on your tokens
const sentimentResults = analyzer.getSentiment(tokens);
// log the sentiment results
console.log(sentimentResults);
