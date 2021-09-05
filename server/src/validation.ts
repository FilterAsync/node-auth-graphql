import Joi from 'joi';

const [username, email, password] = [
	Joi.string()
		.min(3)
		.max(20)
		.regex(/\w{3,20}/)
		.required()
		.messages({
			'string.pattern.base': '"username" is invalid',
		}),
	Joi.string()
		.min(3)
		.max(255)
		.email()
		.lowercase()
		.required(),
	// TODO: password strength
	Joi.string().min(8).required(),
];

export const registerSchema = Joi.object().keys({
	username,
	email,
	password,
});

export const forgotPasswordSchema = Joi.object().keys({
	password,
});
