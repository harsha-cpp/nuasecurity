'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Post } from '@/lib/api';
import { staggerItem, scaleOnHover } from '@/lib/motion';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  console.log('PostCard received post:', post);
  
  const formattedDate = post.createdAt ? 
    new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : 'Recent';

  return (
    <motion.div
      variants={staggerItem}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
    >
      <Link href={`/post/${post.id}`}>
        <motion.article
          variants={scaleOnHover}
          className="glass-card p-6 h-full hover:border-blue-500/30 transition-colors cursor-pointer group flex flex-col"
        >
          {/* Header Section */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white group-hover:text-gradient transition-all mb-2">
                {post.title || 'Untitled Post'}
              </h2>
              {post.category && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                  {post.category}
                </span>
              )}
            </div>
          </div>

          {/* Content Section - Flexible */}
          <div className="flex-1">
            {post.excerpt && (
              <p className="text-gray-400 line-clamp-3" style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Footer Section - Fixed at bottom */}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
            <div className="flex items-center space-x-4">
              {post.author && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </span>
              )}
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </span>
            </div>
            
            <motion.span
              className="text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center"
            >
              Read more
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}

