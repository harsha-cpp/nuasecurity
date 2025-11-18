'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import { searchPosts } from '@/lib/api';
import api from '@/lib/api';
import { fadeInUp } from '@/lib/motion';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [adv, setAdv] = useState({ category: '', q: '', idMax: '' });
  const [advResult, setAdvResult] = useState<{ items: any[]; sql: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    const results = await searchPosts(query);
    setSearchResults(results);
    // Also trigger advanced search against unsafe endpoint
    try {
      const params = new URLSearchParams();
      if (adv.category) params.append('category', adv.category);
      if (adv.q || query) params.append('q', adv.q || query);
      if (adv.idMax) params.append('idMax', adv.idMax);
      const { data } = await api.get(`/api/adv-search?${params.toString()}`);
      setAdvResult(data);
    } catch (e) {
      setAdvResult({ items: [], sql: '' });
    }
    setIsSearching(false);
  };

  return (
    <div className="max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
      {/* Intentionally load vulnerable jQuery 1.8.3 on this page only */}
      <script src="/jquery-1.8.3.min.js"></script>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-bold text-gradient mb-6">Search Posts</h1>
        <p className="text-lg md:text-xl 2xl:text-2xl text-gray-400 mb-8">
          Search for posts using our advanced search functionality
        </p>

        <div className="glass-card p-6">
          <SearchBar onSearch={handleSearch} showDropdown={true} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <input
              className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-2 text-sm text-white"
              placeholder="category (e.g., Technology)"
              value={adv.category}
              onChange={(e) => setAdv((s) => ({ ...s, category: e.target.value }))}
            />
            <input
              className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-2 text-sm text-white"
              placeholder="q (search in title/body)"
              value={adv.q}
              onChange={(e) => setAdv((s) => ({ ...s, q: e.target.value }))}
            />
            <input
              className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-2 text-sm text-white"
              placeholder="idMax (e.g., 100)"
              value={adv.idMax}
              onChange={(e) => setAdv((s) => ({ ...s, idMax: e.target.value }))}
            />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Powered by advanced search technology
          </p>
        </div>
      </motion.div>

      {isSearching && (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="glass-card p-12 text-center"
        >
          <svg className="animate-spin w-12 h-12 mx-auto mb-4 text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-400">Searching...</p>
        </motion.div>
      )}

      {!isSearching && searchResults && (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          {/* Server-rendered HTML Panel */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Server Results</h2>
              <span className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                Server-Rendered HTML
              </span>
            </div>
            
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: searchResults.html || '<p>No results</p>' }}
            />
          </div>

          {/* Structured Results */}
          {searchResults.results && searchResults.results.length > 0 && (
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Parsed Results</h2>
              <div className="space-y-4">
                {searchResults.results.map((result: any, index: number) => (
                  <a
                    key={index}
                    href={`/post/${result.id}`}
                    className="block p-6 bg-white/[0.03] hover:bg-white/[0.05] rounded-xl border border-white/[0.08] hover:border-blue-500/30 transition-all"
                  >
                    <h3 className="text-xl font-semibold text-white mb-2">{result.title}</h3>
                    {result.excerpt && (
                      <p className="text-gray-400 line-clamp-2">{result.excerpt}</p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Search Results (blogs) */}
          {advResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="md:col-span-2 glass-card p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Blog Matches</h2>
                </div>
                {advResult.items.length === 0 && (
                  <p className="text-gray-400">No posts matched.</p>
                )}
                <div className="space-y-3">
                  {advResult.items.map((it: any) => (
                    <div key={it.id} className="p-4 bg-white/[0.03] rounded-lg border border-white/[0.08]">
                      <div className="text-white font-semibold">{it.title}</div>
                      <div className="text-xs text-gray-400">ID: {it.id} • {new Date(it.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-4">
                <div className="text-xs text-gray-400 mb-2">Server query</div>
                <pre className="text-[11px] whitespace-pre-wrap break-words text-amber-200/90">{advResult.sql}</pre>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {!isSearching && hasSearched && !searchResults?.html && !searchResults?.results?.length && (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="glass-card p-12 text-center"
        >
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-400 text-lg">No results found.</p>
        </motion.div>
      )}
    </div>
  );
}
