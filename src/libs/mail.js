import nodemailer, { createTransport } from 'nodemailer';
import { generateApplicationError } from './error.js';
import { EMAIL_ADDRESS, EMAIL_PASSWORD, FRONTEND_URL } from './env.js';

/** @param {nodemailer.SendMailOptions} options */
export async function sendEmail(options) {
  const client = createTransport({
    service: 'Gmail',
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD
    }
  });

  try {
    await client.sendMail(options);
  } catch (err) {
    throw generateApplicationError(err, 'Error while sending email', 500);
  }
}

/**
 * @param {string} email
 * @param {string} token
 */
export async function sendResetPasswordEmail(email, token) {
  const resetPasswordUrl = `${FRONTEND_URL}/password-reset/${token}`;

  await sendEmail({
    to: email,
    from: 'Learnify <noreply@gmail.com>',
    subject: 'Reset Password',
    html: `
      <h1>Reset Password</h1>
      <p>Click <a href="${resetPasswordUrl}">this link</a> to reset your password.</p>
    `
  });
}
