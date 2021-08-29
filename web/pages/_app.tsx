import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { Provider, createClient } from 'urql';
import '../styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withUrqlClient } from 'next-urql';

const client = createClient({
	url: 'http://localhost:5000/graphql',
	fetchOptions: {
		credentials: 'include' as const,
	},
});

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<Provider value={client}>
			<Navbar />
			<Component {...pageProps} />
		</Provider>
	);
};

export default App;
