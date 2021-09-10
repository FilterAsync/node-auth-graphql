import Head from 'next/head';
import { withApollo } from '../utils';
import { Layout } from '../components';
import type { NextPage } from 'next';

const Index: NextPage = () => {
	return (
		<>
			<Head>
				<title>Homepage</title>
			</Head>
			<Layout>
				<p>hello world</p>
			</Layout>
		</>
	);
};

export default withApollo({ ssr: true })(Index);
