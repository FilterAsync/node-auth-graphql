import Head from 'next/head';
import type { NextPage } from 'next';

const NotFound: NextPage = () => {
	return (
		<>
			<Head>
				<title>404</title>
			</Head>
			<div className="center">
				<h1>404 - Page not found</h1>
			</div>
		</>
	);
};

export default NotFound;
