import { FC } from 'react';

interface pageProps {
  searchParams: {
    type?: 'github' | 'google';
    id?: string;
    avatar?: string;
    userName?: string;
  };
}

const page: FC<pageProps> = ({ searchParams }) => {
  return <div>page</div>;
};

export default page;
