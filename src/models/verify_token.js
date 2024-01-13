import pool from "../database/connection.js";

import { TokenNames } from "../config/names.js";
import * as crypto from "crypto";

export default class VerifyTokenModel{

    static async createToken(user_id){
        try{
            const [validation] =  await pool.query("SELECT * FROM ?? where user_id=?", [TokenNames.database_table_name, user_id]);
            const tokenize = crypto.randomBytes(16).toString('hex');

            if(validation.length <= 0){
                const [rows] = await pool.query(`INSERT INTO ?? (user_id, token) VALUES (?, ?)`, [TokenNames.database_table_name, user_id, tokenize]);
            }
            else{
                const [rows] = await pool.query(`UPDATE ?? SET token=? WHERE user_id=?`, [TokenNames.database_table_name, tokenize, user_id]);
            }

            return { success: true, status: 200, token: tokenize};
        } catch(err){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            return { success: false, status: err.statusCode, message: 'Something were wrong.' };
        }
    };

}