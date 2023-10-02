import ArticleSkeleton from '@/components/skeleton/ArticleSkeleton';
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="w-full my-10">
      <div role="status" className="max-w-sm animate-pulse my-10">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5" />
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5" />
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
        <span className="sr-only">Loading...</span>
      </div>

      {/* Make below component in map funciton */}
      {Array.from(Array(5).keys()).map((item) => {
        return <ArticleSkeleton key={item} />;
      })}
    </div>
  );
};

export default LoadingSkeleton;
