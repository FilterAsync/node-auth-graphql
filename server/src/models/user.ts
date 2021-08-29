import {
	prop as Prop,
	getModelForClass as model,
	pre as Pre,
} from '@typegoose/typegoose';
import crypto from 'crypto';
import { ObjectType, Field } from 'type-graphql';
import { hashPassword, comparePassword } from '../utils/crypto';

@ObjectType('User')
@Pre<User>('save', async function () {
	// timing attacks
	if (this.isModified('password')) {
		this.password = await hashPassword(this.password);
	}
})
export class User {
	@Prop({
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 20,
	})
	@Field(() => String)
	username!: string;

	@Prop({
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 255,
	})
	@Field(() => String)
	email!: string;

	@Prop({
		required: true,
	})
	@Field(() => String)
	password!: string;

	comparePassword(password: string) {
		return comparePassword(password, this.password);
	}
	gravatar(size: number = 96) {
		const hash = crypto.createHash('md5').update(this.email).digest('hex');
		return `https://www.gravatar.com/avatar/${hash}?d=mp&s=${size}`;
	}
}

export const UserModel = model(User);
