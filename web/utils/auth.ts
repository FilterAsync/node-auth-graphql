import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated';

export const useIsAuth = () => {
	const { loading, data } = useMeQuery();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !data?.me) {
			router.replace(
				'/login?returnUrl=' +
					encodeURIComponent(router.pathname)
			);
		}
	}, [loading, data, router]);

	return { loading, data };
};
