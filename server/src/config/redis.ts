import Redis, { RedisOptions } from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { COOKIE_NAME } from '../constants';

const RedisOptions: RedisOptions = {
	port: 6379,
	host: 'localhost',
	password: 'secret',
};

export const RedisStore = connectRedis(session);

export const client = new Redis('localhost', RedisOptions);

export const SessionStore = new RedisStore({
	client,
	prefix: COOKIE_NAME + ':',
});
