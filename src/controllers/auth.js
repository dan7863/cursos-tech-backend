import AuthModel from "../models/auth.js";
import VerifyTokenModel from "../models/verify_token.js";
import { BASE_URL } from "../config/config.js";
import mailer from "../services/mailer.js";
import JWTTokenModel from "../models/jwt_token.js";


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
            const token = await VerifyTokenModel.createToken(result.user.id);
            if(!token.success) return res.status(token.status).json({message: token.message});

            const emailSent = await this.sendAuthEmail(
                result.user.email,
                'Account Verification Link', 
                'Hello,\n\n' + 'Please verify your account by clicking the link: \n',
                'confirmation',
                token.token);
            if(!emailSent){
                res.status(emailSent.status).json({message: emailSent.message});
            }
        }

        res.status(result.status).json(result.success ? 'You have successfully registered. Please check your email ('+result.user.email+') to verify your account.' : {message: result.message})
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
        if(result.status == 202){
            const token = await VerifyTokenModel.createToken(result.user.id);
            if(!token.success) return res.status(token.status).json({message: token.message});

             const emailSent = await this.sendAuthEmail(
                 result.message.email,
                 'Account Verification Link', 
                 'Hello,\n\n' + 'Verification has been resent. Please verify your account by clicking the link: \n',
                 'confirmation',
                 token.token);
             if(emailSent){
                 result.status = 200;
                 result.message = 'Link has been successfully sent.';
             }
        }
 
        res.status(result.status).json({message: result.message});
     }
 

    static recoverPassword = async (req, res) => {
        const { email } = req.body;
        const result = await AuthModel.recoverPassword(email);
       
        if(result.success) {
            const emailSent = await this.sendAuthEmail(
                email,
                'Reset Password',
                'Hello,\n\n' + 'Password reset link has been sent. Please recover your password by clicking the link: \n',
                'reset',
                result.token);
            if(!emailSent){
                res.status(emailSent.status).json({message: emailSent.message});
            }
        }

        res.status(result.status).json(result.success ? 'You have successfully request your password reset. Please check your email ('+email+') to verify your account.' : {message: result.message})
    }


    static confirmPassword = async (req, res) => {
        const url = {
            email: req.params.email,
            tokenize: req.params.token
        }


        const result = await AuthModel.confirmPassword({url});
     
        res.status(result.status).json({message: result.message});
     }

     static resetPassword = async (req, res) => {
        const token_verification = JWTTokenModel.verifyBearerForJWT(req.headers.authorization);

        if(!token_verification.success) return res.status(token_verification.status).json({message: token_verification.message});

        const { email, password, confirmPassword } = req.body;
        const form = {
            email,
            password,
            confirmPassword
        }

        const result = await AuthModel.resetPassword({form});

        res.status(result.status).json(result.message);
    }

     
    /*
        Based on: https://stackoverflow.com/questions/39092822/how-to-confirm-email-address-using-express-node
    */
    static sendAuthEmail = async (email, subject, text, url, token) =>{
        
        text += BASE_URL+'\/api\/'+ url + '\/' + email + '\/' + token + '\n\nThank You!\n';

        return mailer(email, subject, text);
    }
}

