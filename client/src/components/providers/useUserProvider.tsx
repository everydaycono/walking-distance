// 🗑️  11일 까지 삭제 예정
// 'use client';

// import { USER_INFO } from '@/utils/config';
// import { userInfo } from 'os';
// import { FC, createContext, useContext, useState } from 'react';

// interface IUser {
//   email: string;
//   firstName: string;
//   lastName: string;
//   avatar: string | null;
//   role: string;
//   id: string;
//   token: {
//     access: string;
//     refresh: string;
//   };
// }

// export interface IUserContext {
//   user: IUser | null;
//   handleUserState: (payload: IUser) => void;
//   handleUserLogout: () => void;
// }

// const UserContext = createContext<IUserContext>({
//   user: null,
//   handleUserState: () => {},
//   handleUserLogout: () => {}
// });
// interface UserProviderProps {
//   children: React.ReactNode;
// }

// // localstorate
// const getUserInfo = (key: string) => {
//   if (typeof window === 'undefined') return null;
//   const userInfo = localStorage.getItem(key);
//   if (!userInfo) {
//     return null;
//   }
//   return JSON.parse(userInfo) as IUser;
// };

// const UserProvider: FC<UserProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<IUser | null>(getUserInfo(USER_INFO));

//   const handleUserState = (payload: IUser) => {
//     setUser({
//       ...payload
//     });
//   };

//   const handleUserLogout = () => {
//     localStorage.removeItem(USER_INFO);
//     setUser(null);
//   };
//   return (
//     <UserContext.Provider value={{ user, handleUserState, handleUserLogout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserProvider = (): IUserContext => {
//   return useContext(UserContext);
// };

// export default UserProvider;
