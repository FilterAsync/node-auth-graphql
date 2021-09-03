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
import { AuthContext } from '../types';
import {
	COOKIE_NAME,
	FORGOT_PASSWORD_PREFIX,
} from '../constants';
import { Credentials } from './Credentials';
import { registerSchema } from '../validation';
import { logIn, sendMail } from '../utils';
import crypto from 'crypto';
import { guest } from './auth';

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
	me(@Ctx() { req }: AuthContext) {
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
		@Ctx() { req }: AuthContext
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
		@Ctx() { req }: AuthContext
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

	@Mutation(() => Boolean)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { redis }: AuthContext
	) {
		const user = await UserModel.findOne({ email });
		if (!user) {
			// to confuse attackers
			return true;
			// return false;
		}

		const token = crypto.randomBytes(32).toString('hex');

		await redis.set(
			FORGOT_PASSWORD_PREFIX + token,
			user.id,
			'ex',
			1 * 60 * 60
		);

		await sendMail({
			to: user.email,
			subject: 'Forgot password',
			html: `
				<a href="http://localhost:3000/change-password/${token}">reset password</a>
			`,
		});

		return true;
	}

	@Authorized()
	@Mutation(() => Boolean)
	logout(
		@Ctx() { req, res }: AuthContext
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
