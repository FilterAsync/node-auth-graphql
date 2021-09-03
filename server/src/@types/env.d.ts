declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string;
		DB_URI: string;
		SESSION_SECRET: string;
		CORS_ORIGIN: string;
		REDIS_PORT: string;
		REDIS_HOST: string;
		REDIS_PASS: string;
	}
}
