import nodemailer from "nodemailer";
import {
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_SERVICE,
  MAIL_USER,
  MAIL_SECURE,
} from "../config/config.js";

const sendEmail = async (email, subject, text) => {
console.log(MAIL_PASSWORD);
  try {
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      service: MAIL_SERVICE,
      port: Number(MAIL_PORT),
      secure: Boolean(MAIL_SECURE),
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
      tls: {
        ciphers:'SSLv3'
      }
    });

    await transporter.sendMail({
      from: MAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });

    return { success: true, status: 200, message: 'A verification email has been sent to ' + email + '. It will be expire after one day. If you not get verification Email click on resend token.' };
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return { success: false, status: err.statusCode, message: err };
  }
};

export default sendEmail;
