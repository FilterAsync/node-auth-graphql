export const __PROD__ =
	process.env.NODE_ENV === 'production';

export const COOKIE_NAME = 'qid';

export const FORGOT_PASSWORD_PREFIX = 'fp:';

export const CORS_ORIGIN = __PROD__
	? ''
	: 'http://localhost:3000';
