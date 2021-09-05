import type {
	AuthChecker,
	MiddlewareFn,
} from 'type-graphql';
import { AppContext } from '../types';

export const authChecker: AuthChecker<AppContext> = ({
	context: { req },
}) => !!req.session!.userId;

export const guest: MiddlewareFn<AppContext> = (
	{ context: { req } },
	next
) => {
	if ('userId' in req.session!) {
		throw new Error('you are already authenticated');
	}
	return next();
};
