import React from 'react';
import {
	Card,
	Form,
	FormGroup as Group,
	FormControl as Control,
} from 'react-bootstrap';
import Head from 'next/head';
import Label from '../components/RequiredLabel';
import Center from '../components/Center';
import BlockButton from '../components/BlockButton';

const { Body, Title } = Card;

const Login: React.FC<{}> = ({}) => {
	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<Center>
				<Card className="w-50">
					<Body>
						<Title>Login</Title>
						<hr />
						<Form>
							<Group className="mb-4">
								<Label htmlFor="email">Email address</Label>
								<Control
									id="email"
									name="email"
									type="email"
									required
								/>
							</Group>
							<Group className="mb-4">
								<Label htmlFor="password">Password</Label>
								<Control
									id="password"
									name="password"
									type="password"
									required
								/>
							</Group>
							<BlockButton type="submit">
								Log in
							</BlockButton>
						</Form>
					</Body>
				</Card>
			</Center>
		</>
	);
};

export default Login;
