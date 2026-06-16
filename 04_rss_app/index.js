// library for turning rss xml feeds into JavaScript objects
import Parser from 'rss-parser';

const parser = new Parser();

const main = async () => {
  //fetch from multiple sources - use some different sources than textbook because the ones given are no longer active
  const urls = [
    'https://www.bonappetit.com/feed/recipes-rss-feed/rss',
    'https://smittenkitchen.com/feed/',
    'https://www.spendwithpennies.com/feed/',
  ];
  // stores the RSS feed items
  const feedItems = [];
  //fetches and parses each url
  const awaitableRequests = urls.map((url) => parser.parseURL(url));
  const responses = await Promise.all(awaitableRequests);
  // filter the collective responses and add them into the feedItems array
  aggregate(responses, feedItems);
  // clears the console, prints the feed, tracks update time
  print(feedItems);
};
// fetches updates periodically - change to a longer time to avoid 409 code (rate limiting)
setInterval(main, 60_000);

const aggregate = (responses, feedItems) => {
  // for each item in the responses
  for (let { items } of responses) {
    // get the title and link of the item
    for (let { title, link } of items) {
      //filter those - only ones with titles including 'salad'
      if (title.toLowerCase().includes('salad')) {
        // add those into the feedItems array
        feedItems.push({ title, link });
      }
    }
  }
  return feedItems;
};

const print = (feedItems) => {
  console.clear();
  console.table(feedItems);
  // tracks periodic updates
  const today = Temporal.Now.zonedDateTimeISO('America/Toronto');
  console.log('Last updated', today.toString());
};
