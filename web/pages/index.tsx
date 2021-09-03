import Head from 'next/head';
import { useIsAuth, withApollo } from '../utils';
import { Image } from 'react-bootstrap';
import { Layout } from '../components';

const Index = () => {
	const { data } = useIsAuth();

	if (!data?.me) {
		return <></>;
	}

	return (
		<>
			<Head>
				<title>Homepage</title>
			</Head>
			<Layout>
				<h2>
					<Image
						src={data.me.avatar}
						alt={`${data.me.username}'s avatar`}
						roundedCircle
					/>
					<p className="ms-2 d-inline">
						{data.me.username}
					</p>
				</h2>
			</Layout>
		</>
	);
};

export default withApollo({ ssr: true })(Index);
