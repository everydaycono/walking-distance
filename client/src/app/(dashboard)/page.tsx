import Fetch from '@/components/Fetch';

import { FC } from 'react';

interface pageProps {}

async function getData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');

  if (!res.ok) {
    throw new Error('something went wrong');
  }
  return res.json();
}

const page: FC<pageProps> = async ({}) => {
  const data = (await getData()) as {
    userId: number;
    id: number;
    title: string;
    body: string;
  }[];

  return (
    <div>
      <Fetch />
      <div>
        {data.map((item) => {
          return (
            <div>
              <h5>{item.title}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
