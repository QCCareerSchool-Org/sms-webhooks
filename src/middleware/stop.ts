import type { RequestHandler } from 'express';
import twilio from 'twilio';

// Auto-unsubscribe from this short code: reply STOP and skip the email.
const AUTO_STOP_SENDERS = new Set([ '66377' ]);

export const stopMiddleware: RequestHandler = (req, res, next) => {
  if (!AUTO_STOP_SENDERS.has(req.body?.From)) {
    next();
    return;
  }

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message('STOP');
  res.type('text/xml').send(twiml.toString());
};
