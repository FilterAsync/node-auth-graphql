import { Field, ID, ObjectType } from 'type-graphql';
import {
	Prop,
	Pre,
	getModelForClass as model,
	Index,
} from '@typegoose/typegoose';
import { randomBytes, createHmac } from 'crypto';
import { timingEqual } from '../utils';
import { CORS_ORIGIN } from '../constants';

@ObjectType('PasswordReset')
@Index<Reset>(
	{
		createdAt: -1,
	},
	{
		expireAfterSeconds: 1 * 60 * 60,
	}
)
@Pre<Reset>('save', async function () {
	if (this.isModified('token')) {
		this.token = ResetModel.hashToken(this.token);
	}
})
export class Reset {
	@Field(() => ID)
	id?: string;

	@Field()
	@Prop({
		ref: 'User',
		required: true,
		unique: true,
		immutable: true,
	})
	userId!: string;

	@Field()
	@Prop({
		required: true,
		unique: true,
	})
	token!: string;

	@Field()
	@Prop({
		required: false,
		default: Date.now,
	})
	createdAt!: Date;

	isValidToken(plaintextToken: string) {
		const hashToken = ResetModel.hashToken(plaintextToken);
		return timingEqual(hashToken, this.token);
	}

	createUrl(plaintextToken: string) {
		return `${CORS_ORIGIN}/reset-password?id=${this.id}&token=${plaintextToken}`;
	}

	static plaintextToken() {
		return randomBytes(40).toString('hex');
	}

	static hashToken(token: string) {
		return createHmac('sha256', 'qwertyuiop')
			.update(token)
			.digest('hex');
	}
}

export const ResetModel = model(Reset, {
	schemaOptions: {
		collection: 'password-resets',
		timestamps: {
			createdAt: true,
			updatedAt: false,
		},
	},
});
