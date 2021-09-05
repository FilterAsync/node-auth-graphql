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
	Layout,
} from '../components';
import { toErrorMap, withApollo } from '../utils';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const Login: NextPage = () => {
	const router = useRouter();
	const [login] = useLoginMutation();

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<Layout center>
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
												me: data?.login.user,
											},
										});
									},
								});

								const { data } = response;
								const { errors, user } = data?.login!;

								if (errors) {
									setErrors(toErrorMap(errors));
								} else if (user) {
									const {
										query: { returnUrl: _next },
									} = router;

									let next = '/';

									try {
										if (_next) {
											next = decodeURIComponent(
												_next.toString()
											);
										}
									} catch (err) {
										// URI malformed error
										console.error(err);
									} finally {
										router.push(next);
									}
								}
							}}
						>
							{({
								isSubmitting,
								errors: { usernameOrEmail, password },
							}) => (
								<Form autoComplete="on" noValidate>
									<InputField
										label="Username/Email address"
										autoComplete="username"
										name="usernameOrEmail"
										disabled={isSubmitting}
										error={usernameOrEmail}
										required
									/>
									<InputField
										label="Password"
										autoComplete="current-password"
										name="password"
										type="password"
										disabled={isSubmitting}
										error={password}
										required
									/>
									<BlockButton
										type="submit"
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
			</Layout>
		</>
	);
};

export default withApollo({ ssr: false })(Login);
