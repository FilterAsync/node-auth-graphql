import crypto from 'crypto';

export const hashToken = async (plaintext: string) =>
	crypto
		.createHmac('sha256', 'forgot-password')
		.update(plaintext)
		.digest('hex');
