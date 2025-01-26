"use client"

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function NotesListSkeleton() {
  return (
    <div className="w-full md:w-64 border-r">
      <Button
        variant="ghost"
        className="w-full justify-between items-center md:hidden p-4"
      >
        Saved Notes
        <ChevronDown className="h-4 w-4" />
      </Button>
      <div className="p-4 space-y-2">
        {[...Array(13)].map((_, index) => (
          <div key={index} className="flex justify-between items-center space-x-2">
            <Skeleton className="h-8 w-full bg-gray-400/40" />
            <Skeleton className="h-8 w-8 rounded-full bg-gray-400/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

