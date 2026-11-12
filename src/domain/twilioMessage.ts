import { z } from 'zod';

export interface TwilioMessage {
  MessageSid: string;
  AccountSid: string;
  From: string;
  To: string;
  Body: string;
  NumMedia?: number | undefined;
}

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
