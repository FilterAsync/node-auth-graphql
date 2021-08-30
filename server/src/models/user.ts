import {
	prop as Prop,
	getModelForClass as model,
	pre as Pre,
} from '@typegoose/typegoose';
import crypto from 'crypto';
import { ObjectType, Field, ID } from 'type-graphql';
import { hashPassword, comparePassword } from '../utils';

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
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 20,
	})
	@Field()
	username!: string;

	@Prop({
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 255,
		lowercase: true,
	})
	@Field()
	email!: string;

	@Prop({
		type: String,
		required: true,
	})
	@Field()
	password!: string;

	@Prop({
		type: String,
		required: true,
	})
	@Field()
	avatar!: string;

	comparePassword(password: string) {
		return comparePassword(password, this.password);
	}
	gravatar(size: number = 256) {
		const hash = crypto
			.createHash('md5')
			.update(this.email)
			.digest('hex');
		return `https://www.gravatar.com/avatar/${hash}?d=mp&s=${size}`;
	}
}

export const UserModel = model(User, {
	schemaOptions: {
		timestamps: true,
	},
});
