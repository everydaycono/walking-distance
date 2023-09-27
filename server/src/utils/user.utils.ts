// bcryptjs

import bcrypt from 'bcryptjs';

interface PasswordComparisonData {
  plainPassword: string;
  hashedPassword: string;
}

export const passwordHash = (password: string) => {
  return bcrypt.hashSync(password, 11);
};

export const passwordCompare = async ({
  hashedPassword,
  plainPassword
}: PasswordComparisonData) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
