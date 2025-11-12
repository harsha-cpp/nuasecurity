'use client';

import { motion } from 'framer-motion';
import { pulseVariants } from '@/lib/motion';

export function PostCardSkeleton() {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="glass-card p-6 h-full"
    >
      <div className="space-y-4">
        <div className="h-6 bg-white/[0.05] rounded w-3/4" />
        <div className="h-4 bg-white/[0.05] rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-white/[0.05] rounded w-full" />
          <div className="h-4 bg-white/[0.05] rounded w-full" />
          <div className="h-4 bg-white/[0.05] rounded w-2/3" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-white/[0.05] rounded w-1/4" />
          <div className="h-4 bg-white/[0.05] rounded w-20" />
        </div>
      </div>
    </motion.div>
  );
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="glass-card p-8 space-y-6"
    >
      <div className="h-8 bg-white/[0.05] rounded w-3/4" />
      <div className="flex space-x-4">
        <div className="h-4 bg-white/[0.05] rounded w-24" />
        <div className="h-4 bg-white/[0.05] rounded w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-white/[0.05] rounded w-full" />
        ))}
        <div className="h-4 bg-white/[0.05] rounded w-2/3" />
      </div>
    </motion.div>
  );
}

export function CommentSkeleton() {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className="glass-card p-6 space-y-4"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/[0.05] rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-white/[0.05] rounded w-24" />
          <div className="h-3 bg-white/[0.05] rounded w-32" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white/[0.05] rounded w-full" />
        <div className="h-4 bg-white/[0.05] rounded w-full" />
        <div className="h-4 bg-white/[0.05] rounded w-3/4" />
      </div>
    </motion.div>
  );
}

