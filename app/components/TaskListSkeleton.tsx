"use client"

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export function TaskListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(7)].map((_, index) => (
        <div key={index} className="flex items-center justify-between space-x-2 bg-secondary p-2 rounded-md">
          <div className="flex items-center space-x-3 w-full">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-3/4 flex-grow" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

