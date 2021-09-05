import { Button, ButtonProps } from 'react-bootstrap';

export type BlockButtonProps = ButtonProps & {};

export const BlockButton: React.FC<BlockButtonProps> = ({
	children,
	...props
}) => {
	return (
		<div className="d-grid gap-1">
			<Button {...props}>{children}</Button>
		</div>
	);
};

BlockButton.displayName = 'BlockButton';
