import { AuthChecker, MiddlewareFn } from 'type-graphql';
import { AuthContext } from '../types';

export const authChecker: AuthChecker<AuthContext> = ({
	context: { req },
}) => !!req.session!.userId;

export const guest: MiddlewareFn<AuthContext> = (
	{ context: { req } },
	next
) => {
	if ('userId' in req.session!) {
		throw new Error('you are already authenticated');
	}
	return next();
};
