import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
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
  };
}
/** Example on how to extend the built-in session types */
declare module 'next-auth' {
  interface Session {
    /** This is an example. You can find me in types/next-auth.d.ts */
    user: IUser;
  }
}

/** Example on how to extend the built-in types for JWT */
declare module 'next-auth/jwt' {
  interface JWT {
    /** This is an example. You can find me in types/next-auth.d.ts */
    user: IUser;
  }
}
