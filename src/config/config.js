import {config} from 'dotenv';

config();

//GENERAL
export const PORT = process.env.PORT || 3000;
export const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
// export const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

//DB
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_DATABASE = process.env.DB_DATABASE || 'test';
export const DB_PORT = process.env.DB_PORT || 3306;

//MAIL
export const MAIL_HOST = process.env.MAIL_HOST || 'smtp.gmail.com';
export const MAIL_SERVICE = process.env.MAIL_HOST || 'gmail';
export const MAIL_PORT = process.env.MAIL_PORT || 587;
export const MAIL_SECURE = process.env.MAIL_SECURE || true;
export const MAIL_USER = process.env.MAIL_USER || '';
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || '';
export const MAIL_ADDRESS = process.env.MAIL_ADDRESS || '';
