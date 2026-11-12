import express from 'express';

import { messagesHandler } from './handlers/messages.js';
import { validateTwilioSignature } from './middleware/twilio-signature.js';

const app = express();

// Vercel terminates TLS at its proxy; trust X-Forwarded-Proto so req.protocol
// is "https", which the Twilio signature check depends on.
app.set('trust proxy', true);

// Twilio uses form-encoded posts
app.use(express.urlencoded({ extended: true }));

app.post('/messages', validateTwilioSignature, messagesHandler);

export default app;
