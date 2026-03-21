import { motion } from 'motion/react';
import { Search, Filter, Film, ArrowUpDown, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export type SortOption = 'default' | 'rating-high' | 'rating-low' | 'year-new' | 'year-old' | 'title-az' | 'title-za';

interface HeaderProps {
  onSearch: (query: string) => void;
  onGenreFilter: (genres: string[]) => void;
  selectedGenres: string[];
  availableGenres: string[];
  onSortChange: (sort: SortOption) => void;
  sortBy: SortOption;
  onShowFavorites: () => void;
  showingFavorites: boolean;
  favoritesCount: number;
}

export function Header({ 
  onSearch, 
  onGenreFilter, 
  selectedGenres, 
  availableGenres,
  onSortChange,
  sortBy,
  onShowFavorites,
  showingFavorites,
  favoritesCount
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    onGenreFilter(newGenres);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'rating-high', label: 'Rating: High to Low' },
    { value: 'rating-low', label: 'Rating: Low to High' },
    { value: 'year-new', label: 'Year: Newest First' },
    { value: 'year-old', label: 'Year: Oldest First' },
    { value: 'title-az', label: 'Title: A-Z' },
    { value: 'title-za', label: 'Title: Z-A' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Default';

  return (
    <motion.header 
      className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-blue-950/70 border-b border-white/10 shadow-2xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Logo and Navigation */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Film className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              CineVerse
            </h1>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <div className="text-sm text-gray-300">
              {favoritesCount > 0 ? `${favoritesCount} favorites` : 'Browse movies'}
            </div>
            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="w-full lg:flex-1 lg:max-w-2xl lg:mx-8">
            <motion.div 
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300"
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex flex-wrap items-center justify-start gap-3 w-full lg:w-auto lg:justify-end">
            {/* Favorites Button */}
            <motion.button
              onClick={onShowFavorites}
              className={`relative w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 backdrop-blur-sm border rounded-full transition-all duration-300 ${
                showingFavorites
                  ? 'bg-red-500 border-red-500'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-5 h-5 ${showingFavorites ? 'fill-white' : ''}`} />
              <span>My List</span>
              {favoritesCount > 0 && (
                <motion.span
                  className="px-2 py-0.5 bg-yellow-400 text-black rounded-full text-sm font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {favoritesCount}
                </motion.span>
              )}
            </motion.button>

            {/* Sort Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, borderColor: 'rgba(251, 191, 36, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUpDown className="w-5 h-5" />
                <span className="hidden lg:inline">{currentSortLabel}</span>
                <span className="lg:hidden">Sort</span>
              </motion.button>

              {/* Sort Menu */}
              <motion.div
                initial={false}
                animate={{
                  opacity: showSortMenu ? 1 : 0,
                  y: showSortMenu ? 0 : -10,
                  scale: showSortMenu ? 1 : 0.95,
                  pointerEvents: showSortMenu ? 'auto' : 'none'
                }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
              >
                {sortOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setShowSortMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-all duration-200 ${
                      sortBy === option.value
                        ? 'bg-yellow-400 text-black font-bold'
                        : 'hover:bg-white/10 text-white'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: showSortMenu ? 1 : 0, x: showSortMenu ? 0 : -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Filter Button */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05, borderColor: 'rgba(251, 191, 36, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden lg:inline">Filters</span>
              {selectedGenres.length > 0 && (
                <span className="px-2 py-0.5 bg-yellow-400 text-black rounded-full text-sm font-bold">
                  {selectedGenres.length}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <motion.div
          initial={false}
          animate={{
            height: showMobileMenu ? 'auto' : 0,
            opacity: showMobileMenu ? 1 : 0,
            marginTop: showMobileMenu ? 8 : 0
          }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden lg:hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              onClick={onShowFavorites}
              className={`col-span-2 sm:col-span-1 relative w-full flex items-center justify-center gap-2 px-4 py-3 backdrop-blur-sm border rounded-full text-sm transition-all duration-300 ${
                showingFavorites
                  ? 'bg-red-500 border-red-500'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart className={`w-5 h-5 ${showingFavorites ? 'fill-white' : ''}`} />
              <span>My List</span>
              {favoritesCount > 0 && (
                <motion.span
                  className="px-2 py-0.5 bg-yellow-400 text-black rounded-full text-sm font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {favoritesCount}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="col-span-1 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.02, borderColor: 'rgba(251, 191, 36, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUpDown className="w-5 h-5" />
              <span>{currentSortLabel}</span>
            </motion.button>

            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="col-span-1 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.02, borderColor: 'rgba(251, 191, 36, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {selectedGenres.length > 0 && (
                <span className="px-2 py-0.5 bg-yellow-400 text-black rounded-full text-sm font-bold">
                  {selectedGenres.length}
                </span>
              )}
            </motion.button>

            {/* Mobile Sort Menu */}
            <motion.div
              initial={false}
              animate={{
                opacity: showSortMenu ? 1 : 0,
                height: showSortMenu ? 'auto' : 0,
                marginTop: showSortMenu ? 8 : 0,
                pointerEvents: showSortMenu ? 'auto' : 'none'
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-2xl border border-white/20 bg-gray-900/95"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left transition-all duration-200 ${
                    sortBy === option.value
                      ? 'bg-yellow-400 text-black font-bold'
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Genre Filters */}
        <motion.div
          initial={false}
          animate={{ 
            height: showFilters ? 'auto' : 0,
            opacity: showFilters ? 1 : 0,
            marginTop: showFilters ? 16 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-3">
            {availableGenres.map((genre, index) => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <motion.button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-5 py-2 rounded-full border transition-all duration-300 ${
                    isSelected
                      ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                      : 'bg-white/5 text-white border-white/20 hover:border-yellow-400/50'
                  }`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {genre}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-25"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.5) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.5) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.5) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, rgba(124, 58, 237, 0.5) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.5) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.header>
  );
}
