import type { RequestHandler } from 'express';
import twilio from 'twilio';

import { twilioMessageSchema } from '../domain/twilioMessage.js';
import { sendEmail } from '../services/email.js';

// Senders we auto-unsubscribe from by replying STOP.
const AUTO_STOP_SENDERS = new Set([ '66377' ]);

export const messagesHandler: RequestHandler = async (req, res) => {
  const result = twilioMessageSchema.safeParse(req.body);
  if (!result.success) {
    res.sendStatus(400);
    return;
  }

  const message = result.data;
  console.log(message);

  if (AUTO_STOP_SENDERS.has(message.From)) {
    // Unsubscribe instead of forwarding the message.
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('STOP');
    res.type('text/xml').send(twiml.toString());
    return;
  }

  // Wait for the email before responding: Vercel can freeze the function once
  // the response is sent. If sending fails, Express 5 returns a 500. Twilio
  // doesn't retry inbound messages; the failure only shows up as an error in
  // the Twilio console.
  await sendEmail({
    subject: 'New SMS message',
    text: JSON.stringify(message, null, 2),
  });

  // Twilio treats a plain-text body as a reply to send back ("OK" from
  // sendStatus). An empty TwiML <Response/> acknowledges without replying.
  res.type('text/xml').send(new twilio.twiml.MessagingResponse().toString());
};
