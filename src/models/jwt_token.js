import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";


export default class JWTTokenModel{

    //Time in minutes
    static signJWTToken(info, time = 0){
       
        if(time){
            info.exp = Date.now() + (60*time) * 100;
        }

        const data = JSON.stringify(info);
        
        const token = jwt.sign(data, TOKEN_SECRET);
        
        return token;
    }

    static decodeJWTToken(tokenize){
        return JSON.parse(atob(tokenize.split('.')[1]));
    }

    static verifyBearerForJWT(authorization) {
        console.log(authorization);
        if(!authorization) return { success: false, status: 401, message: 'Anauthorized.' };
        const token = authorization.split(" ")[1];
    
       
        const content = this.verifyJWT(token);

        return {success: content.success, status: content.status, message: content.message};
    }

    static verifyJWT(tokenize){
   
        const content = jwt.verify(tokenize, TOKEN_SECRET);
       
        if(content.length == 0) {
            return { success: false, status: 401, message: 'Empty Token.' }
        }

        if(Date.now() > content.exp){
            return { success: false, status: 401, message: 'Your verification link may have expired. Please click on resend for reset your Password.' };
        }
    
        
        return { success: true, status: 200, message: content };
    }
}


