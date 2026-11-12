import type { RequestHandler } from 'express';
import twilio from 'twilio';

import { sendEmail } from '../adapters/email.js';
import { isAutoStopSender } from '../domain/autoStop.js';
import { twilioMessageSchema } from '../validation/twilioMessage.js';

export const messagesHandler: RequestHandler = async (req, res) => {
  const result = twilioMessageSchema.safeParse(req.body);
  if (!result.success) {
    res.sendStatus(400);
    return;
  }

  const message = result.data;
  console.log(message);

  // Twilio treats a plain-text body as a reply to send back ("OK" from
  // sendStatus). An empty TwiML <Response/> acknowledges without replying.
  const twiml = new twilio.twiml.MessagingResponse();

  if (isAutoStopSender(message.From)) {
    // Unsubscribe instead of forwarding the message.
    twiml.message('STOP');
  } else {
    // Wait for the email before responding: Vercel can freeze the function
    // once the response is sent. If sending fails, Express 5 returns a 500.
    // Twilio doesn't retry inbound messages; the failure only shows up as an
    // error in the Twilio console.
    await sendEmail({
      subject: 'New SMS message',
      text: JSON.stringify(message, null, 2),
    });
  }

  res.type('text/xml').send(twiml.toString());
};
