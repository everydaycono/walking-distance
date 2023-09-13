import { randomBytes, createHash } from 'crypto';

export const accessTkDevExpiresIn = '3h';
export const accessTkPrdExpiresIn = '15m';
export const refreshTkExpiresIn = '3d';

export const emailVerificationExpiry = 20 * 60 * 1000; //20mins

export const createRandomToken = randomBytes(20).toString('hex');
export const updateRandomToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};
