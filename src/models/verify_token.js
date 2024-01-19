import pool from "../database/connection.js";

import { TokenNames } from "../config/names.js";
// import * as crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';


export default class VerifyTokenModel{

    static async createToken(user_id){
 
        try{
            const [validation] =  await pool.query("SELECT * FROM ?? where user_id=?", [TokenNames.database_table_name, user_id]);
            // const tokenize = crypto.randomBytes(16).toString('hex');
            const tokenize = uuidv4();
       
            if(validation.length <= 0){
                const [rows] = await pool.query(`INSERT INTO ?? (user_id, token) VALUES (?, ?)`, [TokenNames.database_table_name, user_id, tokenize]);
            }
            else{
                const [rows] = await pool.query(`UPDATE ?? SET token=? WHERE user_id=?`, [TokenNames.database_table_name, tokenize, user_id]);
            }

            return { success: true, status: 200, token: tokenize};
        } catch(err){
            console.log(err);
            if(!err.statusCode){
                err.statusCode = 500;
            }
            return { success: false, status: err.statusCode, message: 'Something were wrong.' };
        }
    };

    static async getToken(tokenize){
        const rows = pool.query("SELECT * FROM ?? where token=?", [TokenNames.database_table_name, tokenize]);
        return rows;
    }

    static async deleteToken(tokenize){
        const rows = pool.query(`DELETE FROM ?? WHERE token=?`, [TokenNames.database_table_name, tokenize]);
        return rows;
    }
}