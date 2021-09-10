import type { Request, Response } from 'express';
import type { Redis } from 'ioredis';
import type { Options } from 'nodemailer/lib/mailer';

export interface AppContext {
	req: Request;
	res: Response;
	redis: Redis;
	sendMail: (
		options: Omit<Options, 'from'>
	) => Promise<void>;
}
