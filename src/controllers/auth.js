import AuthModel from "../models/auth.js";
import sendEmail from "../utils/send_email.js";

export default class AuthController{

    static signIn = async (req, res) => {
        const { email, password } = req.body;
        const user = {
            email,
            password
        }
        const result = await AuthModel.signIn({user});

        res.status(result.status).json(result.success ? {token: result.token} : {message: result.message})
    }

    static verificationEmail = async (email) => {
        const subject = 'Account Verification Link';
        const text = 'Hello\n\n' + 'Please verify your account by clicking the link';
        const result = await sendEmail(
            email,
            subject,
            text
        );

        console.log({message: result.message});
        // res.status(result.status).json({message: result.message});
    }

    static signUp = async (req, res) => {
        const { name, email, password, confirmPassword } = req.body;
        const form = {
            name,
            email,
            password,
            confirmPassword
        }

        const result = await AuthModel.signUp({form});

        if(result.success) this.verificationEmail(result.user.email);

        res.status(result.status).json(result.success ? result.user : {message: result.message})
    }

   
}

