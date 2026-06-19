import React from 'react';
import Skeleton from './Skeleton';

const ArticleDetailSkeleton = () => {
  return (
    <div className="bg-white min-h-screen animate-fade-in pb-20">
      {/* Header Image Skeleton - Matching h-[50vh] */}
      <div className="h-[50vh] relative w-full overflow-hidden bg-neutral-900">
        <Skeleton className="w-full h-full opacity-20" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 container-custom z-20">
            <Skeleton className="h-4 w-32 bg-primary-500/50 mb-4" />
            <Skeleton className="h-8 md:h-12 w-3/4 bg-white/20 mb-6" />
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full bg-white/20" />
                    <Skeleton className="h-4 w-32 bg-white/20" />
                </div>
                <Skeleton className="h-4 w-24 bg-white/20" />
            </div>
        </div>
      </div>

      <div className="container-custom relative z-10 -mt-10">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-neutral-100">
          
          {/* Actions Bar Skeleton */}
          <div className="flex justify-between items-center border-b border-neutral-100 pb-8 mb-8">
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-6 w-full mb-8" /> {/* Lead paragraph */}
            
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            
            <Skeleton className="h-32 w-full my-8 rounded-xl" /> {/* Image inside content */}
            
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Similar Articles Skeleton */}
        <div className="mt-16">
            <Skeleton className="h-8 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg border border-neutral-100">
                        <Skeleton className="h-48 w-full rounded-none" />
                        <div className="p-6 flex flex-col gap-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailSkeleton;
