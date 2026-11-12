import type { Request, Response } from 'express';

import { sendEmail } from '../adapters/email.js';

export const messagesHandler = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);

  // Wait for the email before responding: Vercel can freeze the function once
  // the response is sent. If sending fails, Express 5 returns a 500, so the
  // SMS provider can retry.
  await sendEmail({
    subject: 'New SMS message',
    text: JSON.stringify(req.body ?? null, null, 2),
  });

  res.sendStatus(200);
};
