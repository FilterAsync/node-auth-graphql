import {
	ApolloClient,
	InMemoryCache,
} from '@apollo/client';
import { withApollo } from 'next-apollo';
import { NextPageContext } from 'next';
import { isServerSide } from '.';

const apolloClient = (ctx?: NextPageContext) => {
	return new ApolloClient({
		uri: process.env.NEXT_PUBLIC_API_URL,
		credentials: 'include',
		headers: {
			cookie:
				(isServerSide && ctx?.req?.headers.cookie) || '',
		},
		cache: new InMemoryCache(),
	});
};

export default withApollo(apolloClient);
