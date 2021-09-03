import classNames from 'classnames';
import { HTMLAttributes } from 'react';
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
