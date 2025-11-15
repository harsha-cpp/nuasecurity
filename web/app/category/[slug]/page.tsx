'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import PostCard from '@/components/PostCard';
import CategoryPills from '@/components/CategoryPills';
import { PostGridSkeleton } from '@/components/Skeletons';
import { getByCategory, Post } from '@/lib/api';
import { fadeInUp, staggerContainer } from '@/lib/motion';

const availableCategories = ['technology', 'lifestyle', 'business', 'travel', 'health', 'education'];

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      if (!slug) return;
      setIsLoading(true);
      const data = await getByCategory(slug);
      setPosts(data);
      setIsLoading(false);
    }
    fetchCategory();
  }, [slug]);

  return (
    <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-bold text-gradient mb-6 capitalize leading-[1.15] md:leading-[1.1] pb-2">
          {slug} Posts
        </h1>
        <p className="text-lg md:text-xl 2xl:text-2xl text-gray-400">
          Browse all posts in the {slug} category
        </p>
      </motion.div>

      {/* Category Pills */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
      >
        <CategoryPills categories={availableCategories} />
      </motion.div>

      {/* Posts */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <PostGridSkeleton />
        ) : posts.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 2xl:gap-8"
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </motion.div>
        ) : (
          <div className="glass-card p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 text-lg">No posts in this category yet.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
