'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Toast from '@/components/Toast';
import { sendContact } from '@/lib/api';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subjectTpl: '',
    bodyTpl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await sendContact(formData);

    if (result.success) {
      setToast({ show: true, message: 'Message sent successfully!', type: 'success' });
      setFormData({ name: '', email: '', message: '', subjectTpl: '', bodyTpl: '' });
    } else {
      setToast({ show: true, message: result.message || 'Failed to send message', type: 'error' });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-bold text-gradient mb-6">Contact Us</h1>
        <p className="text-lg md:text-xl 2xl:text-2xl text-gray-400">
          Have questions? We'd love to hear from you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          <motion.div variants={staggerItem} className="glass-card p-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="font-semibold text-white mb-1">Email</h3>
                <p className="text-gray-400 text-sm">hello@insightsblog.com</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="glass-card p-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-white mb-1">Location</h3>
                <p className="text-gray-400 text-sm">Global (Remote Team)</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="glass-card p-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-white mb-1">Response Time</h3>
                <p className="text-gray-400 text-sm">Within 24 hours</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} className="glass-card p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Your message..."
                />
              </div>

              {/* Optional template fields (intentional SSTI surface) */}
              <details className="text-gray-400 text-sm">
                <summary className="cursor-pointer hover:text-white transition-colors">
                  Advanced Options (Optional)
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="subjectTpl" className="block text-sm font-medium text-gray-400 mb-2">
                      Subject Template
                    </label>
                    <input
                      type="text"
                      id="subjectTpl"
                      name="subjectTpl"
                      value={formData.subjectTpl}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Custom subject template"
                    />
                  </div>
                  <div>
                    <label htmlFor="bodyTpl" className="block text-sm font-medium text-gray-400 mb-2">
                      Body Template
                    </label>
                    <input
                      type="text"
                      id="bodyTpl"
                      name="bodyTpl"
                      value={formData.bodyTpl}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Custom body template"
                    />
                  </div>
                </div>
              </details>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
