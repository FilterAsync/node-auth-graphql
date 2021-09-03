import {
	FormLabel as BSLabel,
	FormLabelProps,
} from 'react-bootstrap';
import classNames from 'classnames';

export type LabelProps = FormLabelProps & {
	required?: boolean;
};

export const Label: React.FC<LabelProps> = ({
	children,
	className,
	required,
	...props
}) => {
	return (
		<BSLabel
			className={classNames(
				required && 'required',
				className
			)}
			{...props}
		>
			<strong>{children}</strong>
		</BSLabel>
	);
};
