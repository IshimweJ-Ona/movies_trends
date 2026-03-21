import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Star, Heart, Calendar, Clock } from 'lucide-react';
import { Movie } from '../data/types';
import { TrailerModal } from './TrailerModal';

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function MovieDetailModal({ movie, isOpen, onClose, isFavorite, onToggleFavorite }: MovieDetailModalProps) {
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!movie) return;
    setShowTrailer(false);
  }, [movie]);

  if (!movie) return null;

  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border border-white/20 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 100, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100, rotateX: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-3 bg-black/80 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Favorite Button */}
              <motion.button
                onClick={onToggleFavorite}
                className={`absolute top-4 left-4 sm:top-6 sm:left-6 z-10 p-3 backdrop-blur-sm rounded-full border transition-all ${
                  isFavorite
                    ? 'bg-red-500 border-red-500'
                    : 'bg-black/80 border-white/20 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isFavorite ? {
                  scale: [1, 1.2, 1],
                } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-white' : ''}`} />
              </motion.button>

              {/* Hero Section with Backdrop */}
              <div className="relative h-72 sm:h-96 overflow-hidden">
                <motion.img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
                
                {/* Play Trailer Button */}
                <motion.button
                  onClick={() => setShowTrailer(true)}
                  className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-yellow-400 text-black rounded-full font-bold shadow-xl"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: '0 0 30px rgba(251, 191, 36, 0.8)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Play className="w-6 h-6 fill-black" />
                  <span className="text-base sm:text-lg">Watch Trailer</span>
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-8">
                {/* Title and Year */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {movie.title}
                  </h2>
                </motion.div>

                {/* Meta Info */}
                <motion.div
                  className="flex flex-wrap items-center gap-6 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Rating */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400/20 backdrop-blur-sm rounded-full border border-yellow-400/50">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{movie.rating.toFixed(1)}</span>
                  </div>

                  {/* Year */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <Calendar className="w-5 h-5" />
                    <span>{movie.year}</span>
                  </div>

                  {/* Duration (mock) */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <Clock className="w-5 h-5" />
                    <span>2h 15m</span>
                  </div>
                </motion.div>

                {/* Genres */}
                <motion.div
                  className="flex flex-wrap gap-3 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {movie.genres.map((genre, index) => (
                    <motion.span
                      key={genre}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-full border border-white/20 font-semibold"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.1, borderColor: 'rgba(251, 191, 36, 0.5)' }}
                    >
                      {genre}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Synopsis */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-yellow-400">Synopsis</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {movie.overview && movie.overview.trim().length > 0
                      ? movie.overview
                      : 'No synopsis available for this title yet.'}
                  </p>
                </motion.div>

                {/* Cast & Crew */}
                <motion.div
                  className="grid md:grid-cols-2 gap-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-yellow-400">Director</h3>
                    <p className="text-gray-300">Sarah Chen</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-yellow-400">Cast</h3>
                    <p className="text-gray-300">James Mitchell, Emma Stone, Michael Torres, Lisa Wang</p>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.button
                    onClick={() => setShowTrailer(true)}
                    className="flex-1 min-w-[200px] px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5 fill-black" />
                    Watch Trailer
                  </motion.button>
                </motion.div>

              </div>

              {/* Glowing border effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{
                  boxShadow: [
                    '0 0 60px rgba(251, 191, 36, 0.3)',
                    '0 0 80px rgba(251, 191, 36, 0.5)',
                    '0 0 60px rgba(251, 191, 36, 0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </>
      )}
      </AnimatePresence>

      {/* Trailer Modal */}
      {movie && (
        <TrailerModal
          isOpen={showTrailer}
          movieId={movie.id}
          movieTitle={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  );
}
