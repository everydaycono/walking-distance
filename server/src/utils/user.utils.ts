// bcryptjs

import * as bcrypt from 'bcrypt';

interface PasswordComparisonData {
  plainPassword: string;
  hashedPassword: string;
}

export const passwordHash = (password: string) => {
  return bcrypt.hashSync(password, 11);
};

export const passwordCompare = async ({
  plainPassword,
  hashedPassword
}: PasswordComparisonData) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
