'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAdminMessages, Message } from '@/lib/api';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      setIsLoading(true);
      const data = await getAdminMessages();
      setMessages(data);
      setIsLoading(false);
    }
    fetchMessages();
  }, []);

  // Get XSS flag from env (intentional exposure for training)
  const xssFlag = process.env.NEXT_PUBLIC_XSS_FLAG || 'FLAG{xss_demo}';

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-12"
      >
        <h1 className="text-5xl font-bold text-gradient mb-6">Admin Messages</h1>
        <p className="text-xl text-gray-400">
          View all contact form submissions (unauthenticated access — intentional)
        </p>
      </motion.div>

      {/* Secret Badge (XSS Target) */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Admin Session</h2>
            <p className="text-gray-400 text-sm">Authenticated as administrator</p>
          </div>
          <div className="px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-xs text-yellow-400 mb-1">XSS Flag (Training Target)</p>
            <code className="text-yellow-300 font-mono text-sm" id="admin-flag">
              {xssFlag}
            </code>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-8 animate-pulse">
              <div className="h-6 bg-white/[0.05] rounded mb-4 w-1/3" />
              <div className="h-4 bg-white/[0.05] rounded mb-2 w-1/4" />
              <div className="h-4 bg-white/[0.05] rounded w-full" />
            </div>
          ))}
        </div>
      ) : messages.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={staggerItem}
              className="glass-card p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{message.name}</h3>
                  <a href={`mailto:${message.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                    {message.email}
                  </a>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              
              {/* INTENTIONAL VULNERABILITY: Stored XSS via dangerouslySetInnerHTML */}
              <div className="p-6 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <p className="text-sm text-gray-500 mb-2">Message:</p>
                <div
                  className="text-gray-300 leading-relaxed prose prose-invert max-w-none message-html"
                  dangerouslySetInnerHTML={{ __html: message.message }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="glass-card p-12 text-center"
        >
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-400 text-lg">No messages yet.</p>
        </motion.div>
      )}
    </div>
  );
}
