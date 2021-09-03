import { Card } from 'react-bootstrap';
import {
	MeDocument,
	MeQuery,
	useLoginMutation,
} from '../generated';
import Head from 'next/head';
import Link from 'next/link';
import {
	BlockButton,
	InputField,
	Center,
} from '../components';
import { toErrorMap, withApollo } from '../utils';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';

const Login: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [login] = useLoginMutation();

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<Center>
				<Card className="card-responsive shadow">
					<Card.Body>
						<h4 className="card-title">Login</h4>
						<hr />
						<Formik
							initialValues={{
								usernameOrEmail: '',
								password: '',
							}}
							onSubmit={async (values, { setErrors }) => {
								const response = await login({
									variables: values,
									update: (cache, { data }) => {
										cache.writeQuery<MeQuery>({
											query: MeDocument,
											data: {
												me: data?.login?.user,
											},
										});
									},
								});

								const { data } = response;
								const errors = data?.login.errors;

								if (errors) {
									setErrors(toErrorMap(errors));
								} else if (data?.login.user) {
									const {
										query: { returnUrl: _next },
									} = router;

									let next;

									try {
										next = decodeURIComponent(
											_next as string
										);
									} catch (err) {
										// URI malformed error
										console.error(err);
									} finally {
										router.push(next || '/');
									}
								}
							}}
						>
							{({ isSubmitting, errors }) => (
								<Form autoComplete="on" noValidate>
									<InputField
										label="Username/Email address"
										autoComplete="username"
										name="usernameOrEmail"
										type="text"
										disabled={isSubmitting}
										error={errors.usernameOrEmail}
										required
									/>
									<InputField
										label="Password"
										autoComplete="current-password"
										name="password"
										type="password"
										disabled={isSubmitting}
										error={errors.password}
										required
									/>
									<BlockButton
										type="submit"
										title="Submit"
										disabled={isSubmitting}
									>
										Log in
									</BlockButton>
									<div className="card-footer-links">
										<Link href="/register">
											Don't have an account
										</Link>
										<span className="separate" aria-hidden>
											&bull;
										</span>
										<Link href="/forgot-password">
											Forgot password
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

export default withApollo({ ssr: false })(Login);
