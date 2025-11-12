'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from '@/components/PostCard';
import { PostGridSkeleton } from '@/components/Skeletons';
import { getPosts, Post } from '@/lib/api';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import CategoryPills from '@/components/CategoryPills';

const homeCategories = ['technology', 'lifestyle', 'business', 'travel', 'health', 'education'];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      const data = await getPosts();
      console.log('Fetched posts:', data);
      setPosts(data);
      setIsLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12">
      {/* Hero Section */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-10 text-center"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-bold mb-6 lg:mb-8 text-gradient leading-[1.15] md:leading-[1.1] pb-2">
          Insights & Ideas
        </h2>
        <p className="text-lg md:text-xl 2xl:text-2xl text-gray-400 max-w-3xl 2xl:max-w-4xl mx-auto leading-relaxed">
          Discover thoughtful articles on technology, lifestyle, business, and more. 
          Join our community of readers exploring ideas that shape our world.
        </p>
      </motion.div>

      {/* Category Pills on Home */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.05 }}
        className="mb-10"
      >
        <CategoryPills categories={homeCategories} />
      </motion.div>

      {/* Featured Posts */}
      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Latest Posts</h2>
          <a
            href="/archive"
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-2"
          >
            <span>View all</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {isLoading ? (
          <PostGridSkeleton />
        ) : posts.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 2xl:gap-8"
          >
            {posts.slice(0, 12).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </motion.div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 text-lg">No posts available yet.</p>
          </div>
        )}
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
        className="mt-16"
      >
        <div className="glass-card p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Join Our Community</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Stay updated with our latest articles and insights. Explore topics that matter to you and connect with like-minded readers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/search" className="btn-primary">
              Search Articles
            </a>
            <a href="/about" className="btn-secondary">
              About Us
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
