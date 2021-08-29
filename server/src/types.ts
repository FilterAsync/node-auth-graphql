import { Request, Response } from 'express';
import type { Redis } from 'ioredis';

export type AuthContext = {
	req: Request;
	res: Response;
	redis: Redis;
};
