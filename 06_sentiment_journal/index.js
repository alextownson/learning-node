import SentimentJournal from './sentimentJournal.js';

// create a new instance
const journal = new SentimentJournal();
// fetch any saved journal entries from the data source
await journal.fetchEntries();

// begin an infinite loop
while (true) {
  // prompt the user for a journal entry
  await journal.promptEntry();
  // analyze the sentiment of the most recent journal entry
  await journal.analyzeSentiment();
}
