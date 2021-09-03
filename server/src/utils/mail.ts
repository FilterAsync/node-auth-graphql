import {
	createTransport,
	getTestMessageUrl,
} from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { __PROD__ } from '../constants';

// TODO implementing mail system
// this is for development only do not use it in production
export async function sendMail(
	options: Omit<Options, 'from'>
) {
	const transporter = createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: 'kiuxcchwvjum4vwx@ethereal.email',
			pass: 'cbV9n6CGbW6sHBMVXx',
		},
	});

	transporter.sendMail(
		{
			from: '"Mailer"',
			...options,
		},
		(_, info) => {
			console.log('message info: %s', info);
			console.log(
				'preview url: %s',
				getTestMessageUrl(info)
			);
		}
	);
}
