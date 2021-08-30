import React from 'react';
import {
	FormLabel as BSLabel,
	FormLabelProps,
} from 'react-bootstrap';

const Label: React.FC<FormLabelProps> = ({
	children,
	...props
}) => {
	return (
		<BSLabel {...props}>
			<strong>{children}</strong>
		</BSLabel>
	);
};

export default Label;
