import {
	MeDocument,
	MeQuery,
	useRegisterMutation,
} from '../generated';
import { toErrorMap, withApollo, sleep } from '../utils';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import {
	BlockButton,
	InputField,
	Layout,
} from '../components';
import { Alert } from 'react-bootstrap';
import Head from 'next/head';
import { NextPage } from 'next';

const Register: NextPage = () => {
	const [register] = useRegisterMutation();

	return (
		<>
			<Head>
				<title>Register</title>
			</Head>
			<Layout center>
				<Card className="card-responsive shadow">
					<Card.Body>
						<h4 className="card-title">Register</h4>
						<hr />
						<Formik
							initialValues={{
								username: '',
								email: '',
								password: '',
							}}
							onSubmit={async (
								values,
								{ setErrors, setStatus }
							) => {
								await sleep(2e3);

								const response = await register({
									variables: {
										credentials: values,
									},
									update: (cache, { data }) => {
										cache.writeQuery<MeQuery>({
											query: MeDocument,
											data: {
												me: data?.register.user,
											},
										});
									},
								});

								const { data } = response;

								const { errors, user } = data?.register!;

								if (errors) {
									setErrors(toErrorMap(errors));
								} else if (user) {
									setStatus('success');
								}
							}}
						>
							{({ isSubmitting, errors, status }) => {
								type Fields =
									| 'username'
									| 'email'
									| 'password';

								return (
									<Form noValidate autoComplete="on">
										{status === 'success' && (
											<Alert variant="success">
												<strong>success</strong>
												<p>
													check your email inbox for further
													instructions.
												</p>
											</Alert>
										)}
										{['username', 'email', 'password'].map(
											(field) => (
												<InputField
													key={field}
													label={
														field === 'email'
															? 'Email address'
															: field.replace(
																	/^\w/,
																	(char) =>
																		char.toUpperCase()
															  )
													}
													name={field}
													autoComplete={
														field === 'password'
															? 'current-password'
															: field
													}
													type={
														field === 'username'
															? 'text'
															: field
													}
													disabled={isSubmitting}
													error={errors[field as Fields]}
													required
												/>
											)
										)}
										<BlockButton
											type="submit"
											disabled={isSubmitting}
										>
											Register
										</BlockButton>
										<div className="card-footer-links">
											<Link href="/login">
												Already have an account
											</Link>
											<span
												className="separate"
												aria-hidden
											>
												&bull;
											</span>
											<Link href="#">Company name</Link>
										</div>
									</Form>
								);
							}}
						</Formik>
					</Card.Body>
				</Card>
			</Layout>
		</>
	);
};

export default withApollo({ ssr: false })(Register);
