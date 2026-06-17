// a router used to define routes that have to do with creating reading, updating or deleting book records

// import my Book model
import Book from '../models/book.js';

// takes the fastify instance and optional parameters
async function booksRouter(fastify, _opts) {
  // register a GET route with a dynamic :id parameter
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      // runs a query to find a Book by its primary key - id
      const book = await Book.findByPk(id);
      reply.send(book);
    } catch (e) {
      console.error('Error occurred:', e);
      reply.send(e);
    }
  });

  // register a PUT route
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params;
    const { title, author } = request.body;
    try {
      // runs a query to find a Book by its primary key and update the author and title fields
      const book = await Book.update(
        { title, author },
        {
          where: { id },
        },
      );
      reply.send(book);
    } catch (e) {
      console.error('Error occurred:', e);
      reply.send(e);
    }
  });

  // register a DELETE route
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      // runs a query to find a Book by its primary key and delete it from the database
      const book = await Book.destroy({
        where: { id },
      });
      reply.send(book);
    } catch (e) {
      console.error('Error occurred:', e);
      reply.send(e);
    }
  });

  // register a POST route
  fastify.post('/', async (request, reply) => {
    const { title, author } = request.body;
    try {
      // runs a query to create a new Book record with a title and author field
      const book = await Book.create({ title, author });
      reply.send(book);
    } catch (e) {
      console.error('Error occurred:', e);
      reply.send(e);
    }
  });
}

export default booksRouter;
