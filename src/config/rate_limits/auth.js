import limit from "../../utils/limit.js";

export const loginLimiter = limit(60, 5, 'Too many requests, please try again later.');
export const resendLimiter = limit(60, 3, 'Too many requests, please try again later.');