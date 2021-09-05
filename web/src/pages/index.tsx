import Head from 'next/head';
import { useIsAuth, withApollo } from '../utils';
import { Image } from 'react-bootstrap';
import { Layout } from '../components';
import type { NextPage } from 'next';

const Index: NextPage = () => {
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
						width={64}
						height={64}
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
