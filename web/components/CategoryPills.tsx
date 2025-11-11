'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CategoryPillsProps {
  categories: string[];
}

export default function CategoryPills({ categories }: CategoryPillsProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => {
        const isActive = pathname?.includes(`/category/${category}`);
        
        return (
          <Link key={category} href={`/category/${category}`}>
            <motion.div
              className={`relative px-6 py-2 rounded-full font-medium text-sm transition-all ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'bg-white/[0.05] text-gray-400 hover:text-white hover:bg-white/[0.1] border border-white/[0.1]'
              }`}
              style={{ backgroundColor: isActive ? 'transparent' : undefined }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.45 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full -z-10"
                animate={{
                  scale: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                initial={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.45 }}
              />
              {category}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

