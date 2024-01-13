import AuthModel from "../models/auth.js";
import sendEmail from "../utils/send_email.js";
import VerifyTokenModel from "../models/verify_token.js";
import { BASE_URL } from "../config/config.js";


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


    /*
        Based on: https://stackoverflow.com/questions/39092822/how-to-confirm-email-address-using-express-node
    */
    static verificationEmail = async (email, user_id) => {
        const subject = 'Account Verification Link';
        const result = await VerifyTokenModel.createToken(user_id);
       
        if(!result.success) return result.success;

        const text = 'Hello,\n\n' + 'Please verify your account by clicking the link: \n'+BASE_URL+'\/api\/confirmation\/' + email + '\/' + result.token + '\n\nThank You!\n';
        
        const email_sent = await sendEmail(
            email,
            subject,
            text
        );
        
        return email_sent.success;
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

        if(result.success) {
            const emailSent = await this.verificationEmail(result.user.email, result.user.id);
            if(!emailSent){
                res.status(emailSent.status).json({message: emailSent.message});
            }
        }

        res.status(result.status).json(result.success ? result.user : {message: result.message})
    }

    static confirmEmail = async (req, res) => {
        const url = {
            email: req.params.email,
            tokenize: req.params.token
        }

        const result = await AuthModel.confirmEmail({url});

        res.status(result.status).json({message: result.message});
    }

    static resendLink = async (req, res) => {
        const {email} = req.body;
 
       const result = await AuthModel.resendLink({email});
       console.log(result);
       if(result.status == 202){
            const emailSent = await this.verificationEmail(result.message.email, result.message.id);
            if(emailSent){
                result.status = 200;
                result.message = 'Link has been successfully sent.';
            }
       }

       res.status(result.status).json({message: result.message});
    }
}

