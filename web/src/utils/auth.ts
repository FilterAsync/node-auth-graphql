import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated';

export const useAuth = (type: 'auth' | 'guest') => {
	const { loading, data } = useMeQuery();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (type === 'auth' && !data?.me) {
				router.replace(
					'/login?returnUrl=' +
						encodeURIComponent(router.pathname)
				);
			} else {
				router.replace('/');
			}
		}
	}, [loading, data, router]);

	return { loading, data };
};
