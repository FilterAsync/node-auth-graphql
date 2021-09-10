import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { withApollo } from 'src/utils';
import { useEmailVerificationQuery } from '../generated';

const Verification: NextPage = () => {
	const router = useRouter();

	const { query } = router;
	const { token = '', signature = '' } = query;

	const { loading, data } = useEmailVerificationQuery({
		variables: {
			token: token.toString(),
			signature: signature.toString(),
		},
	});

	useEffect(() => {
		if (!loading && data) {
			router.replace(data.emailVerify ? '/' : '/login');
		}
	}, [router, loading, data]);

	return (
		<>
			<Head>
				<title>Email Verification</title>
			</Head>
		</>
	);
};

export default withApollo({ ssr: false })(Verification);
