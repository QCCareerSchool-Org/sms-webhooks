import type { RequestHandler } from 'express';
import twilio from 'twilio';
import { z } from 'zod';

/**
 * Rejects requests whose X-Twilio-Signature doesn't match the URL and
 * form-encoded body, signed with our Twilio auth token.
 *
 * Needs `app.set('trust proxy', true)` so req.protocol is the public https
 * scheme Twilio signed, not the internal one.
 */
export const checkSignatureMiddleware: RequestHandler = (req, res, next) => {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    throw new Error('Missing environment variable TWILIO_AUTH_TOKEN');
  }

  const signature = req.get('X-Twilio-Signature');
  if (!signature) {
    res.sendStatus(403);
    return;
  }

  // Twilio signs the exact URL it called, including any query string.
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const params = z.record(z.string(), z.string()).parse(req.body ?? {});

  if (!twilio.validateRequest(authToken, signature, url, params)) {
    res.sendStatus(403);
    return;
  }

  next();
};
