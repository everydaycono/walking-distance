'use client';
import LoginFormLoader from '@/components/Loader/LoginFormLoader';
import api from '@/services/api/base';
import { isAxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect } from 'react';

export type SocialLoginType = {
  id: string;
  userName: string;
  avatar: string;
};

const SocialLoginCallbackPage: FC = (props) => {
  console.log(props, 'debug oauth code');
  const router = useRouter();
  const getAccessToken = async (props: any) => {
    try {
      const { data } = await api(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/github-callback?code=${props.searchParams.code}`
      );
      const result = data as SocialLoginType;

      if (!result.avatar || !result.id || !result.userName) {
        router.push(`/login?error=Something went wrong`);
        return;
      }
      signIn('github-login', {
        email: result.userName,
        id: result.id,
        avatar: result.avatar,
        type: 'github'
      });
      return result;
    } catch (error) {
      if (isAxiosError(error)) {
        router.push(`/login?error=${error.response?.data.message}`);
        return;
      }
      router.push(`/login?error=Something went wrong`);
    }
  };
  useEffect(() => {
    getAccessToken(props);
  }, []);
  return <LoginFormLoader />;
};

export default SocialLoginCallbackPage;
