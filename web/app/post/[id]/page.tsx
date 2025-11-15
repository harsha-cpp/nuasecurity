'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CommentList from '@/components/CommentList';
import { PostDetailSkeleton } from '@/components/Skeletons';
import { getPost, Post } from '@/lib/api';
import { fadeInUp } from '@/lib/motion';

export default function PostPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample comments for blog posts
  const sampleComments = [
    {
      id: 1,
      author: 'Alex Johnson',
      content: 'Great post! Very informative.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      author: 'Sarah Smith',
      content: 'Thanks for sharing this valuable insight.',
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      setIsLoading(true);
      const data = await getPost(id);
      setPost(data);
      setIsLoading(false);
    }
    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <PostDetailSkeleton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <div className="glass-card p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
          <p className="text-gray-400 mb-6">The post you're looking for doesn't exist.</p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.createdAt ? 
    new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : 'Recent';

  return (
    <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
      {/* Breadcrumb */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-8"
      >
        <nav className="flex items-center space-x-2 text-sm md:text-base text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {post.category && (
            <>
              <Link href={`/category/${post.category.toLowerCase()}`} className="hover:text-white transition-colors capitalize">
                {post.category}
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
          <span className="text-white">{post.title}</span>
        </nav>
      </motion.div>

      {/* Post Content */}
      <motion.article
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
        className="glass-card p-6 md:p-8 lg:p-10 2xl:p-12 mb-8"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-white mb-6">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-white/[0.08]">
          {post.author && (
            <span className="flex items-center text-gray-400">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {post.author}
            </span>
          )}
          <span className="flex items-center text-gray-400">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </span>
          {post.category && (
            <Link href={`/category/${post.category.toLowerCase()}`}>
              <span className="inline-block px-4 py-1.5 text-sm font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                {post.category}
              </span>
            </Link>
          )}
        </div>

        <div className="prose prose-invert prose-base md:prose-lg 2xl:prose-xl max-w-none">
          <p className="text-gray-300 leading-relaxed md:leading-loose whitespace-pre-line">{post.body}</p>
        </div>
      </motion.article>

      {/* Comments Section */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Comments</h2>
        <CommentList comments={sampleComments} />
      </motion.div>

      {/* Navigation */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 }}
        className="mt-12 flex justify-center"
      >
        <Link href="/" className="btn-secondary">
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
