'use client';

import { FC } from 'react';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { TestQuery } from '@/services/api/testQuery';

interface FetchProps {}

const Fetch: FC<FetchProps> = ({}) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['data-fetch'],
    queryFn: () => TestQuery.testQuery(),
    enabled: false,
    retry: false
  });

  const handleClick = () => {
    refetch();
  };
  return <Button onClick={handleClick}>Fetch Button</Button>;
};

export default Fetch;
