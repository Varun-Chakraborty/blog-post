import { APIResponseTypes } from "@/types";
import axios, { AxiosError } from "axios";

class Api {
  private api = axios.create({
    baseURL: "http://localhost:4002/api/v1/",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (error.request?.responseURL?.includes("/auth")) {
            return Promise.reject(error);
          } else {
            const currentRequest = error.config!;
            await this.refreshToken();
            return await this.api.request(currentRequest);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async refreshToken() {
    const response = await this.api.get("/auth/refresh");
    return response.data;
  }

  async login(username: string, password: string) {
    const response = await this.api.post<APIResponseTypes.LoginResponse>(
      "/auth/signin",
      {
        username,
        password,
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
    const response = await this.api.post<APIResponseTypes.SignupResponse>(
      "/auth/signup",
      {
        name,
        username,
        email,
        password,
      }
    );
    return response.data;
  }

  async logout() {
    await this.api.post("/auth/signout");
  }

  async getProfile(username: string | null) {
    const response = username
      ? await this.api.get(`/user/profile/${username}`)
      : await this.api.get(`/user/profile`);
    return response.data.data?.user || null;
  }

  async isUsernameAvailable(username: string) {
    try {
      await this.api.get(`/isUsernameAvailable?username=${username}`);
      return true;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        return false;
      } else {
        throw error;
      }
    }
  }

  async search(query: string) {
    const response = await this.api.get<APIResponseTypes.SearchResponse>(
      `/search?q=${query}`
    );
    return response.data.data?.searchResult || [];
  }
}

export default new Api();
