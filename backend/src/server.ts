import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import http from 'node:http';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.disable('x-powered-by');

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1)
        callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

import v1Router from './router/v1.route';

app.use('/api/v1', v1Router);

app.get('/health', (_, res) => res.send('OK'));

app.get('*path', (req, res) =>
  res.send('API v1.0\nAvailable Sub-Routes:\n- ./api/v1\n- ./health\n')
);

export const server = http.createServer(app);
