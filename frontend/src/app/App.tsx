import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Header, SortOption } from './components/Header';
import { MovieCard } from './components/MovieCard';
import { Pagination } from './components/Pagination';
import { MovieDetailModal } from './components/MovieDetailModal';
import { TrailerModal } from './components/TrailerModal';
import { SkeletonCard } from './components/SkeletonCard';
import { Toast } from './components/Toast';
import { fetchGenres, fetchMovies } from './api/moviesApi';
import { Genre, Movie } from './data/types';
import { useFavorites } from './hooks/useFavorites';

const MOVIES_PER_PAGE = 20;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showingFavorites, setShowingFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [trailerMovieId, setTrailerMovieId] = useState<number | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [toastState, setToastState] = useState<{
    isVisible: boolean;
    message: string;
    type: 'favorite' | 'unfavorite';
  }>({
    isVisible: false,
    message: '',
    type: 'favorite',
  });

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const genreNameToId = useMemo(() => {
    const map: Record<string, number> = {};
    genres.forEach((genre) => {
      map[genre.name] = genre.id;
    });
    return map;
  }, [genres]);

  const selectedGenreIds = useMemo(() => {
    return selectedGenres
      .map((name) => genreNameToId[name])
      .filter((id): id is number => Number.isFinite(id));
  }, [selectedGenres, genreNameToId]);

  const serverSort: 'popular' | 'newest' | 'rating' = useMemo(() => {
    if (sortBy === 'rating-high') return 'rating';
    if (sortBy === 'year-new') return 'newest';
    return 'popular';
  }, [sortBy]);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);

    fetchGenres(controller.signal)
      .then((data) => {
        setGenres(data);
        const map: Record<number, string> = {};
        data.forEach((genre) => {
          map[genre.id] = genre.name;
        });
        setGenreMap(map);
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          setError('Failed to load genres.');
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchMovies(
      {
        q: searchQuery || undefined,
        genre: selectedGenreIds.length > 0 ? selectedGenreIds.join(',') : undefined,
        sort: serverSort,
        page: currentPage,
      },
      genreMap,
      controller.signal
    )
      .then((data) => {
        setMovies(data.movies);
        setTotalPages(data.totalPages);
        setTotalResults(data.totalResults);
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          setError('Failed to load movies.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [searchQuery, selectedGenreIds, serverSort, currentPage, genreMap]);

  // Filter and sort movies (client-side for options not supported by backend)
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = movies;

    // Filter by favorites
    if (showingFavorites) {
      filtered = filtered.filter(movie => favorites.includes(movie.id));
    }

    // Sort movies
    const sorted = [...filtered];
    switch (sortBy) {
      case 'rating-low':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case 'year-old':
        sorted.sort((a, b) => a.year - b.year);
        break;
      case 'title-az':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-za':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return sorted;
  }, [movies, sortBy, showingFavorites, favorites]);

  const effectiveTotalPages = showingFavorites ? 1 : Math.max(totalPages, 1);
  const currentMovies = filteredAndSortedMovies;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleGenreFilter = (genres: string[]) => {
    setSelectedGenres(genres);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleShowFavorites = () => {
    setShowingFavorites(!showingFavorites);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (movieId: number) => {
    const wasFavorite = isFavorite(movieId);
    toggleFavorite(movieId);
    
    const movie = movies.find(m => m.id === movieId);
    setToastState({
      isVisible: true,
      message: wasFavorite 
        ? `Removed "${movie?.title}" from favorites`
        : `Added "${movie?.title}" to favorites`,
      type: wasFavorite ? 'unfavorite' : 'favorite',
    });
  };

  const handleOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handlePlayTrailer = (movie: Movie) => {
    setTrailerMovieId(movie.id);
    setShowTrailerModal(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMovie(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Gradient orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '60%', right: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ bottom: '10%', left: '50%' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-0">
        <Header
          onSearch={handleSearch}
          onGenreFilter={handleGenreFilter}
          selectedGenres={selectedGenres}
          availableGenres={genres.map((genre) => genre.name)}
          onSortChange={handleSortChange}
          sortBy={sortBy}
          onShowFavorites={handleShowFavorites}
          showingFavorites={showingFavorites}
          favoritesCount={favorites.length}
        />

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[104px] py-8 sm:py-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Results Info */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              {showingFavorites ? (
                <>
                  My Favorites <span className="text-yellow-400">({filteredAndSortedMovies.length})</span>
                </>
              ) : searchQuery || selectedGenres.length > 0 ? (
                <>
                  Found <span className="text-yellow-400">{totalResults || filteredAndSortedMovies.length}</span> movies
                </>
              ) : (
                <>
                  Discover <span className="text-yellow-400">{totalResults || filteredAndSortedMovies.length}</span> Amazing Movies
                </>
              )}
            </h2>
            {effectiveTotalPages > 0 && (
              <p className="text-gray-400">
                Page {currentPage} of {effectiveTotalPages}
              </p>
            )}
          </motion.div>

          {error && (
            <div className="mb-6 text-center text-red-300">
              {error}
            </div>
          )}

          {/* Movie Grid */}
          {isLoading ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5"
              layout
            >
              {[...Array(MOVIES_PER_PAGE)].map((_, index) => (
                <SkeletonCard key={index} index={index} />
              ))}
            </motion.div>
          ) : currentMovies.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 auto-rows-max"
              layout
            >
              {currentMovies.map((movie, index) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  index={index}
                  isFavorite={isFavorite(movie.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenModal={handleOpenModal}
                  onPlayTrailer={handlePlayTrailer}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-2xl text-gray-400 mb-4">
                {showingFavorites ? 'No favorites yet' : 'No movies found'}
              </p>
              <p className="text-gray-500">
                {showingFavorites 
                  ? 'Start adding movies to your favorites by clicking the heart icon'
                  : 'Try adjusting your filters or search query'}
              </p>
            </motion.div>
          )}

          {/* Pagination */}
          {effectiveTotalPages > 1 && !isLoading && !showingFavorites && (
            <Pagination
              currentPage={currentPage}
              totalPages={effectiveTotalPages}
              onPageChange={handlePageChange}
            />
          )}
          </div>
        </main>

        {/* Footer */}
        <motion.footer
          className="mt-16 sm:mt-20 py-8 border-t border-white/10 text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Developer JO</p>
          <p className="text-sm mt-2">Your ultimate movie discovery platform</p>
        </motion.footer>
      </div>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavorite={selectedMovie ? isFavorite(selectedMovie.id) : false}
        onToggleFavorite={() => selectedMovie && handleToggleFavorite(selectedMovie.id)}
      />

      {/* Trailer Modal */}
      {trailerMovieId && (
        <TrailerModal
          isOpen={showTrailerModal}
          movieId={trailerMovieId}
          movieTitle={selectedMovie?.title || 'Trailer'}
          onClose={() => setShowTrailerModal(false)}
        />
      )}

      {/* Toast Notifications */}
      <Toast
        message={toastState.message}
        type={toastState.type}
        isVisible={toastState.isVisible}
        onClose={() => setToastState(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}

