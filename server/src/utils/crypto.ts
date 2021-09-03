import { hash, verify } from 'argon2';
import { createHash, BinaryToTextEncoding } from 'crypto';

export const sha256 = (
	plaintext: string,
	encoding: BinaryToTextEncoding
) =>
	createHash('sha256').update(plaintext).digest(encoding);

// pre-hash plaintext passwords before hashing them to argon2
export const hashPassword = (password: string) =>
	hash(sha256(password, 'base64'));

export const comparePassword = (
	plainPassword: string,
	hashedPassword: string
) =>
	verify(hashedPassword, sha256(plainPassword, 'base64'));
