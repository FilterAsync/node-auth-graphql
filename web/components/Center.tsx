import React from 'react';
import { Container } from 'react-bootstrap';

const Center: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	...props
}) => {
	return (
		<Container className="center" {...props}>
			{children}
		</Container>
	);
};

export default Center;
