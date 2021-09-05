import { useRouter } from 'next/router';
import { toErrorMap, withApollo } from '../../utils';
import { Center } from '../../components';
import Head from 'next/head';
import { Formik, Form } from 'formik';
import {
	MeDocument,
	MeQuery,
	useResetPasswordMutation,
} from '../../generated';
import { InputField, BlockButton } from '../../components';
import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import Link from 'next/link';
import { Card } from 'react-bootstrap';
import { NextPage } from 'next';
import assign from 'object-assign';

// TODO: implement reset password

const ResetPassword: NextPage = () => {
	const router = useRouter();
	const [tokenError, setTokenError] = useState<any>(null);
	const [resetPassword] = useResetPasswordMutation();

	const { token } = router.query;

	return (
		<>
			<Head>
				<title>Reset Password</title>
			</Head>
			<Center>
				<Card className="card-responsive shadow">
					<Card.Body>
						<h4 className="card-title">Reset Password</h4>
						<hr />
						<Formik
							initialValues={{
								password: '',
							}}
							onSubmit={async (values, { setErrors }) => {
								const response = await resetPassword({
									variables: assign(values, {
										token:
											typeof token === 'string'
												? token
												: '',
									}),
									update: (cache, { data }) => {
										cache.writeQuery<MeQuery>({
											query: MeDocument,
											data: {
												me: data?.resetPassword.user,
											},
										});
									},
								});

								const { data } = response;

								if (data?.resetPassword.errors) {
									const errorMap = toErrorMap(
										data.resetPassword.errors
									);
									if ('token' in errorMap) {
										setTokenError(errorMap.token);
										return;
									}
									setErrors(errorMap);
								} else if (data?.resetPassword.user) {
									router.push('/');
								}
							}}
						>
							{({ isSubmitting, errors: { password } }) => (
								<Form noValidate autoComplete="on">
									<InputField
										label="New password"
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
										Reset Password
									</BlockButton>
									{tokenError && (
										<Alert
											className="mt-4"
											variant="danger"
										>
											<strong>Error!</strong>
											<p>{tokenError}</p>
											<Link href="/forgot-password">
												get a new one
											</Link>
										</Alert>
									)}
								</Form>
							)}
						</Formik>
					</Card.Body>
				</Card>
			</Center>
		</>
	);
};

export default withApollo({ ssr: false })(ResetPassword);
