import { User, UserModel, ResetModel } from '../models';
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
	CORS_ORIGIN,
	COOKIE_NAME,
	EMAIL_VERIFICATION_PREFIX,
} from '../constants';
import { Credentials } from './Credentials';
import {
	forgotPasswordSchema,
	registerSchema,
} from '../validation';
import {
	logIn,
	resetPassword,
	markAsVerified,
} from '../utils';
import { guest } from './auth';
import { URL } from 'url';

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
		return UserModel.findById(req.session?.userId);
	}

	@UseMiddleware(guest)
	@Query(() => Boolean)
	async emailVerify(
		@Arg('token') token: string,
		@Arg('signature') signature: string,
		@Ctx() { req, redis }: AppContext
	): Promise<boolean> {
		const key = EMAIL_VERIFICATION_PREFIX + token;

		const userId = await redis.get(key);

		if (
			!userId ||
			!UserModel.hasValidVerificationUrl(token, signature)
		) {
			return false;
		}

		const user = await UserModel.findById(userId);

		if (user && !user.verifiedAt) {
			await Promise.all([
				redis.del(key),
				markAsVerified(user),
				logIn(req, user.id),
			]);

			return true;
		}

		return false;
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
		@Ctx() { redis, sendMail }: AppContext
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

		const verificationUrl = user.verificationUrl();

		const token = new URL(
			verificationUrl!
		).searchParams.get('token');

		await redis.set(
			EMAIL_VERIFICATION_PREFIX + token,
			user.id,
			'ex',
			12 * 60 * 60
		);

		await sendMail({
			to: email,
			subject: 'Email verification',
			html: `<a href="${verificationUrl}">verify</a>`,
		});

		return { user };
	}

	@UseMiddleware(guest)
	@Mutation(() => Boolean)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { sendMail }: AppContext
	) {
		const user = await UserModel.findOne({ email });
		if (!user) {
			// to confuse attackers
			return true;
			// return false;
		}

		const token = ResetModel.plaintextToken();

		const reset = new ResetModel({
			token,
			userId: user.id,
		});

		await reset.save();

		await sendMail({
			to: email,
			subject: 'Forgot password',
			html: `
				<a href="${reset.createUrl(token)}">
					reset password
				</a>
			`,
		});

		return true;
	}

	@UseMiddleware(guest)
	@Mutation(() => AuthResponse)
	async resetPassword(
		@Arg('id') id: string,
		@Arg('token') token: string,
		@Arg('password') password: string,
		@Ctx() { req, sendMail }: AppContext
	): Promise<AuthResponse> {
		const reset = await ResetModel.findById(id);

		let user;

		if (
			!reset ||
			!reset.isValidToken(token) ||
			!(user = await UserModel.findById(reset.userId))
		) {
			return {
				errors: [
					{
						field: 'token',
						message: 'invalid token',
					},
				],
			};
		}

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

		await Promise.all([
			resetPassword(user, password),
			ResetModel.deleteMany({ userId: reset.userId }),
			logIn(req, password),
		]);

		await sendMail({
			to: user.email,
			subject: 'password reset',
			text: 'your password has successfully reset',
		});

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
				// so they can log out without having any problem
				res.clearCookie(COOKIE_NAME);
				if (err) {
					console.error(err);
					resolve(false);
				}
				resolve(true);
			})
		);
	}
}
