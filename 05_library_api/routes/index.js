import booksRouter from './booksRouter.js';

// function to group and register all of my routes
async function routes(fastify, _opts) {
  fastify.register(booksRouter, { prefix: '/books' });
}

export default routes;
