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
import Link from 'next/link';
import { isServerSide } from '../utils';
import { Form, Button, Image } from 'react-bootstrap';

const { Brand, Toggle, Collapse } = BSNavbar;

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
					<Link href="/login" passHref>
						<Nav.Link>Login</Nav.Link>
					</Link>
					<Link href="/register" passHref>
						<Nav.Link>Register</Nav.Link>
					</Link>
				</>
			);
		} else {
			const { me } = data;

			setNavLinks(
				<>
					<Link href="/" passHref>
						<Nav.Link disabled>{me.username}</Nav.Link>
					</Link>
					<Form
						className="d-flex"
						onSubmit={async (event) => {
							event.preventDefault();
							await Promise.all([
								logout(),
								apollo.resetStore(),
							]);
						}}
					>
						<Button
							type="submit"
							disabled={logoutFetching}
							variant="link"
							className="nav-link"
							title="Log out your account"
							aria-label="Logout"
							role="link"
						>
							Logout
						</Button>
					</Form>
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
				<Link href="/" passHref>
					<Brand>Company</Brand>
				</Link>
				<Toggle aria-controls="navbar" />
				<Collapse id="navbar">
					<Nav className="me-auto">
						<Link href="/" passHref>
							<Nav.Link>Home</Nav.Link>
						</Link>
					</Nav>
					<Nav>{NavLinks}</Nav>
				</Collapse>
			</Container>
		</BSNavbar>
	);
};

Navbar.displayName = 'Navbar';
