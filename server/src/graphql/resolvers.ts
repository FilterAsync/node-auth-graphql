import { User, UserModel } from '../models/user';
import {
	Query,
	Resolver,
	Mutation,
	Ctx,
	Arg,
	ObjectType,
	Field,
} from 'type-graphql';
import { AuthContext } from '../types';
import { COOKIE_NAME } from '../constants';
import { Credentials } from './Credentials';

@ObjectType()
class FieldError {
	@Field(() => String, { nullable: true })
	field!: null | string;

	@Field()
	message!: string;

	@Field()
	type!: 'validation' | 'field' | 'auth' | 'unknown';
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
		const userId = req.session!.userId;
		if (!userId) {
			return null;
		}
		return UserModel.findById(userId);
	}

	@Mutation(() => AuthResponse)
	async login(
		@Arg('usernameOrEmail') usernameOrEmail: string,
		@Arg('password') password: string,
		@Ctx() { req }: AuthContext
	): Promise<AuthResponse> {
		const user = await UserModel.findOne({
			[usernameOrEmail.includes('@') ? 'email' : 'username']: usernameOrEmail,
		});

		if (!user || !(await user!.comparePassword(password))) {
			return {
				errors: [
					{
						field: null,
						message: 'Invalid credentials.',
						type: 'auth',
					},
				],
			};
		}

		req.session!.userId = user.id;

		return { user };
	}

	@Mutation(() => AuthResponse)
	async register(
		@Arg('credentials')
		{ username, email, password }: Credentials,
		@Ctx() { req }: AuthContext
	): Promise<AuthResponse> {
		const [usernameExists, emailExists] = await Promise.all([
			UserModel.exists({ username }),
			UserModel.exists({ email }),
		]);

		if (usernameExists || emailExists) {
			const field = emailExists ? 'email' : 'username';

			return {
				errors: [
					{
						field,
						message: `${field.replace(/^\w/, (char) =>
							char.toUpperCase()
						)} already exists`,
						type: 'field',
					},
				],
			};
		}

		const user = new UserModel({ username, email, password });
		await user.save();

		req.session!.userId = user.id;

		return { user };
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: AuthContext): Promise<boolean> {
		return new Promise((resolve) => {
			req.session!.destroy((err) => {
				// clear the cookie before the error occurs
				res.clearCookie(COOKIE_NAME);
				if (err) {
					console.error(err);
					resolve(false);
				}
				// unreachable if the error occurs
				resolve(true);
			});
		});
	}
}
