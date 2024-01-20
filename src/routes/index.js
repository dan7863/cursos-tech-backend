import userRoutes from "./user.js";
import authRoutes from './auth.js';
import courseRoutes from './course.js';

const loadRoutes = (app) => {
    //Auth
    app.use('/api', authRoutes);
    app.use('/api', userRoutes);
    app.use('/api', courseRoutes);
};

export default loadRoutes;