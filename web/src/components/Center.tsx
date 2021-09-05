import classNames from 'classnames';
import type { HTMLAttributes } from 'react';
import { Container, ContainerProps } from 'react-bootstrap';

type CenterProps = ContainerProps &
	HTMLAttributes<HTMLDivElement> & {};

export const Center: React.FC<CenterProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<Container
			className={classNames('center', className)}
			{...props}
		>
			{children}
		</Container>
	);
};

Center.displayName = 'Center';
