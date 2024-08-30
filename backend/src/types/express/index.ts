import express from 'express';
import { AccessJWTResponse } from '..';

export interface Req extends express.Request {
  body: {
    email: string;
    name: string;
    password: string;
    username: string;
  };
  query: {
    q?: string;
    username?: string;
  };
  params: {
    id?: string;
  };
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
  user?: AccessJWTResponse;
}

export interface Res extends express.Response {}

export interface Next extends express.NextFunction {}
