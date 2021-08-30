import { hash, verify } from 'argon2';
import { createHash, BinaryToTextEncoding } from 'crypto';

export const sha256 = (value: string, encoding: BinaryToTextEncoding) =>
  createHash('sha256').update(value).digest(encoding);

// timing safe
export const hashPassword = (password: string) => hash(sha256(password, 'hex'));

export const comparePassword = (password1: string, password2: string) =>
  verify(password2, sha256(password1, 'hex'));
