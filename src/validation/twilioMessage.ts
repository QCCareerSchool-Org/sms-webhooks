import { z } from 'zod';

import type { TwilioMessage } from '../domain/twilioMessage.js';

// Runtime check for Twilio's inbound message webhook body. The annotation
// makes the compiler keep this in sync with the TwilioMessage domain type.
export const twilioMessageSchema: z.ZodType<TwilioMessage> = z.looseObject({
  MessageSid: z.string(),
  AccountSid: z.string(),
  From: z.string(),
  To: z.string(),
  Body: z.string(),
  NumMedia: z.coerce.number().optional(),
});
