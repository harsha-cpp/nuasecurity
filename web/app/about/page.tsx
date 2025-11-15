'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAbout, AboutContent } from '@/lib/api';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      setIsLoading(true);
      const data = await getAbout();
      setContent(data);
      setIsLoading(false);
    }
    fetchAbout();
  }, []);

  return (
    <div className="max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-bold text-gradient mb-6">About Our Blog</h1>
        <p className="text-lg md:text-xl 2xl:text-2xl text-gray-400">
          A thoughtful collection of articles exploring technology, lifestyle, and modern living
        </p>
      </motion.div>

      {isLoading ? (
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-white/[0.05] rounded mb-4 w-3/4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-white/[0.05] rounded" />
            ))}
          </div>
        </div>
      ) : content ? (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{content.title}</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {content.content}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-8">
          <p className="text-gray-400">Content not available.</p>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={staggerItem} className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Our Mission
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>• Share valuable insights and knowledge</li>
            <li>• Foster meaningful discussions</li>
            <li>• Explore diverse perspectives</li>
            <li>• Build a community of thoughtful readers</li>
          </ul>
        </motion.div>

        <motion.div variants={staggerItem} className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center">
            <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Topics We Cover
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>• Technology & Innovation</li>
            <li>• Lifestyle & Wellness</li>
            <li>• Business & Entrepreneurship</li>
            <li>• Travel & Culture</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
