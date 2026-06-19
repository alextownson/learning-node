// import a dictionary for use with spell-checker
import dictionary from 'dictionary-en';
// import spell-checker - had to use a different package than textbook
import nspell from 'nspell';
// import natural language processor
import natural from 'natural';
// import remove stop words function
import { removeStopwords } from 'stopword';
import prompt from 'prompt';

// create an nspell instance with the dictionary
const spell = nspell(dictionary);

// instantiate a new tokenizer
const tokenizer = new natural.WordTokenizer();

prompt.start({});
prompt.message = '';

const correctSpelling = async (inputString) => {
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

// turn the corrected spelling string into tokens
const tokenizeInput = (inputString) => {
  return tokenizer.tokenize(inputString);
};

// prompt for user input
(async () => {
  try {
    const { inputString } = await prompt.get([
      {
        name: 'inputString',
        description: 'How do you feel?',
      },
    ]);
    // correct spelling
    const correctedSpelling = await correctSpelling(inputString);
    // pass the corrected spelling string to the tokenizer
    const tokens = tokenizeInput(correctedSpelling);
    // destructure sentiment analyzing and stemming from natural
    const { SentimentAnalyzer, PorterStemmer } = natural;
    // instantiate a new analyzer that includes stemming configurations instead of stemming in a separate function
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    // analyze hte input string's sentiment by running get sentiment on your tokens
    const sentimentResults = analyzer.getSentiment(tokens);
    // log the sentiment results
    console.log(sentimentResults);
  } catch (e) {
    console.log(`An error occurred: ${e}`);
  }
})();
