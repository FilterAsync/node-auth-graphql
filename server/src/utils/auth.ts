import { Request } from 'express';

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
