import express from 'express';

const app = express();

// SMS providers often post form-encoded bodies, so accept both JSON and urlencoded.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/messages', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

export default app;
