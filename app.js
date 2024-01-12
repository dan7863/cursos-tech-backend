import express from 'express';
import cors from "cors";
import loadRoutes from './src/routes/index.js';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.disable('x-powered-by');

loadRoutes(app);

export default app;