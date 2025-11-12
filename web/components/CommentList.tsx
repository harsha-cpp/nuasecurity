'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {comments.map((comment) => (
        <motion.div
          key={comment.id}
          variants={staggerItem}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                {comment.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-white">{comment.author}</div>
                <div className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{comment.content}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

