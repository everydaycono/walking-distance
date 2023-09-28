import * as bcrypt from 'bcryptjs';

interface PasswordComparisonData {
  plainPassword: string;
  hashedPassword: string;
}

export const passwordHash = (password: string) => {
  return bcrypt.hashSync(password, 11);
};

export const passwordCompare = ({
  hashedPassword,
  plainPassword
}: PasswordComparisonData) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};
