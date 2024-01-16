import nodemailer from "nodemailer";
import {
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USER,
  MAIL_SECURE,
  MAIL_ADDRESS
} from "../config/config.js";

const sendEmail = async (email, subject, text) => {
  try {
    //Producción
    // const transporter = nodemailer.createTransport({
    //   host: MAIL_HOST,
    //   port: Number(MAIL_PORT),
    //   secure: Boolean(MAIL_SECURE),
    //   auth: {
    //     user: MAIL_USER,
    //     pass: MAIL_PASSWORD,
    //   }
    // });

    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
      }
    });
   
    try{
      await transporter.sendMail({
        from: MAIL_ADDRESS,
        to: email,
        subject: subject,
        text: text,
      });
    } catch(e){
      console.log(e);
    }
    
    return { success: true, status: 200, message: 'A verification email has been sent to ' + email + '. It will be expire after one day. If you not get verification Email click on resend token.' };
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return { success: false, status: err.statusCode, message: err };
  }
};

export default sendEmail;
