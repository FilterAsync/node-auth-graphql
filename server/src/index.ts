import server from './app';
import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from './graphql';

require('dotenv-safe').config();

const { env } = process;

console.log(env.PORT);

const port = +env.PORT || 5000;

(async () => {
	const apolloServer = new ApolloServer({
		typeDefs,
		resolvers,
	});

	await apolloServer.start();

	apolloServer.applyMiddleware({ app: server as any, cors: false });

	server.listen(port, () => console.log('server started on port %s', port));
})().catch((err) => console.error(err));
