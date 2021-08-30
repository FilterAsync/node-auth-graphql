import React from 'react';
import classNames from 'classnames';
import { Container } from 'react-bootstrap';

const Center: React.FC<
	React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => {
	return (
		<Container
			className={classNames('center', className)}
			{...props}
		>
			{children}
		</Container>
	);
};

export default Center;
