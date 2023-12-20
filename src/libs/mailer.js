import * as nodemailer from 'nodemailer';
import { ApplicationError } from './error.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'lulufaridaalfani73@gmail.com',
    pass: 'ffbs njch ddpy bemw'
  }
});

// @ts-ignore
export function sendEmail(mailInfo) {
  transporter.sendMail(
    {
      from: 'Learnify Security <noreplay@gmail.com>',
      // @ts-ignore
      ...mailInfo
    },
    (err) => {
      if (err) {
        throw new ApplicationError('Failed to send email', 500);
      }
    }
  );
}
