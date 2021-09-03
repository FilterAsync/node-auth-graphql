import 'reflect-metadata';
import 'dotenv-safe/config';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { UserResolver } from './graphql';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import { COOKIE_NAME, __PROD__ } from './constants';
import mongoose from 'mongoose';
import compression from 'compression';
import { v4 } from 'uuid';
import crypto from 'crypto';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { authChecker } from './graphql';
import helmet from 'helmet';

const { env } = process;

const port = env.PORT || 5e3;

(async () => {
	const app = express();

	app.disable('x-powered-by');

	app.set('trust proxy', 1);

	app.use(
		cors({
			origin: env.CORS_ORIGIN,
			credentials: true,
		})
	);

	app.use(compression());

	app.use(helmet());
	app.use(
		helmet.contentSecurityPolicy({
			directives: {
				defaultSrc: ["'self'"],
				baseUri: ["'self'"],
				blockAllMixedContent: [],
				fontSrc: ["'self'", 'https:'],
				imgSrc: [
					"'self'",
					'data:',
					'https:',
					'http://cdn.jsdelivr.net/npm/@apollographql/graphql-playground-react@1.7.39/build/favicon.png',
				],
				styleSrc: [
					"'self'",
					"'unsafe-hashes'",
					"'sha256-jQoC6QpIonlMBPFbUGlJFRJFFWbbijMl7Z8XqWrb46o='",
					"'sha256-biLFinpqYMtWHmXfkA1BPeCY0/fNt46SAZ+BBk5YUog='",
				],
				styleSrcElem: [
					"'self'",
					'https:',
					"'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
					"'sha256-iRiwFogHwyIOlQ0vgwGxLZXMnuPZa9eZnswp4v8s6fE='",
					"'sha256-WYkrRZYpK8d/rqMjoMTIfcPzRxeojQUncPzhW9/2pg8='",
				],
				scriptSrc: ["'self'"],
				scriptSrcElem: [
					"'self'",
					'https:',
					"'sha256-jy0ROHCLlkmrjNmmholpRXAJgTmhuirtXREXGa8VmVU='",
				],
				objectSrc: ["'none'"],
				upgradeInsecureRequests: [],
			},
		})
	);

	const RedisStore = connectRedis(session);

	const { REDIS_HOST } = env;

	const redis = new Redis(REDIS_HOST, {
		port: +env.REDIS_PORT,
		host: REDIS_HOST,
		password: __PROD__ ? env.REDIS_PASS : undefined,
	});

	const SessionStore = new RedisStore({ client: redis });

	app.use(
		session({
			name: COOKIE_NAME,
			store: SessionStore,
			secret: env.SESSION_SECRET,
			cookie: {
				maxAge: 24 * 60 * 60 * 30 * 1e3, // 1 month
				httpOnly: true, // sensitive data
				secure: __PROD__, // secure only work in https
				sameSite: 'lax', // csrf attacks
				// domain: __PROD__ ? '' : undefined
			},
			resave: false,
			saveUninitialized: false,
			genid() {
				return crypto
					.createHash('sha256')
					.update(v4())
					.update(crypto.randomBytes(32).toString('hex'))
					.digest('hex');
			},
			unset: 'destroy',
		})
	);

	app.use(
		morgan((tokens, req, res) =>
			[
				tokens.method(req, res),
				tokens.url(req, res),
				tokens.status(req, res),
				tokens.res(req, res, 'content-length'),
				'-',
				tokens['response-time'](req, res),
				'ms',
			].join(' ')
		)
	);

	await mongoose.connect(env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});

	console.log('mongoose connection succeeded');

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver] as const,
			validate: false,
			authChecker,
		}),
		context: ({ req, res }) => ({
			req,
			res,
			redis,
		}),
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({
		app: app as any,
		cors: false,
	});

	app.listen({ port }, () => {
		console.log(
			'server is listening on port %d in mode %s',
			port,
			app.get('env')
		);
	});
})().catch((err) => console.error(err));
