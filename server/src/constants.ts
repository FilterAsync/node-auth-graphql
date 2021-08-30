const { env } = process;

export const __PROD__ = env.NODE_ENV === 'production';

export const COOKIE_NAME = 'qid';
