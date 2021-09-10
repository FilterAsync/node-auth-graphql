import classNames from 'classnames';
import type { HTMLAttributes } from 'react';
import { Container, ContainerProps } from 'react-bootstrap';

export type CenterProps = ContainerProps &
	HTMLAttributes<HTMLDivElement> & {};

export const Center: React.FC<CenterProps> = ({
	children,
	className,
	...props
}) => {
	const classes = classNames('center');

	return (
		<Container
			className={classNames(className, classes)}
			{...props}
		>
			{children}
		</Container>
	);
};

Center.displayName = 'Center';
