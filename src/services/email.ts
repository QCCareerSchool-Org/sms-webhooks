import type { Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';

export interface Email {
  subject: string;
  text: string;
}

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
};

// Created on first use and reused while the serverless instance stays warm.
let transporter: Transporter | undefined;

const getTransporter = (): Transporter => {
  transporter ??= nodemailer.createTransport({
    host: requireEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: requireEnv('SMTP_USER'),
      pass: requireEnv('SMTP_PASS'),
    },
  });
  return transporter;
};

export const sendEmail = async ({ subject, text }: Email): Promise<void> => {
  await getTransporter().sendMail({
    from: requireEnv('EMAIL_FROM'),
    to: requireEnv('EMAIL_TO'),
    subject,
    text,
  });
};
