import { rateLimit } from 'express-rate-limit';

const limit = (minutes, tries, message) => {
    const limiter = rateLimit({
        windowMs: minutes * 60 * 1000,
        max: tries,
        message: {
            message: message
        }
    });

    return limiter; 
}

export default limit;