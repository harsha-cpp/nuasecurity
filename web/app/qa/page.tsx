'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

interface VulnTest {
  id: string;
  name: string;
  description: string;
  category: string;
  targetUrl: string;
  payload?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const vulnerabilityTests: VulnTest[] = [
  {
    id: 'sqli',
    name: 'SQL Injection',
    description: 'Test SQL injection in post ID parameter',
    category: 'Injection',
    targetUrl: '/post/1',
    payload: "1' OR '1'='1",
    severity: 'critical',
  },
  {
    id: 'xss_reflected',
    name: 'Reflected XSS',
    description: 'Test reflected XSS in search functionality',
    category: 'XSS',
    targetUrl: '/search',
    payload: '<script>alert("XSS")</script>',
    severity: 'high',
  },
  {
    id: 'xss_stored',
    name: 'Stored XSS',
    description: 'Test stored XSS via contact form in admin messages',
    category: 'XSS',
    targetUrl: '/admin/messages',
    payload: '<img src=x onerror=alert(document.cookie)>',
    severity: 'critical',
  },
  {
    id: 'ssti',
    name: 'Server-Side Template Injection',
    description: 'Test SSTI in contact form template fields',
    category: 'Injection',
    targetUrl: '/contact',
    payload: '{{7*7}}',
    severity: 'critical',
  },
  {
    id: 'vuln_components',
    name: 'Vulnerable Components',
    description: 'jQuery 1.8.3 with known CVEs on search page',
    category: 'Components',
    targetUrl: '/search',
    severity: 'high',
  },
  {
    id: 'idor',
    name: 'IDOR',
    description: 'Test insecure direct object reference in admin comments',
    category: 'Access Control',
    targetUrl: '/api/admin/comments/1',
    severity: 'medium',
  },
  {
    id: 'xxe',
    name: 'XXE Injection',
    description: 'Test XML external entity injection in webhook validator',
    category: 'Injection',
    targetUrl: '/api/webhook/validate',
    payload: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>',
    severity: 'critical',
  },
  {
    id: 'path_traversal',
    name: 'Path Traversal',
    description: 'Test directory traversal in file view',
    category: 'File Access',
    targetUrl: '/api/files/view',
    payload: '../../../etc/passwd',
    severity: 'high',
  },
  {
    id: 'sensitive_exposure',
    name: 'Sensitive Data Exposure',
    description: 'Test debug endpoint for sensitive information',
    category: 'Information Disclosure',
    targetUrl: '/api/debug',
    severity: 'medium',
  },
  {
    id: 'open_redirect',
    name: 'Open Redirect',
    description: 'Test unvalidated redirect in redirect endpoint',
    category: 'Redirect',
    targetUrl: '/redirect',
    payload: '//evil.com',
    severity: 'medium',
  },
];

export default function QAPage() {
  const [testResults, setTestResults] = useState<Record<string, 'pass' | 'warn' | 'fail' | null>>({});

  const handleCheck = async (test: VulnTest) => {
    try {
      const response = await fetch(test.targetUrl);
      if (response.ok) {
        setTestResults((prev) => ({ ...prev, [test.id]: 'pass' }));
      } else {
        setTestResults((prev) => ({ ...prev, [test.id]: 'warn' }));
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [test.id]: 'fail' }));
    }
  };

  const handleOpenUI = (test: VulnTest) => {
    window.open(test.targetUrl, '_blank');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'low':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getResultIcon = (result: 'pass' | 'warn' | 'fail' | null) => {
    if (result === 'pass') {
      return (
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (result === 'warn') {
      return (
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    if (result === 'fail') {
      return (
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  const passCount = Object.values(testResults).filter((r) => r === 'pass').length;
  const warnCount = Object.values(testResults).filter((r) => r === 'warn').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-12"
      >
        <h1 className="text-5xl font-bold text-gradient mb-6">QA Console</h1>
        <p className="text-xl text-gray-400 mb-6">
          Security vulnerability testing dashboard for trainers and QA
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Tests</p>
                <p className="text-3xl font-bold text-white">{vulnerabilityTests.length}</p>
              </div>
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Passed</p>
                <p className="text-3xl font-bold text-green-400">{passCount}</p>
              </div>
              <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Warnings</p>
                <p className="text-3xl font-bold text-yellow-400">{warnCount}</p>
              </div>
              <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Test Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {vulnerabilityTests.map((test) => (
          <motion.div
            key={test.id}
            variants={staggerItem}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{test.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{test.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                    {test.category}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded border ${getSeverityColor(test.severity)}`}>
                    {test.severity.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                {getResultIcon(testResults[test.id] || null)}
              </div>
            </div>

            {test.payload && (
              <div className="mb-4 p-3 bg-white/[0.02] rounded border border-white/[0.05]">
                <p className="text-xs text-gray-500 mb-1">Example Payload:</p>
                <code className="text-xs text-blue-400 break-all">{test.payload}</code>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleOpenUI(test)}
                className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm font-medium"
              >
                Open UI Flow
              </button>
              <button
                onClick={() => handleCheck(test)}
                className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm font-medium"
              >
                Check
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

