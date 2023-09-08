import { Button } from '@/components/ui/button';
import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <Button>Fetch Button</Button>
    </div>
  );
};

export default page;
