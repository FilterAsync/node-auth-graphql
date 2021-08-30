import { createClient } from '@urql/core';

const { env } = process;

export const client = createClient({
	url: env.NEXT_PUBLIC_API_URL!,
	fetchOptions: {
		credentials: 'include' as const,
	},
});
