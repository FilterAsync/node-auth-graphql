import { MiddlewareFn } from 'type-graphql';
import { AuthContext } from '../../types';

export const isLoggedIn: MiddlewareFn<AuthContext> = async (
  { context: { req } },
  next
) => {
  if (!req.session?.userId) {
    throw new Error('Unauthorized');
  }
  return next();
};
