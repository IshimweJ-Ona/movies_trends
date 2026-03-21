import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <motion.div 
      className="flex items-center justify-center gap-2 my-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-3 rounded-xl border transition-all duration-300 ${
          currentPage === 1
            ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
            : 'bg-white/10 border-white/20 hover:bg-yellow-400 hover:border-yellow-400 hover:text-black'
        }`}
        whileHover={currentPage !== 1 ? { scale: 1.1, rotate: -5 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* Page Numbers */}
      <div className="flex flex-wrap justify-center gap-2 w-full overflow-x-auto px-2">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-4 py-3 text-gray-400">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <motion.button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[48px] px-4 py-3 rounded-xl border font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/50'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-yellow-400/50'
              }`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={!isActive ? { 
                scale: 1.1, 
                y: -3,
                backgroundColor: 'rgba(251, 191, 36, 0.2)',
                borderColor: 'rgba(251, 191, 36, 0.5)'
              } : { y: -3 }}
              whileTap={{ scale: 0.9 }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {pageNum}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-3 rounded-xl border transition-all duration-300 ${
          currentPage === totalPages
            ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
            : 'bg-white/10 border-white/20 hover:bg-yellow-400 hover:border-yellow-400 hover:text-black'
        }`}
        whileHover={currentPage !== totalPages ? { scale: 1.1, rotate: 5 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
