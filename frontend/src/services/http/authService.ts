import { AuthResponseTypes } from '@/types/responseTypes';
import { HTTPService } from './httpService';

class AuthService extends HTTPService {
  constructor() {
    super();
  }

  async login(username: string, password: string) {
    const response = await this.api.post<AuthResponseTypes.LoginResponse>(
      '/auth/signin',
      {
        username,
        password
      }
    );
    return response.data;
  }

  async signup(
    name: string,
    username: string,
    email: string,
    password: string
  ) {
    const response = await this.api.post<AuthResponseTypes.SignupResponse>(
      '/auth/signup',
      {
        name,
        username,
        email,
        password
      }
    );
    return response.data;
  }

  async logout() {
    await this.api.post('/auth/signout');
  }
}

export default new AuthService();
