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
import { client, SessionStore } from './config/redis';
import mongoose from 'mongoose';
import compression from 'compression';

const { env } = process;

const port = +env.PORT || 5e3;

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

	app.use(
		session({
			name: COOKIE_NAME,
			store: SessionStore,
			secret: env.SESSION_SECRET,
			cookie: {
				maxAge: 24 * 60 * 60 * 1e3, // 1 day
				httpOnly: true, // sensitive data
				secure: __PROD__, // secure only work in https
				sameSite: 'lax', // csrf attacks
				// domain: __PROD__ ? '' : void 0
			},
			resave: false,
			saveUninitialized: true,
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
		}),
		context: ({ req, res }) => ({
			req,
			res,
			redis: client,
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
