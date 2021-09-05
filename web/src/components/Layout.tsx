import type { HTMLAttributes } from 'react';
import { Container, ContainerProps } from 'react-bootstrap';
import { Navbar, Center } from '.';

export type LayoutProps = ContainerProps &
	HTMLAttributes<HTMLDivElement> & {
		center?: boolean;
	};

export const Layout: React.FC<LayoutProps> = ({
	center,
	children,
	className,
	...props
}) => {
	const Wrapper = center ? Center : Container;

	return (
		<>
			<Navbar />
			<Wrapper {...props}>{children}</Wrapper>
		</>
	);
};

Layout.displayName = 'Layout';
