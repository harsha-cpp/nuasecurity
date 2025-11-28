'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';

export default function RedirectPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');

  const handleRedirect = () => {
    if (url) {
      // Navigate to the redirect API endpoint (open redirect vulnerability)
      window.location.href = `/redirect?to=${encodeURIComponent(url)}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-bold text-gradient mb-6">URL Redirector</h1>
        <p className="text-xl text-gray-400">
          Test the redirect functionality (training surface)
        </p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        <div className="mb-6">
          <label htmlFor="url" className="block text-sm font-medium text-gray-400 mb-2">
            Redirect URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-2">
            Enter a URL to redirect to via the /redirect endpoint
          </p>
        </div>

        <button
          onClick={handleRedirect}
          disabled={!url}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test Redirect
        </button>

        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-3.86-.96-7-5.01-7-9.5V8.32l7-3.5 7 3.5V11c0 4.49-3.14 8.54-7 9.5z" />
            </svg>
            <div>
              <p className="text-yellow-400 text-sm font-semibold mb-1">Training Surface</p>
              <p className="text-gray-400 text-xs">
                This page demonstrates an open redirect vulnerability. Attackers can craft malicious URLs
                that redirect users to phishing sites.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className="mt-8 glass-card p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Example Payloads</h2>
        <div className="space-y-2">
          <button
            onClick={() => setUrl('https://example.com')}
            className="w-full text-left px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <code className="text-blue-400 text-sm">https://example.com</code>
          </button>
          <button
            onClick={() => setUrl('//evil.com')}
            className="w-full text-left px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <code className="text-blue-400 text-sm">//evil.com</code>
          </button>
          <button
            onClick={() => setUrl('/redirect-success?message=Success')}
            className="w-full text-left px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <code className="text-blue-400 text-sm">/redirect-success?message=Success</code>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

