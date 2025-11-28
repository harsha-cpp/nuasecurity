'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';

export default function RedirectSuccessPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const msg = searchParams?.get('message') || searchParams?.get('found');
    if (msg) {
      setMessage(msg);
    }
  }, [searchParams]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="glass-card p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-6 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="text-4xl font-bold text-gradient mb-4">Redirect Successful!</h1>
        
        {message && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 font-medium">{message}</p>
          </div>
        )}

        <p className="text-gray-400 mb-8">
          You have been successfully redirected to this page.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/redirect" className="btn-secondary">
            Test Again
          </Link>
        </div>
      </motion.div>

      {message && (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="mt-8 glass-card p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Query Parameters</h2>
          <div className="space-y-2">
            <div className="p-4 bg-white/[0.02] rounded-lg border border-white/[0.05]">
              <p className="text-sm text-gray-500 mb-1">Message/Found:</p>
              <code className="text-blue-400">{message}</code>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
