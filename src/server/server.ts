import express from 'express';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello, world');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
