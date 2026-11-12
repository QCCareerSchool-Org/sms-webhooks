import type { RequestHandler } from 'express';
import twilio from 'twilio';

import { sendEmail } from '../adapters/email.js';

export const messagesHandler: RequestHandler = async (req, res) => {
  console.log(req.body);

  // Wait for the email before responding: Vercel can freeze the function once
  // the response is sent. If sending fails, Express 5 returns a 500. Twilio
  // doesn't retry inbound messages; the failure only shows up as an error in
  // the Twilio console.
  await sendEmail({
    subject: 'New SMS message',
    text: JSON.stringify(req.body ?? null, null, 2),
  });

  // Twilio treats a plain-text body as a reply to send back ("OK" from
  // sendStatus). An empty TwiML <Response/> acknowledges without replying.
  res.type('text/xml').send(new twilio.twiml.MessagingResponse().toString());
};
