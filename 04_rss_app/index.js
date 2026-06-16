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
    for (let { title, link, pubDate } of items) {
      // pubDate is RFC 2822 (RSS format)
      // date parses it into a JS Date object
      // toISOString() normalizes it into ISO 8601 format
      // Temporal.Instant converts that ISO string into a high-precision absolute timestamp
      // Instants can then be safely compared and used for time arithmetic
      const publishedInstant = Temporal.Instant.from(
        new Date(pubDate).toISOString(),
      );
      //filter those - only ones with titles including 'salad'
      if (!filterKeyword) {
        feedItems.push({ title, link, published: publishedInstant });
      } else {
        if (title.toLowerCase().includes(filterKeyword.trim().toLowerCase())) {
          // add those into the feedItems array
          feedItems.push({ title, link, published: publishedInstant });
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
  // format the published date using the helper function
  const formatted = feedItems.concat(customItems).map((item) => ({
    title: item.title,
    link: item.link,
    // if the published date is truthy, use the helper, if not, set the published date to unknown
    published: item.published ? formatTimeAgo(item.published) : 'Unknown',
  }));
  // print formatted items to the console
  console.table(formatted);
  // tracks periodic updates
  const now = Temporal.Now.instant();
  console.log('Last updated', now.toString());
};

// helper function to compare the published date to the current date
const formatTimeAgo = (instant) => {
  // get current absolute time as a Temporal.Instant
  const now = Temporal.Now.instant();

  // create a Temporal.Duration representing how much time has passed from 'instant' to 'now'
  // if 'instant' is in the past, this is a positive duration
  const diff = now.since(instant);

  // convert full duration into total seconds
  const seconds = Math.floor(diff.total('seconds'));
  // if less than 60 seconds, show seconds
  if (seconds < 60) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;

  // convert full duration into total minutes
  const minutes = Math.floor(diff.total('minutes'));
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

  // convert full duration into total hours
  const hours = Math.floor(diff.total('hours'));
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  // convert full duration into total days
  const days = Math.floor(diff.total('days'));
  return `${days} day${days > 1 ? 's' : ''} ago`;
};
