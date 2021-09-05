import type { DocumentType } from '@typegoose/typegoose';
import type { BeAnObject } from '@typegoose/typegoose/lib/types';
import type { Request } from 'express';
import { User } from '../models';

export const resetPassword = async (
	user: DocumentType<User, BeAnObject>,
	newPassword: string
) => {
	user.password = newPassword;
	await user.save();
};

export const logIn = (
	req: Request,
	id: string
): Promise<boolean> => {
	return new Promise((resolve) => {
		if (!('userId' in req.session!)) {
			req.session!.userId = id;
			resolve(true);
		}
		resolve(false);
	});
};
