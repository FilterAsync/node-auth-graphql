import React from 'react';
import Label from './Label';
import { FormLabelProps } from 'react-bootstrap';

const RequiredLabel: React.FC<FormLabelProps> = ({
	children,
	...props
}) => {
	return (
		<Label className="required" {...props}>
			{children}
		</Label>
	);
};

export default RequiredLabel;
