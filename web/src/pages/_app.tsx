import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { NextWebVitalsMetric } from 'next/app';
import type { NextPage } from 'next';

export function reportWebVitals(
	metric: NextWebVitalsMetric
) {
	console.dir(metric);
}

const App: NextPage<AppProps> = ({
	Component,
	pageProps,
}) => {
	return (
		<>
			<Head>
				{/* some SEO improvements */}
				<link
					rel="shortcut icon"
					href="favicon.ico"
					type="image/x-icon"
				/>
				<meta name="theme-color" content="#ffffff" />
			</Head>
			<Component {...pageProps} />
		</>
	);
};

export default App;
