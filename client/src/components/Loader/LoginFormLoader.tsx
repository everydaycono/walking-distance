import Image from 'next/image';
import React from 'react';

const LoginFormLoader = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="h-full column items-center">
        <Image src={'/walkdi.svg'} alt="Loading" width={100} height={100} />

        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          We are Keep walking
          <span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
            Walkdi
          </span>
        </h1>
      </div>
    </div>
  );
};

export default LoginFormLoader;
