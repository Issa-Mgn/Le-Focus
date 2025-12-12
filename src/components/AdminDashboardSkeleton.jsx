import React from 'react';
import Skeleton from './Skeleton';

const AdminDashboardSkeleton = () => {
    return (
        <div className="animate-fade-in">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                        <div className="flex justify-between items-start mb-4">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bar Chart Skeleton */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <div className="h-80 flex items-end justify-between gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <Skeleton key={i} className={`w-full rounded-t-sm h-[${Math.floor(Math.random() * 80) + 10}%]`} />
                        ))}
                    </div>
                </div>

                {/* Performance List Skeleton */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                    <Skeleton className="h-6 w-48 mb-8" />
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-4 flex-grow w-full">
                                    <Skeleton className="h-4 w-6 rounded-full" />
                                    <div className="flex-grow">
                                        <Skeleton className="h-4 w-full mb-1" />
                                        <div className="flex gap-4">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                </div>
                                <Skeleton className="h-2 w-full sm:w-24 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/6 hidden md:block" />
                            <Skeleton className="h-4 w-1/6 hidden sm:block" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardSkeleton;
