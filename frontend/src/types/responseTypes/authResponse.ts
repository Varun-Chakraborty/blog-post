import { Profile } from '../baseTypes';
import { APIResponse } from './baseResponse';

export interface LoginResponse extends APIResponse {
  data?: {
    user: Profile;
    accessToken: string;
  };
}

export interface SignupResponse extends APIResponse {
  data?: {
    user: Profile;
    accessToken: string;
  };
}
