import {
	Prop,
	Pre,
	getModelForClass as model,
} from '@typegoose/typegoose';
import { createHash, createHmac } from 'crypto';
import { CORS_ORIGIN } from '../constants';
import { ObjectType, Field, ID } from 'type-graphql';
import {
	hashPassword,
	comparePassword,
	timingEqual,
} from '../utils';

@ObjectType('User')
@Pre<User>('save', async function () {
	// timing attacks
	if (this.isModified('password')) {
		this.password = await hashPassword(this.password);
	}
})
export class User {
	// graphql code generator problematic
	@Field(() => ID)
	id?: string;

	@Prop({
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 20,
		immutable: true,
	})
	@Field()
	username!: string;

	@Prop({
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 255,
		lowercase: true,
	})
	@Field()
	email!: string;

	@Prop({
		required: true,
	})
	@Field()
	password!: string;

	@Prop({
		required: true,
	})
	@Field()
	avatar!: string;

	@Prop({
		required: false,
	})
	@Field({ nullable: true })
	verifiedAt!: Date;

	comparePassword(password: string) {
		return comparePassword(password, this.password);
	}

	gravatar(size: number = 96) {
		const hash = createHash('md5')
			.update(this.email)
			.digest('hex');

		return `https://www.gravatar.com/avatar/${hash}?d=mp&s=${size}`;
	}

	verificationUrl() {
		const token = createHash('sha1')
			.update(this.email)
			.digest('hex');

		const url = `${CORS_ORIGIN}/verification?token=${token}`;
		const signature = UserModel.signVerificationUrl(token);

		return `${url}&signature=${signature}`;
	}

	static signVerificationUrl(url: string) {
		return createHmac('sha256', 'qwerty')
			.update(url)
			.digest('hex');
	}

	static hasValidVerificationUrl(
		token: string,
		signature: string
	) {
		// validate the "signature" parameter in the query string
		// if the attackers steals the verification token
		// they will have to validate the signature

		const originalSignature =
			UserModel.signVerificationUrl(token);

		return timingEqual(originalSignature, signature);
	}
}

export const UserModel = model(User, {
	schemaOptions: {
		timestamps: true,
	},
});
