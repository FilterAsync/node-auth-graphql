import {
	FormLabel as BSLabel,
	FormLabelProps,
} from 'react-bootstrap';
import classNames from 'classnames';
import type { LabelHTMLAttributes } from 'react';

export type LabelProps = FormLabelProps &
	LabelHTMLAttributes<HTMLLabelElement> & {
		required?: boolean;
	};

export const Label: React.FC<LabelProps> = ({
	children,
	className,
	required,
	...props
}) => {
	const classes = classNames(required && 'required');

	return (
		<BSLabel
			className={classNames(className, classes)}
			{...props}
		>
			<strong>{children}</strong>
		</BSLabel>
	);
};

Label.displayName = 'Label';
