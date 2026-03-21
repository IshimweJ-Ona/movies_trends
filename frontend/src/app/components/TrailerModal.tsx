import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchMovieVideos } from '../api/moviesApi';

interface TrailerModalProps {
  isOpen: boolean;
  movieId: number;
  movieTitle: string;
  onClose: () => void;
}

export function TrailerModal({ isOpen, movieId, movieTitle, onClose }: TrailerModalProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setVideoKey(null);
      setError(null);
      return;
    }

    const loadTrailer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const video = await fetchMovieVideos(movieId);
        if (video && video.key) {
          setVideoKey(video.key);
          setVideoName(video.name ?? 'Trailer');
        } else {
          setError('No trailer available for this movie');
        }
      } catch (err: any) {
        setError(err?.message ? String(err.message) : 'Failed to load trailer');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrailer();
  }, [isOpen, movieId]);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const dialogEl = dialogRef.current;
    dialogEl?.focus();
  }, [isOpen]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Trailer Card */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              onKeyDown={onKeyDown}
              className="relative w-full max-w-4xl pointer-events-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
              initial={{ scale: 0.5, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <motion.h3
                  className="text-2xl sm:text-3xl font-bold text-yellow-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {movieTitle}
                </motion.h3>
                <motion.button
                  onClick={onClose}
                  aria-label="Close trailer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Trailer Content */}
              <motion.div
                className="relative aspect-video bg-black/50 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-12 h-12 border-4 border-white/20 border-t-yellow-400 rounded-full" />
                    </motion.div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <motion.p
                      className="text-xl text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {error}
                    </motion.p>
                  </div>
                ) : videoKey ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
                    title={`Trailer - ${movieTitle}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : null}
              </motion.div>

              {/* Footer Info */}
              {videoKey && (
                <motion.div
                  className="p-6 bg-black/50 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-gray-300 text-sm mb-2">Top result used: <span className="font-semibold text-white">{videoName}</span></p>
                  <p className="text-gray-300 text-sm">
                    Click outside or press the X button to close the trailer
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="p-6 bg-black/50 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-gray-300 text-sm mb-2">Try searching on YouTube instead:</p>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + ' official trailer')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 underline"
                  >
                    Open YouTube search for {movieTitle} trailer
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
