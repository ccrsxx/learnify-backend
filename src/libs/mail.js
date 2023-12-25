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
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can ignore this email.</p>
    `
  });
}

/**
 * @param {string} email
 * @param {number} otp
 */
export async function sendOtpEmail(email, otp) {
  await sendEmail({
    to: email,
    from: 'Learnify <noreply@gmail.com>',
    subject: 'OTP Verification',
    html: `
      <h1>OTP Verification</h1>
      <p>Thank you for choosing Learnify! To ensure the security of your account, we require you to verify your identity using the following One-Time Password (OTP)</p>
      <h3>Your OTP: ${otp}</h3>
      <p>Please note that this OTP is valid for a limited time, so make sure to complete the verification promptly.</p>
      <p>If you didn't request this OTP, you can ignore this email.</p>
    `
  });
}
