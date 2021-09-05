import { User, UserModel } from '../models';
import {
	Query,
	Resolver,
	Mutation,
	Ctx,
	Arg,
	ObjectType,
	Field,
	Authorized,
	UseMiddleware,
} from 'type-graphql';
import { AppContext } from '../types';
import {
	COOKIE_NAME,
	FORGOT_PASSWORD_PREFIX,
} from '../constants';
import { Credentials } from './Credentials';
import {
	forgotPasswordSchema,
	registerSchema,
} from '../validation';
import {
	logIn,
	sendMail,
	resetPassword,
	hashToken,
} from '../utils';
import { guest } from './auth';
import { CORS_ORIGIN } from '../constants';

@ObjectType()
class FieldError {
	@Field()
	field!: string;

	@Field()
	message!: string;
}

@ObjectType()
class AuthResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	me(@Ctx() { req }: AppContext) {
		const { userId } = req.session!;
		if (!userId) {
			return null;
		}
		return UserModel.findById(userId);
	}

	@Mutation(() => AuthResponse)
	@UseMiddleware(guest)
	async login(
		@Arg('usernameOrEmail') usernameOrEmail: string,
		@Arg('password') password: string,
		@Ctx() { req }: AppContext
	): Promise<AuthResponse> {
		if (!usernameOrEmail || !password) {
			const field = !usernameOrEmail
				? 'usernameOrEmail'
				: 'password';

			return {
				errors: [
					{
						field,
						message: 'this field is required',
					},
				],
			};
		}

		const user = await UserModel.findOne({
			[usernameOrEmail.includes('@')
				? 'email'
				: 'username']: usernameOrEmail,
		});

		if (!user) {
			return {
				errors: [
					{
						field: 'usernameOrEmail',
						message: 'we cannot recognize that user',
					},
				],
			};
		}

		if (!(await user.comparePassword(password))) {
			return {
				errors: [
					{
						field: 'password',
						message: 'invalid password',
					},
				],
			};
		}

		await logIn(req, user.id);

		return { user };
	}

	@Mutation(() => AuthResponse)
	async register(
		@Arg('credentials')
		{ username, email, password }: Credentials,
		@Ctx() { req }: AppContext
	): Promise<AuthResponse> {
		const { error } = registerSchema.validate({
			username,
			email,
			password,
		});

		if (error) {
			return {
				errors: [
					{
						field: error.details[0].path[0].toString(),
						message: error.message,
					},
				],
			};
		}

		const [usernameExists, emailExists] = await Promise.all(
			[
				UserModel.exists({ username }),
				UserModel.exists({ email }),
			]
		);

		if (usernameExists || emailExists) {
			const field = usernameExists ? 'username' : 'email';

			return {
				errors: [
					{
						field,
						message: `a user with this ${field} already exists`,
					},
				],
			};
		}

		const user = new UserModel({
			username,
			email,
			password,
		});

		user.avatar = user.gravatar();
		await user.save();

		await logIn(req, user.id);

		return { user };
	}

	@UseMiddleware(guest)
	@Mutation(() => Boolean)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { redis }: AppContext
	) {
		const user = await UserModel.findOne({ email });
		if (!user) {
			// to confuse attackers
			return true;
			// return false;
		}

		const token = await hashToken(email);

		// one-time-only
		await redis.del(token);

		await redis.set(
			FORGOT_PASSWORD_PREFIX + token,
			user.id,
			'ex',
			1 * 60 * 60
		);

		await sendMail({
			to: email,
			subject: 'Forgot password',
			html: `
				<a href="${CORS_ORIGIN}/reset-password/${token}">reset password</a>
			`,
		});

		return true;
	}

	@UseMiddleware(guest)
	@Mutation(() => AuthResponse)
	async resetPassword(
		@Arg('token') token: string,
		@Arg('password') password: string,
		@Ctx() { req, redis }: AppContext
	): Promise<AuthResponse> {
		const { error } = forgotPasswordSchema.validate({
			password,
		});

		if (error) {
			return {
				errors: [
					{
						field: 'password',
						message: error.message,
					},
				],
			};
		}

		const key = FORGOT_PASSWORD_PREFIX + token;
		const userId = await redis.get(key);

		if (!userId) {
			return {
				errors: [
					{
						field: 'token',
						message:
							'this token does not exists or expired',
					},
				],
			};
		}

		const user = await UserModel.findById(userId);

		// should be unreachable because
		// we don't implement the "remove account" feature
		if (!user) {
			return {
				errors: [
					{
						field: 'token',
						message: 'user no longer exists',
					},
				],
			};
		}

		await Promise.all([
			redis.del(key),
			resetPassword(user, password),
			logIn(req, user.id),
		]);

		return { user };
	}

	@Authorized()
	@Mutation(() => Boolean)
	logout(
		@Ctx() { req, res }: AppContext
	): Promise<boolean> {
		return new Promise((resolve) =>
			req.session!.destroy((err) => {
				// clear the cookie before the error occurs
				res.clearCookie(COOKIE_NAME);
				if (err) {
					console.error(err);
					resolve(false);
				}
				// unreachable if the error occurs
				resolve(true);
			})
		);
	}
}
