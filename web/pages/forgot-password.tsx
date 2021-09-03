import React from 'react';
import Head from 'next/head';
import {
	BlockButton,
	Center,
	InputField,
} from '../components';
import { Form, Formik } from 'formik';
import { Card } from 'react-bootstrap';
import Link from 'next/link';

const ForgotPassword = () => {
	return (
		<>
			<Head>
				<title>Forgot Password</title>
			</Head>
			<Center>
				<Card className="card-responsive shadow">
					<Card.Body>
						<h4 className="card-title">Forgot Password</h4>
						<hr />
						<Formik
							initialValues={{
								email: '',
							}}
							onSubmit={() => {}}
						>
							{({ errors, isSubmitting }) => (
								<Form>
									<InputField
										label="Email address"
										autoComplete="email"
										disabled={isSubmitting}
										name="email"
										type="email"
										error={errors.email}
										required
									/>
									<BlockButton aria-label="Send email">
										Send
									</BlockButton>
									<div className="mt-4 d-flex justify-content-center align-items-center text-center">
										<Link href="/login">
											Return to login
										</Link>
									</div>
								</Form>
							)}
						</Formik>
					</Card.Body>
				</Card>
			</Center>
		</>
	);
};

export default ForgotPassword;
