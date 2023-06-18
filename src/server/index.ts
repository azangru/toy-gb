import express from 'express';

import readGenes from './genes';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  await readGenes();

  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})