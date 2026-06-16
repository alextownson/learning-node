// library for turning rss xml feeds into JavaScript objects
import Parser from 'rss-parser';
import promptModule from 'prompt-sync';

const parser = new Parser();
// sigint: true allows you to kill the script with ctrl+c
const prompt = promptModule({ sigint: true });
const customItems = [];
const filterKeyword = prompt('Filter feed items by keyword: ');

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
// calls once then calls periodically - change to a longer time to avoid 409 code (rate limiting)
main();
setInterval(main, 60_000);

const aggregate = (responses, feedItems) => {
  // for each item in the responses
  for (let { items } of responses) {
    // get the title and link of the item
    for (let { title, link } of items) {
      //filter those - only ones with titles including 'salad'
      if (!filterKeyword) {
        feedItems.push({ title, link });
      } else {
        if (title.toLowerCase().includes(filterKeyword.trim().toLowerCase())) {
          // add those into the feedItems array
          feedItems.push({ title, link });
        }
      }
    }
  }
  return feedItems;
};

const print = (feedItems) => {
  // prompt user to add a new feed item title and link
  const res = prompt('Add item: ');
  // split the input string to destructure a title and link
  const [title, link] = res.split(',');
  // as long as they're not undefined, add them to the customItems array
  if (![title, link].includes(undefined)) customItems.push({ title, link });
  console.clear();
  // print feed and custom items to the console
  console.table(feedItems.concat(customItems));
  // tracks periodic updates
  const today = Temporal.Now.zonedDateTimeISO('America/Toronto');
  console.log('Last updated', today.toString());
};
