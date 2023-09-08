'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient();

const QueryProvider: FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
