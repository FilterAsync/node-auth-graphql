import { useRouter } from 'next/router';
import { withApollo } from '../../utils';
import { Center } from '../../components';
import Head from 'next/head';

// TODO: implement reset password

const ResetPassword: React.FC<{}> = ({}) => {
	const router = useRouter();
	const { id } = router.query;

	return (
		<>
			<Head>
				<title>Reset Password</title>
			</Head>
			<Center>{id}</Center>
		</>
	);
};

export default withApollo({ ssr: false })(ResetPassword);
