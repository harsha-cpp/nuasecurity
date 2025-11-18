'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getComponentsStatus } from '@/lib/api';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

export default function SystemPage() {
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      setIsLoading(true);
      const data = await getComponentsStatus();
      setStatus(data);
      setIsLoading(false);
    }
    fetchStatus();
  }, []);

  const systemComponents = [
    {
      name: 'jQuery 1.8.3',
      description: 'Intentionally vulnerable jQuery version loaded on search page',
      status: 'active',
      version: '1.8.3',
      severity: 'high',
    },
    {
      name: 'Stored XSS',
      description: 'Admin messages page uses dangerouslySetInnerHTML',
      status: 'active',
      location: '/admin/messages',
      severity: 'critical',
    },
    {
      name: 'Reflected XSS',
      description: 'Search results rendered without sanitization',
      status: 'active',
      location: '/search',
      severity: 'high',
    },
    {
      name: 'SSTI',
      description: 'Template injection in contact form templates',
      status: 'active',
      location: '/contact',
      severity: 'critical',
    },
    {
      name: 'Nunjucks (server-side templating)',
      description: 'Server-side templating with autoescape disabled (training surface)',
      status: 'active',
      version: '3.2.4',
      severity: 'high',
    },
  ];

  const endpoints = [
    { path: '/api/posts', method: 'GET', description: 'Fetch all posts' },
    { path: '/api/posts/[id]', method: 'GET', description: 'Fetch single post' },
    { path: '/api/search', method: 'GET', description: 'Search posts (XSS surface)' },
    { path: '/api/contact', method: 'POST', description: 'Submit contact form (SSTI)' },
    { path: '/api/admin/messages', method: 'GET', description: 'View messages (no auth)' },
    { path: '/api/debug', method: 'GET', description: 'Debug information' },
    { path: '/feed.xml', method: 'GET', description: 'RSS feed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-12"
      >
        <h1 className="text-5xl font-bold text-gradient mb-6">System Status</h1>
        <p className="text-xl text-gray-400">
          Component status and API endpoints overview
        </p>
      </motion.div>

      {/* Vulnerable Components */}
      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-6">Vulnerable Components</h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {systemComponents.map((component, index) => {
            const severityColors = {
              critical: 'bg-red-500/20 border-red-500/50 text-red-400',
              high: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
              medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
              low: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
            };

            return (
              <motion.div
                key={index}
                variants={staggerItem}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{component.name}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full border ${severityColors[component.severity as keyof typeof severityColors]}`}>
                    {component.severity.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-400 mb-4">{component.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  {component.version && (
                    <span className="text-gray-500">Version: {component.version}</span>
                  )}
                  {component.location && (
                    <a href={component.location} className="text-blue-400 hover:text-blue-300 transition-colors">
                      View →
                    </a>
                  )}
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                    {component.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* API Endpoints */}
      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-6">API Endpoints</h2>
        <div className="glass-card p-6">
          <div className="space-y-3">
            {endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg border border-white/[0.05] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className={`px-2 py-1 text-xs font-mono rounded ${
                      endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-white font-mono text-sm">{endpoint.path}</code>
                  </div>
                  <p className="text-gray-500 text-sm">{endpoint.description}</p>
                </div>
                <a
                  href={endpoint.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  Test →
                </a>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Links */}
      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/feed.xml"
            target="_blank"
            className="glass-card p-6 hover:border-blue-500/30 transition-colors group"
          >
            <svg className="w-8 h-8 text-blue-400 mb-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gradient">RSS Feed</h3>
            <p className="text-gray-400 text-sm">Subscribe to updates</p>
          </a>

          <a
            href="/api/debug"
            target="_blank"
            className="glass-card p-6 hover:border-blue-500/30 transition-colors group"
          >
            <svg className="w-8 h-8 text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gradient">Debug API</h3>
            <p className="text-gray-400 text-sm">System debug info</p>
          </a>

          <a
            href="/search"
            className="glass-card p-6 hover:border-blue-500/30 transition-colors group"
          >
            <svg className="w-8 h-8 text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gradient">Search (jQuery 1.8.3)</h3>
            <p className="text-gray-400 text-sm">Vulnerable search page</p>
          </a>
        </div>
      </motion.section>
    </div>
  );
}
