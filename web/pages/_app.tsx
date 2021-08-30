import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { Provider } from 'urql';
import '../styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { client } from '../config/client';

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<Provider value={client}>
			<Navbar />
			<Component {...pageProps} />
		</Provider>
	);
};

export default App;
