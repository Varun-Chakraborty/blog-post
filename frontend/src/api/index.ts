import { toast } from "@/components/ui/use-toast";
import { APIResponseTypes } from "@/types";
import axios, { AxiosError } from "axios";

class Api {
  private readonly api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.message === "Network Error") {
          toast({
            variant: "destructive",
            title: "Network error",
            description: "Please check your internet connection.",
          });
          return Promise.reject(new Error("Network Error"));
        } else if (error.response?.status === 401) {
          if (error.request?.responseURL?.includes("/auth")) {
            return Promise.reject(error as Error);
          } else {
            const currentRequest = error.config!;
            await this.refreshToken();
            return await this.api.request(currentRequest);
          }
        }
        return Promise.reject(error as Error);
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
    const response = await this.api.get<APIResponseTypes.GetProfileResponse>(`/user/profile/${username ?? ''}`)
    return response.data.data?.user ?? undefined;
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
    return response.data.data!.searchResult;
  }
}

export default new Api();
