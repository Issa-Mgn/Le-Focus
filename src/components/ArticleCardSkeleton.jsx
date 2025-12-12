import React from 'react';
import Skeleton from './Skeleton';

const ArticleCardSkeleton = ({ featured = false }) => {
  if (featured) {
    return (
      <div className="grid md:grid-cols-2 gap-0 h-auto md:h-[400px] overflow-hidden rounded-2xl bg-white shadow-lg border border-neutral-100">
        <Skeleton className="h-64 md:h-full w-full rounded-none" />
        <div className="p-6 md:p-8 flex flex-col justify-between h-full">
          <div>
            <div className="flex gap-6 mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-3/4 mb-6" />
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg border border-neutral-100">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-2/3 mb-4" />
          <div className="space-y-2 mb-6">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-neutral-100 mt-auto">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export default ArticleCardSkeleton;
