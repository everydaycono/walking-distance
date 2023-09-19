import AuthForm from '@/components/AuthForm';
import { FC } from 'react';

interface loginProps {}

const Login: FC<loginProps> = ({}) => {
  return <AuthForm type={'login'} />;
};

export default Login;
