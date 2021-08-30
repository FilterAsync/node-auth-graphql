import React from 'react';
import {
	Navbar as BSNavbar,
	Container,
	Nav,
} from 'react-bootstrap';

const { Brand, Toggle, Collapse } = BSNavbar;
const { Link } = Nav;

const Navbar: React.FC<{}> = ({}) => {
	return (
		<BSNavbar
			bg="dark"
			variant="dark"
			fixed="top"
			expand="md"
		>
			<Container fluid>
				<Brand href="/">Company</Brand>
				<Toggle aria-controls="basic-navbar-nav" />
				<Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Link href="/">Home</Link>
					</Nav>
				</Collapse>
			</Container>
		</BSNavbar>
	);
};

export default Navbar;
