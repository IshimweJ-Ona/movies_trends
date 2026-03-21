import { motion } from 'motion/react';

export function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-800/50 via-gray-700/50 to-gray-900/50 rounded-2xl overflow-hidden border border-white/10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Poster skeleton */}
      <div className="relative aspect-[2/3] bg-gray-800/80 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.1
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-5">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-700/50 rounded-lg mb-3 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.1 + 0.2
            }}
          />
        </div>

        {/* Genres skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-8 w-20 bg-gray-700/50 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.1 + 0.3
              }}
            />
          </div>
          <div className="h-8 w-24 bg-gray-700/50 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.1 + 0.4
              }}
            />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="flex gap-3">
          <div className="flex-1 h-11 bg-gray-700/50 rounded-lg overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.1 + 0.5
              }}
            />
          </div>
          <div className="h-11 w-20 bg-gray-700/50 rounded-lg overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.1 + 0.6
              }}
            />
          </div>
        </div>
      </div>

      {/* Pulse animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.1
        }}
      />
    </motion.div>
  );
}
