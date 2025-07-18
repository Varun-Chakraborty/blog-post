/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_HOST: string;
	readonly VITE_API_HTTP_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
