import Fastify from 'fastify';
import operatingHours from './data/operatingHours.js';
import menuItems from './data/menuItems.js';
// package to convert HTM content with dynamic data into static HTML pages
import ejs from 'ejs';
// enables you to use EJS as a templating engine in your Fastify project
import fastifyView from '@fastify/view';
// enables you to use static content in a public folder like stylesheets or images
import fastifyStatic from '@fastify/static';
import { join } from 'path';

// instantiate a new instance of Fastify (web server)
const app = Fastify();
const port = 3000;
// absolute path to the public directory for serving static content
const publicPath = join(process.cwd(), 'public');

app.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
});

// registers the plugin to enable serving static files
app.register(fastifyStatic, {
  // where the static files will be served from
  root: publicPath,
  // sets the URL prefix for the static files
  prefix: '/public/',
});

// register the routes
app.get('/', (request, reply) => {
  // reply.veiw method renders pages with HTML and EJS templates
  reply.view('views/index.ejs', { name: "What's Fare is Fair" });
});

app.get('/menu', (request, reply) => {
  reply.view('views/menu.ejs', { menuItems });
});

app.get('/hours', (request, reply) => {
  const today = Temporal.Now.plainDateISO().toLocaleString('en-US', {
    weekday: 'long',
  });
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  reply.view('views/hours.ejs', { operatingHours, days, today });
});

app.get('/about', (request, reply) => {
  reply.view('views/about.ejs', { name: "What's Fare is Fair" });
});

// start the server and bind it to the defined port
app.listen({ port });
console.log(`Web Server is listening at http://localhost:${port}`);
