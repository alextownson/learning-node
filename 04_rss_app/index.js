const main = async () => {
  const url = 'https://www.bonappetit.com/feed/recipes-rss-feed/rss';
  // make a get request with the url
  const response = await fetch(url);
  // test reads the response body as a string
  console.log(await response.text());
};
main();
