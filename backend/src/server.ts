import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import http from 'node:http';
import { Server } from 'socket.io';

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
import { ApiResponse } from '@/utils';

app.use('/api/v1', v1Router);

app.get('/health', (_, res) => {res.send('OK')});

app.get('*path', (req, res) => {
  new ApiResponse(
    'API v1.0\nAvailable Sub-Routes:\n- ./api/v1\n- ./health\n',
    undefined,
    404
  ).error(res)
});

export const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true }
});

import { setUpSocketListeners } from './socket';
setUpSocketListeners(io);
