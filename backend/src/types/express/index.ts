import express from 'express';
import { User } from '..';

export interface Req extends express.Request {
  body: {
    email?: string;
    name?: string;
    password?: string;
    username?: string;
  };
  query: {
    q?: string;
    searchFor?: string;
    username?: string;
  };
  params: {
    id?: string;
  };
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
  user?: User;
}

export interface Res extends express.Response {}

export interface Next extends express.NextFunction {}
