import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../database/connection.js";
import { UserNames, TokenNames } from "../config/names.js";
import { TOKEN_SECRET } from "../config/config.js";

export default class AuthModel{

    static async signIn({user}){
        const {email, password} = user;
        try{
            const [rows] = await pool.query("SELECT * FROM ?? where email=?", [UserNames.database_table_name, email]);
            
            if(rows.length <= 0) return { success: false, status: 404, message: 'User not Found.' };

            const match = await bcrypt.compare(password, rows[0].password);

            if(!match) return { success: false, status: 401, message: 'Invalid Credentials.' };

            const data = JSON.stringify({"id": rows[0].id, "exp": Date.now() + 60 * 1000});
            
            const token = jwt.sign(data, TOKEN_SECRET);

            return { success: true, status: 200, token: token };

        } catch(error){
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
            const [emailValidation] = await pool.query("SELECT email FROM ?? where email=?", [UserNames.database_table_name, email]);
            
            if(emailValidation.length > 0) return { success: false, status: 409, message: 'Email already exists.' };

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const [rows] = await pool.query("INSERT INTO ?? (name, email, password, active) VALUES (?, ?, ?, ?)", [UserNames.database_table_name, name, email, hashedPassword, false]);
            
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
            console.log(err);
            //Logging error
            return { success: false, status: err.statusCode, message: 'Something were wrong.' };
        }
    }

    static async verifyToken({header}) {
        if(!header) return res.status(401).json({ message:'Unauthorized'});
    
        const token = header.split(" ")[1];
    
        if(token.length == 0) return res.status(400).json({ message:'Empty Token'});
        
        const content = jwt.verify(token, TOKEN_SECRET);
    
        if(Date.now() > content.exp){
            return res.status(401).json({ message:'Token Expired'});
        }
        req.data = content;

        return req.data;
    }

    static async confirmEmail({url}){
        const {email, tokenize} = url;
        console.log(url);
        try{
            const [token] = await pool.query("SELECT * FROM ?? where token=?", [TokenNames.database_table_name, tokenize]);
       
            if(token.length <= 0) return { success: false, status: 400, message: 'Your verification link may have expired. Please click on resend for verify your Email.' };
        
            const [user] = await pool.query("SELECT * FROM ?? where id=? AND email=?", [UserNames.database_table_name, token[0].user_id, email]);
            
            if(user.length <= 0) {
                return { success: false, status: 404, message: 'User not Found.' };
            }
            else if (user[0].active) {
                return { success: true, status: 200, message: 'User has been already verified. Please Login.' }; 
            }
            else{
                user[0].active = true;
                const [userResult] = await pool.query(`UPDATE ?? SET active = ? WHERE id = ?`, [UserNames.database_table_name, user[0].active, user[0].id]);

                if(userResult.affectedRows === 0) return { success: false, status: 404, message: 'User not Found.' };

                const [tokenResult] = await pool.query(`DELETE FROM ?? WHERE token=?`, [TokenNames.database_table_name, tokenize]);

                if(tokenResult.affectedRows === 0) return { success: false, status: 404, message: 'Token not Found.' };

                return { success: true, status: 200, message: 'Your account has been successfully verified' };
            }
        }
        catch(e){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            //Logging error
            return { success: false, status: err.statusCode, message: 'Something were wrong.' };
        }
    }

    static async resendLink({email}){
        const [rows] = await pool.query("SELECT * FROM ?? where email=?", [UserNames.database_table_name, email]);

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

}