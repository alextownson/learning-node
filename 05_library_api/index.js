import Fastify from 'fastify';
// fastify plugin that enables URL-encoded form parsing
import formbody from '@fastify/formbody';

// instantiate fastify
const app = Fastify();
const PORT = 3000;
// register the plugin
await app.register(formbody);

// add a GET request for the main URI endpoint
// _ before a variable is used to indicate it won't be used in the function
app.get('/', async (_request, reply) => {
  // respond with a JSON message
  reply.send({ message: 'ok' });
});

// handle all other requests that are not handled by my get route
app.setNotFoundHandler((request, reply) => {
  const { message, statusCode } = request.error || {};
  reply.status(statusCode || 500).send({ message });
});

// start listening for requests
try {
  await app.listen({ port: PORT });
  console.log(`Listening at http://localhost:${PORT}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
