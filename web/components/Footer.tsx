'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/category/technology" className="hover:text-white transition-colors">Technology</a></li>
              <li><a href="/category/lifestyle" className="hover:text-white transition-colors">Lifestyle</a></li>
              <li><a href="/category/business" className="hover:text-white transition-colors">Business</a></li>
              <li><a href="/category/travel" className="hover:text-white transition-colors">Travel</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/archive" className="hover:text-white transition-colors">All Posts</a></li>
              <li><a href="/search" className="hover:text-white transition-colors">Search</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/feed.xml" className="hover:text-white transition-colors">RSS Feed</a></li>
              <li><a href="mailto:hello@insightsblog.com" className="hover:text-white transition-colors">Email</a></li>
            </ul>
          </div>
        </motion.div>
        
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Insights & Ideas. Sharing thoughtful content that matters.
          </p>
        </div>
      </div>
    </footer>
  );
}

