declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_BASE_API_URL: string;
    }
  }
}
