import { InputType, Field } from 'type-graphql';

@InputType()
export class Credentials {
	@Field()
	username!: string;

	@Field()
	email!: string;

	@Field()
	password!: string;
}
