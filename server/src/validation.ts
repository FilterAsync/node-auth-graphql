import Joi from 'joi';
import JoiPassword from 'joi-password';

const [username, email, password] = [
	Joi.string()
		.min(3)
		.max(20)
		.regex(/\w/)
		.trim()
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
	JoiPassword.string()
		.minOfSpecialCharacters(1)
		.minOfLowercase(1)
		.minOfUppercase(1)
		.minOfNumeric(1)
		.noWhiteSpaces()
		.min(10)
		.required(),
];

export const registerSchema = Joi.object().keys({
	username,
	email,
	password,
});

export const forgotPasswordSchema = Joi.object().keys({
	password,
});
