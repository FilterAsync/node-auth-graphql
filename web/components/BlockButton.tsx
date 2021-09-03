import { Button, ButtonProps } from 'react-bootstrap';

export type BlockButtonProps = ButtonProps & {};

export const BlockButton: React.FC<BlockButtonProps> = ({
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
