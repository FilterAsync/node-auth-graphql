import type { Request, Response } from 'express';
import type { Redis } from 'ioredis';

export type AppContext = {
	req: Request;
	res: Response;
	redis: Redis;
};
