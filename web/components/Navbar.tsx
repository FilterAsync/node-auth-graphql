import { useApolloClient } from '@apollo/client';
import { useEffect, useState } from 'react';
import {
	Navbar as BSNavbar,
	Container,
	Nav,
} from 'react-bootstrap';
import {
	useLogoutMutation,
	useMeQuery,
} from '../generated';
import { isServerSide } from '../utils';

const { Brand, Toggle, Collapse } = BSNavbar;
const { Link } = Nav;

export const Navbar: React.FC<{}> = ({}) => {
	const [logout, { loading: logoutFetching }] =
		useLogoutMutation();

	const [NavLinks, setNavLinks] =
		useState<null | JSX.Element>(null);

	const { loading, data } = useMeQuery({
		skip: isServerSide,
	});

	const apollo = useApolloClient();

	useEffect(() => {
		if (loading) {
			setNavLinks(null);
		} else if (!data?.me) {
			setNavLinks(
				<>
					<Link href="/login">Login</Link>
					<Link href="/register">Register</Link>
				</>
			);
		} else {
			setNavLinks(
				<>
					<Link
						href="#"
						disabled={logoutFetching}
						onClick={async () => {
							await Promise.all([
								logout(),
								apollo.resetStore(),
							]);
						}}
					>
						Logout
					</Link>
				</>
			);
		}
	}, [loading, data?.me]);

	return (
		<BSNavbar
			bg="dark"
			variant="dark"
			fixed="top"
			expand="sm"
		>
			<Container fluid>
				<Brand href="/">Company</Brand>
				<Toggle aria-controls="basic-navbar-nav" />
				<Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Link href="/">Home</Link>
					</Nav>
					<Nav>{NavLinks}</Nav>
				</Collapse>
			</Container>
		</BSNavbar>
	);
};
