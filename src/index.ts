import express from 'express';

import { messagesHandler } from './handlers/messages.js';

const app = express();

// SMS providers often post form-encoded bodies, so accept both JSON and urlencoded.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/messages', messagesHandler);

export default app;
