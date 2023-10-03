import React from 'react';

const Footer = () => {
  return (
    <footer className="bottom-0 mt-10 left-0 z-20 w-full p-4 border-t border-gray-500 shadow md:flex md:items-center md:justify-between md:p-6 dark:border-gray-600">
      <div className="max-w-7xl w-full mx-auto">
        <span className="text-sm text-gray-500  px-5 sm:text-center dark:text-gray-400">
          © 2023
          <a href="https://flowbite.com/" className="hover:underline">
            Walkdi
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
