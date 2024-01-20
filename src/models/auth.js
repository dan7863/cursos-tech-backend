import bcrypt from "bcrypt";
import UserModel from "./user.js";
import VerifyTokenModel from "./verify_token.js";
import JWTTokenModel from "./jwt_token.js";

export default class AuthModel{

    static async signIn({user}){
        const {email, password} = user;
        try{
            const [rows] = await UserModel.getUserByEmail(email);
            
            if(rows.length <= 0) return { success: false, status: 404, message: 'User not Found.' };

            if(!rows[0].active) return { success: false, status: 401, message: 'User not Verified. You can request an email verification' };

            const match = await bcrypt.compare(password, rows[0].password);

            if(!match) return { success: false, status: 401, message: 'Invalid Credentials.' };

            const token = JWTTokenModel.signJWTToken({"id": rows[0].id}, 120);
            
            return { success: true, status: 200, token: token };

        } catch(err){
            console.log(err);
            if(!err.statusCode){
                err.statusCode = 500;
            }
            //Logging error
            return { success: false, status: err.statusCode, message: 'Something were wrong.' };
        }
    }


    static async signUp({form}){
        const {name, email, password, confirmPassword} = form;
        try{
            const [emailValidation] = await UserModel.getUserByEmail(email);
            
            if(emailValidation.length > 0) return { success: false, status: 409, message: 'Email already exists.' };

         
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const [rows] = await UserModel.registerUser(name, email, hashedPassword);
    
            const newUser = {
                id: rows.insertId,
                email,
                passsword: hashedPassword
            };
            return { success: true, status: 201, user: newUser };
        } catch(err){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            return { success: false, status: err.statusCode, message: 'Something were wrong.' };
        }
    }

    static async confirmEmail({url}){
        const {email, tokenize} = url;
        try{
            const [token] = await VerifyTokenModel.getToken(tokenize);
       
            if(token.length <= 0) return { success: false, status: 400, message: 'Your verification link may have expired. Please click on resend for verify your Email.' };
        
            const [user] = await UserModel.getUserByEmail(email);
            
            if(user.length <= 0) {
                return { success: false, status: 404, message: 'User not Found.' };
            }
            else if (user[0].active) {
                return { success: true, status: 200, message: 'User has been already verified. Please Login.' }; 
            }
            else{
                user[0].active = true;
                const [userResult] = await UserModel.activateUser(user[0].id);

                const [tokenResult] = await VerifyTokenModel.deleteToken(tokenize);

                if(tokenResult.affectedRows === 0) return { success: false, status: 404, message: 'Token not Found.' };

                return { success: true, status: 200, message: 'Your account has been successfully verified' };
            }
        }
        catch(err){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            //Logging error
            return { success: false, status: err.statusCode, message: 'Something were wrong.' };
        }
    }

    static async resendLink({email}){
        const [rows] = await UserModel.getUserByEmail(email);

        if(rows.length <= 0) {
            return { success: false, status: 404, message: 'User not Found.' };
        }
        else if (rows[0].active) {
            return { success: true, status: 200, message: 'User has been already verified. Please Login.' }; 
        }
        else{ 
            return { success: true, status: 202, message: rows[0] }; 
        }
    }

    static async recoverPassword(email){
        try{
            const [rows] = await UserModel.getUserByEmail(email);
            
            if(rows.length <= 0) return { success: false, status: 404, message: 'User not Found.' };

            const token = JWTTokenModel.signJWTToken({"id": rows[0].id, "email": rows[0].email}, 120);
           

            return { success: true, status: 200, token: token };

        } catch(err){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            console.log(err);
            //Logging error
            return { success: false, status: err.statusCode, message: 'Something were wrong.' };
        }
    }

    static async validateRequestPassword({url}){
        const {email, tokenize} = url;
     
        try{
          
            const token = JWTTokenModel.verifyJWT(tokenize);

            if(!token.success) return { success: token.false, status: token.status, message: token.message };
       
            const [user] = await UserModel.getUserByEmail(email);
            
            if(user.length <= 0) {
                return { success: false, status: 404, message: 'User not Found.' };
            }
            else{
                return { success: true, status: 202, message: {email: 'Valid Token.'} };
            }
        }
        catch(err){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            //Logging error
            return { success: false, status: err.statusCode, message: 'Something were wrong.' };
        }
    }

    static async resetPassword({form}){
        const {email, password} = form;

        const [user] = await UserModel.getUserByEmail(email);
            
        if(user.length <= 0) {
            return { success: false, status: 404, message: 'User not Found.' };
        }
        else{
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const [userResult] = await UserModel.updatePassword(hashedPassword, user[0].id);

            if(userResult.affectedRows === 0) return { success: false, status: 404, message: 'Token not Found.' };

            return { success: true, status: 200, message: 'Your password has been successfully restored. Please log in' };
        }
    }

  
}