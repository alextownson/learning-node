// import a dictionary for use with spell-checker
import dictionary from 'dictionary-en';
// import spell-checker - had to use a different package than textbook
import nspell from 'nspell';
// import natural language processor
import natural from 'natural';
// import remove stop words function
import { removeStopwords } from 'stopword';

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
    // analyze the input string's sentiment by running get sentiment on your tokens
    const sentimentResults = analyzer.getSentiment(tokens);
    // log the sentiment results
    console.log(sentimentResults);
  } catch (e) {
    console.log(`An error occurred: ${e}`);
  }
})();
