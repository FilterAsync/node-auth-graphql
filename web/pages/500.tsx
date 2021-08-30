import Head from 'next/head';
import React from 'react';
import Center from '../components/Center';

const ServerError: React.FC<{}> = ({}) => {
	return (
		<>
			<Head>
				<title>Internal Server Error</title>
			</Head>
			<Center className="text-center">
				<h1>500 - Internal Server Error</h1>
			</Center>
		</>
	);
};

export default ServerError;
