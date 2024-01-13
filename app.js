import express from 'express';
import cors from "cors";
import helmet from 'helmet';
import loadRoutes from './src/routes/index.js';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.disable('x-powered-by');
app.use(helmet());

loadRoutes(app);

export default app;