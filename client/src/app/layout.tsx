import Navbar from '@/components/layout/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import QueryProvider from '@/components/providers/QueryProvider';
// import UserProvider from '@/components/providers/useUserProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import NextAuthProvider from '@/components/providers/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Walking distance',
  description: 'Walking distance'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* 🗑️ 11일 까지 삭제 예정 */}
            {/* <UserProvider> */}
            <QueryProvider>
              <AuthProvider>{children}</AuthProvider>
            </QueryProvider>
            {/* </UserProvider> */}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
