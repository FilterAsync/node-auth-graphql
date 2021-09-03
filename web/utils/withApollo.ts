import {
	ApolloClient,
	InMemoryCache,
} from '@apollo/client';
import { withApollo as _withApollo } from 'next-apollo';
import { NextPageContext } from 'next';

const apolloClient = (ctx?: NextPageContext) => {
	return new ApolloClient({
		uri: process.env.NEXT_PUBLIC_API_URL,
		credentials: 'include',
		headers: {
			cookie:
				(typeof window === 'undefined' &&
					ctx?.req?.headers.cookie) ||
				'',
		},
		cache: new InMemoryCache(),
	});
};

export const withApollo = _withApollo(apolloClient);
