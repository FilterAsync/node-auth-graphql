import {
	MeDocument,
	MeQuery,
	useRegisterMutation,
} from '../generated';
import { toErrorMap, withApollo } from '../utils';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import {
	BlockButton,
	InputField,
	Center,
} from '../components';
import router from 'next/router';
import Head from 'next/head';

const Register: React.FC<{}> = ({}) => {
	const [register] = useRegisterMutation();

	return (
		<>
			<Head>
				<title>Register</title>
			</Head>
			<Center>
				<Card className="card-responsive shadow">
					<Card.Body>
						<h4 className="card-title">Register</h4>
						<Formik
							initialValues={{
								username: '',
								email: '',
								password: '',
							}}
							onSubmit={async (values, { setErrors }) => {
								const response = await register({
									variables: {
										credentials: values,
									},
									update: (cache, { data }) => {
										cache.writeQuery<MeQuery>({
											query: MeDocument,
											data: {
												me: data?.register?.user,
											},
										});
									},
								});

								const { data } = response;

								const errors = data?.register.errors;

								if (errors) {
									setErrors(toErrorMap(errors));
								} else if (data?.register.user) {
									router.replace('/');
								}
							}}
						>
							{({ errors, isSubmitting }) => {
								type Fields =
									| 'username'
									| 'email'
									| 'password';

								return (
									<Form noValidate autoComplete="on">
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
										<div className="mt-4 card-footer-links">
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
			</Center>
		</>
	);
};

export default withApollo({ ssr: false })(Register);
