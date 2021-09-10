import React from 'react';
import Head from 'next/head';
import {
	BlockButton,
	InputField,
	Layout,
} from '../components';
import { Form, Formik } from 'formik';
import { Card } from 'react-bootstrap';
import { useForgotPasswordMutation } from '../generated';
import Link from 'next/link';
import { Alert } from 'react-bootstrap';
import { withApollo, sleep } from '../utils';
import { NextPage } from 'next';

const ForgotPassword: NextPage = () => {
	const [forgotPassword] = useForgotPasswordMutation();

	return (
		<>
			<Head>
				<title>Forgot Password</title>
			</Head>
			<Layout center>
				<Card className="card-responsive shadow">
					<Card.Body>
						<h4 className="card-title">Forgot Password</h4>
						<hr />
						<Formik
							initialValues={{
								email: '',
							}}
							onSubmit={async (values, { setStatus }) => {
								await sleep(3e3);

								await forgotPassword({
									variables: values,
								});

								setStatus('success');
							}}
						>
							{({ errors, isSubmitting, status }) => (
								<Form noValidate autoComplete="on">
									<InputField
										label="Email address"
										autoComplete="email"
										disabled={isSubmitting}
										name="email"
										error={errors.email}
										required
									/>
									{status === 'success' && (
										<Alert variant="warning">
											<strong>note</strong>
											<div>
												if you have an account with us, you
												will receive an email with a link to
												reset your password.
											</div>
										</Alert>
									)}
									<BlockButton
										type="submit"
										aria-label="Send email"
										disabled={isSubmitting}
									>
										Send
									</BlockButton>
									<div className="mt-3 d-flex justify-content-center align-items-center text-center">
										<Link href="/login">
											Return to login
										</Link>
									</div>
								</Form>
							)}
						</Formik>
					</Card.Body>
				</Card>
			</Layout>
		</>
	);
};

export default withApollo({ ssr: false })(ForgotPassword);
