import { useRouter } from 'next/router';
import { toErrorMap, withApollo } from '../utils';
import Head from 'next/head';
import { Formik, Form } from 'formik';
import {
	MeDocument,
	MeQuery,
	useResetPasswordMutation,
} from '../generated';
import {
	Center,
	InputField,
	BlockButton,
} from '../components';
import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import Link from 'next/link';
import { Card } from 'react-bootstrap';
import { NextPage } from 'next';
import assign from 'object-assign';

const ResetPassword: NextPage = () => {
	const router = useRouter();
	const [tokenError, setTokenError] =
		useState<any>(undefined);
	const [resetPassword] = useResetPasswordMutation();

	const { id = '', token = '' } = router.query;

	console.log(id);

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
										id: id.toString(),
										token: token.toString(),
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

								const { errors, user } =
									data?.resetPassword!;

								if (errors) {
									const errorMap = toErrorMap(errors);
									if ('token' in errorMap) {
										setTokenError(errorMap.token);
										return;
									}
									setErrors(errorMap);
								} else if (user) {
									router.push('/');
								}
							}}
						>
							{({
								isSubmitting,
								errors: { password: passwordError },
							}) => (
								<Form noValidate autoComplete="on">
									<InputField
										label="New password"
										autoComplete="current-password"
										name="password"
										type="password"
										disabled={isSubmitting}
										error={passwordError}
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
