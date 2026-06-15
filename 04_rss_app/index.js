// library for turning rss xml feeds into JavaScript objects
import Parser from 'rss-parser';

const parser = new Parser();

const main = async () => {
  const url = 'https://www.bonappetit.com/feed/recipes-rss-feed/rss';
  // fetches and parses from the url, and destructure the response object
  const { title, items } = await parser.parseURL(url);
  // feed title
  console.log(title);
  // title and link of each item
  const results = items.map(({ title, link }) => ({ title, link }));
  console.clear();
  console.table(results);
  // tracks periodic updates
  const today = Temporal.Now.zonedDateTimeISO('America/Toronto');
  console.log('Last updated', today.toString());
};
// fetches updates periodically
setInterval(main, 2000);
