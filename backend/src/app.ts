import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import v1Router from './router/v1.route';

app.use('/api/v1', v1Router);

app.get('/', (req, res) =>
  res.send('API v1.0\nAvailable Sub-Routes:\n- ./api/v1')
);

export default app;
