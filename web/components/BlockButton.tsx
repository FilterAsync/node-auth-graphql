import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

const BlockButton: React.FC<ButtonProps> = ({
	children,
	size,
	...props
}) => {
	return (
		<div className="d-grid gap-1">
			<Button {...props} size="lg">
				{children}
			</Button>
		</div>
	);
};

export default BlockButton;
