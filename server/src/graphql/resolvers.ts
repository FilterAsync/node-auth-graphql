import { User, UserModel } from '../models/user';
import {
	Query,
	Resolver,
	Mutation,
	Args,
	ArgsType,
	Field,
	Ctx,
} from 'type-graphql';
import { Unauthorized, Conflict } from 'http-errors';
import { AuthContext } from '../types';
import { COOKIE_NAME } from '../constants';

@ArgsType()
class LoginArgs {
	@Field(() => String)
	email!: string;

	@Field(() => String)
	password!: string;
}

@ArgsType()
class RegisterArgs {
	@Field(() => String)
	username!: string;

	@Field(() => String)
	email!: string;

	@Field(() => String)
	password!: string;
}

// todo: implement user resolver
@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	me(@Ctx() { req }: AuthContext) {
		if (!req.session!.userId) {
			return null;
		}
		return UserModel.findById(req.session!.userId);
	}

	@Mutation(() => Boolean)
	async login(
		@Args() { email, password }: LoginArgs,
		@Ctx() { req }: AuthContext
	) {
		const user = await UserModel.findOne({ email });

		if (!user || !(await user!.comparePassword(password))) {
			throw new Unauthorized('Invalid credentials');
		}

		req.session!.userId = user.id;

		return true;
	}

	@Mutation(() => Boolean)
	async register(
		@Args() { username, email, password }: RegisterArgs,
		@Ctx() { req }: AuthContext
	) {
		const [usernameExist, emailExist] = await Promise.all([
			UserModel.exists({ username }),
			UserModel.exists({ email }),
		]);

		if (usernameExist || emailExist) {
			throw new Conflict('username or email already exists');
		}

		const user = new UserModel({ username, email, password });
		await user.save();

		req.session!.userId = user.id;

		return true;
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: AuthContext) {
		return new Promise((resolve) => {
			req.session!.destroy((err) => {
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
