import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'helloadmin@gmail.com',
    pass: '(fill the pass here)'
  }
});

export function sendEmail(/** @type {any} */ mailInfo) {
  transporter.sendMail(
    {
      from: 'Admin Hello World',
      // @ts-ignore
      mailInfo
    },
    (err, info) => {
      if (err) {
        return err; // tolong dicek benernya gimana
      }
      return info;
    }
  );
}
