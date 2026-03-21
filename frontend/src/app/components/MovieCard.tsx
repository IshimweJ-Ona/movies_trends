import { motion, useMotionValue, useTransform } from 'motion/react';
import { Play, Star, Heart } from 'lucide-react';
import { Movie } from '../data/types';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (movieId: number) => void;
  onOpenModal: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
}

export function MovieCard({ movie, index, isFavorite, onToggleFavorite, onOpenModal, onPlayTrailer }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(movie.id);
  };

  return (
    <motion.div
      className="relative group h-full min-h-[430px] md:min-h-[400px]"
      initial={{ opacity: 0.4, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.05, z: 50 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenModal(movie)}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-slate-900/38 via-slate-800/38 to-black/38 rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border-2 border-white/20 cursor-pointer h-full transition-all duration-300 hover:border-yellow-400/70 hover:shadow-[0_20px_50px_rgba(249,115,22,0.45)] hover:scale-[1.01]"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Favorite Button */}
        <motion.button
          onClick={handleFavoriteClick}
          className={`absolute top-4 left-4 z-10 p-2.5 backdrop-blur-sm rounded-full border transition-all ${
            isFavorite
              ? 'bg-red-500 border-red-500'
              : 'bg-black/80 border-white/20 hover:bg-white/20'
          }`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </motion.button>

        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <motion.img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover brightness-110"
            initial={{ scale: 1.2 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/08 via-black/12 to-transparent"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: isHovered ? 0.3 : 0.2 }}
            transition={{ duration: 0.3 }}
          />

          {/* Year Badge */}
          <motion.div
            className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-white/20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          >
            <span className="text-xs font-bold text-yellow-400">{movie.year}</span>
          </motion.div>

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-20 h-20 bg-yellow-400/90 backdrop-blur-sm rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
            >
              <Play className="w-8 h-8 text-black fill-black ml-1" />
            </motion.div>
          </motion.div>
        </div>

        {/* Movie Info */}
        <div className="p-5">
          {/* Title */}
          <motion.h3 
            className="text-xl font-bold mb-3 line-clamp-1 text-white drop-shadow-lg"
            animate={{ 
              color: isHovered ? '#FBBF24' : '#FFFFFF'
            }}
            transition={{ duration: 0.3 }}
          >
            {movie.title}
          </motion.h3>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.slice(0, 2).map((genre, idx) => (
              <motion.span
                key={genre}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + idx * 0.1 }}
                whileHover={{ 
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  borderColor: 'rgba(251, 191, 36, 0.5)',
                  scale: 1.05
                }}
              >
                {genre}
              </motion.span>
            ))}
          </div>

          {/* Trailer Button and Rating */}
          <div className="flex items-center justify-between gap-3">
            {/* Trailer Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onPlayTrailer(movie);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg font-bold shadow-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)',
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Play className="w-4 h-4 fill-black" />
              <span className="text-sm">Trailer</span>
            </motion.button>

            {/* Rating */}
            <motion.div 
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(251, 191, 36, 0.2)',
                borderColor: 'rgba(251, 191, 36, 0.5)'
              }}
            >
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm">{movie.rating.toFixed(1)}</span>
            </motion.div>
          </div>
        </div>

        {/* Glowing border effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            boxShadow: isHovered 
              ? '0 0 40px rgba(251, 191, 36, 0.6), inset 0 0 40px rgba(251, 191, 36, 0.1)' 
              : '0 0 0px rgba(251, 191, 36, 0)'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Reflection effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl pointer-events-none"
          style={{
            transform: "translateZ(30px)",
            opacity: isHovered ? 0.3 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Favorite indicator glow */}
        {isFavorite && (
          <motion.div
            className="absolute inset-0 bg-red-500/10 rounded-2xl pointer-events-none"
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
