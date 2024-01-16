import sendEmail from "../utils/nodemailer.js";

const mailer = async (email, subject, text) => {
    
    const email_sent = await sendEmail(
        email,
        subject,
        text
    );
    
    return email_sent.success;
}
export default mailer;