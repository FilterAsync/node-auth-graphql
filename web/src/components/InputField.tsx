import { useField } from 'formik';
import type { InputHTMLAttributes } from 'react';
import { Label } from '.';
import {
	FormGroup,
	FormControl,
	FormControlProps,
} from 'react-bootstrap';

const { Feedback } = FormControl;

export type InputFieldProps = FormControlProps &
	InputHTMLAttributes<HTMLInputElement> & {
		name: string;
		label?: string;
		required?: boolean;
		error?: string;
	};

export const InputField: React.FC<InputFieldProps> = ({
	name,
	label,
	error,
	required,
	isInvalid,
	className,
	...props
}) => {
	const [field, { error: fieldError }] = useField(name);

	return (
		<FormGroup className="mb-4">
			<Label htmlFor={field.name} required={required}>
				{label}
			</Label>
			<FormControl
				id={field.name}
				required={required}
				isInvalid={error ? !!fieldError : undefined}
				{...field}
				{...props}
			/>
			<Feedback type="invalid">{error}</Feedback>
		</FormGroup>
	);
};

InputField.displayName = 'InputField';
