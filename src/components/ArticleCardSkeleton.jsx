import React from 'react';
import Skeleton from './Skeleton';

const ArticleCardSkeleton = ({ featured = false }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg border border-neutral-100 h-[380px]">
      {/* Image Skeleton - 180px comme les vraies cartes */}
      <Skeleton className="h-[180px] w-full rounded-none flex-shrink-0" />
      
      {/* Content Skeleton */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="flex-1">
          {/* Meta Info */}
          <div className="flex gap-4 mb-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-2.5 w-12" />
          </div>
          
          {/* Title */}
          <Skeleton className="h-5 w-full mb-1.5" />
          <Skeleton className="h-5 w-2/3 mb-2" />
          
          {/* Excerpt */}
          <div className="space-y-1.5 mb-3">
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-2.5 w-4/5" />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-2 w-6" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
};

export default ArticleCardSkeleton;
