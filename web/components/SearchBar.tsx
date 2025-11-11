'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchPosts } from '@/lib/api';
import { dropdownVariants } from '@/lib/motion';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  showDropdown?: boolean;
}

export default function SearchBar({ onSearch, showDropdown = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simple autocomplete without jQuery dependency
  useEffect(() => {
    // No jQuery dependency needed for modern search functionality
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    
    if (value.length > 1 && showDropdown) {
      setIsLoading(true);
      const data = await searchPosts(value);
      setResults(data.results || []);
      setIsOpen(true);
      setIsLoading(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search posts..."
          className="input-field pr-12"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          {isLoading ? (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

      {showDropdown && (
        <AnimatePresence>
          {isOpen && results.length > 0 && (
            <motion.div
              variants={dropdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute top-full left-0 right-0 mt-2 glass-card p-2 max-h-96 overflow-y-auto z-50"
              role="listbox"
            >
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(result.title);
                    if (onSearch) onSearch(result.title);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-white/[0.05] rounded-lg transition-colors"
                  role="option"
                  aria-selected={false}
                >
                  <div className="font-medium text-white">{result.title}</div>
                  {result.excerpt && (
                    <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                      {result.excerpt}
                    </div>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

