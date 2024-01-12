import userRoutes from "./user.js";
import authRoutes from './auth.js';

const loadRoutes = (app) => {
    //Auth
    app.use('/api', authRoutes);

    
    app.use('/api', userRoutes);
};

export default loadRoutes;