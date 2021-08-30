import Head from 'next/head';
import Center from '../components/Center';

const NotFound: React.FC<{}> = ({}) => {
	return (
		<>
			<Head>
				<title>404</title>
			</Head>
			<Center>
				<h1>404 - Page Not Found</h1>
			</Center>
		</>
	);
};

export default NotFound;
