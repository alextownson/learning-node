// a router used to define routes that have to do with creating reading, updating or deleting book records

// takes the fastify instance and optional parameters
async function booksRouter(fastify, _opts) {
  // register a get route with a dynamic :id parameter
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const book = { id };
      reply.send(book);
    } catch (e) {
      console.error('Error occurred:', e.message);
      reply.send(e);
    }
  });
}

export default booksRouter;
