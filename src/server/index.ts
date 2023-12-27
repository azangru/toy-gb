import Fastify from 'fastify';
import cors from '@fastify/cors';

import readGenes from './genes';

const fastify = Fastify({
  logger: true
});
fastify.register(cors);

fastify.get('/', async (_, response) => {
  response.send('Hello World');
});

fastify.post('/data', async (req, res) => {
  return await readGenes(JSON.parse(req.body as any));
});


(async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})();
