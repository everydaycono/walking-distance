import { tokenEncryptor } from '@/utils/crypto-token';
import axios, { isAxiosError } from 'axios';
import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
  id: string;
  token: {
    access: string;
    refresh: string;
    expiresIn: number;
  };
}

async function refreshToken(token: JWT): Promise<JWT> {
  const url = `${process.env.SERVER_BASE_URL}/api/auth/refresh-token`;
  const headers = {
    authorization: `Bearer ${tokenEncryptor.refreshDecrypt(
      token.user.token.refresh
    )}`
  };

  const res = await fetch(url, { method: 'POST', headers });
  const response = await res.json();

  return {
    ...token,
    user: {
      ...token.user,
      token: {
        access: tokenEncryptor.accessEncrypt(response.token.access),
        refresh: tokenEncryptor.refreshEncrypt(response.token.refresh),
        expiresIn: response.token.expiresIn
      }
    }
  };
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Login page',
      //   자격 증명은 로그인 페이지에서 적절한 양식을 생성하는 데 사용됩니다.
      // 제출할 것으로 예상되는 필드를 지정할 수 있습니다
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Email'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password'
        }
      },
      //  여기에 자격 증명을 사용하는 고유한 논리를 제공해야 합니다. // 제출된 후 사용자 또는 값을 나타내는 객체를 반환합니다.
      // 여기에 제출된 자격 증명을 가져와서
      // 제출된 자격 증명을 받아 사용자를 나타내는 객체 또는 자격 증명이 유효하지 않은 경우 거짓/무효인 값
      // 자격 증명이 유효하지 않은 경우 거짓/무효인 값을 반환합니다.
      // 예: 반환 { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
      // '요청' 객체를 사용하여 추가 매개변수를 가져올 수도 있습니다.
      // (즉, 요청 IP 주소)
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials) {
          throw new Error('Please enter email and password');
        }
        try {
          const { data } = await axios.post(
            `${process.env.SERVER_BASE_URL}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password
            }
          );
          const user = data as IUser;
          return user;
        } catch (error) {
          if (isAxiosError(error)) {
            throw new Error(
              error.response?.data.message ||
                'Unauthorized - check your email and password'
            );
          }
          // Return null if user data could not be retrieved
          throw new Error('Unauthorized');
        }
      },
      // client signIn() ID 값
      id: 'credentials-login',
      type: 'credentials'
    }),
    CredentialsProvider({
      name: 'Login page',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Email'
        },
        id: {
          label: 'Id',
          type: 'text',
          placeholder: 'id'
        },
        type: {
          label: 'Type',
          type: 'text',
          placeholder: 'type'
        },
        avatar: {
          label: 'Avatar',
          type: 'text',
          placeholder: 'avatar'
        }
      },
      async authorize(credentials, req) {
        if (
          credentials?.email === '' ||
          credentials?.id === '' ||
          credentials?.type === ''
        ) {
          throw new Error('Coudnt find credentials with social login');
        }

        try {
          const { data } = await axios.post(
            `${process.env.SERVER_BASE_URL}/api/auth/social-login`,
            {
              email: credentials?.email,
              id: credentials?.id,
              avatar: credentials?.avatar,
              type: credentials?.type
            }
          );
          const user = data as IUser;
          return user;
        } catch (error) {
          if (isAxiosError(error)) {
            throw new Error(
              error.response?.data.message ||
                'Unauthorized - check your email and password'
            );
          }
          // Return null if user data could not be retrieved
          throw new Error('Unauthorized - Social login');
        }
      },
      id: 'github-login',
      type: 'credentials'
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
    async session({ session, user, token }) {
      // session.info = token;
      // if (token) {
      //   session.user = token.user; // next-auth.d.ts 에 타입 정의 되어 있습니다.
      // }
      session.user = token.user;
      // update session
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        // user 의 타입이 정의 되어있지 않습니다.
        //@ts-ignore
        token.user = user; // token 타입은 next-auth.d.ts 에 타입 정의 되어 있습니다.
        token.user.token.access = tokenEncryptor.accessEncrypt(
          //@ts-ignore
          user.token.access
        );
        token.user.token.refresh = tokenEncryptor.refreshEncrypt(
          //@ts-ignore
          user.token.refresh
        );
        return token;
      }

      if (new Date().getTime() < token.user.token.expiresIn) {
        return token;
      }
      return await refreshToken(token);
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
