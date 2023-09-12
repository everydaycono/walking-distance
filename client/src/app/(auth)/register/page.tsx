import AuthForm from '@/components/AuthForm';
import { FC } from 'react';

interface pageProps {}

const Register: FC<pageProps> = ({}) => {
  return <AuthForm type={'register'} />;
};

export default Register;
