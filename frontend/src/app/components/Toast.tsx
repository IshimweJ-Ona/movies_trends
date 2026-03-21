import { motion, AnimatePresence } from 'motion/react';
import { Check, Heart, HeartOff } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'favorite' | 'unfavorite';
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-24 right-6 z-[100] flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-900 to-black backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
          initial={{ opacity: 0, y: -50, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, x: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {/* Icon */}
          <motion.div
            className={`p-2 rounded-full ${
              type === 'favorite' ? 'bg-red-500' : 'bg-gray-700'
            }`}
            animate={{
              scale: [1, 1.2, 1],
              rotate: type === 'favorite' ? [0, -10, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            {type === 'favorite' ? (
              <Heart className="w-5 h-5 fill-white text-white" />
            ) : (
              <HeartOff className="w-5 h-5 text-white" />
            )}
          </motion.div>

          {/* Message */}
          <p className="font-semibold text-white">{message}</p>

          {/* Check Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Check className="w-5 h-5 text-green-400" />
          </motion.div>

          {/* Confetti particles for favorites */}
          {type === 'favorite' && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400 to-red-500"
                  initial={{ 
                    x: 0, 
                    y: 0,
                    scale: 0,
                  }}
                  animate={{ 
                    x: Math.cos(i * 30 * Math.PI / 180) * 100,
                    y: Math.sin(i * 30 * Math.PI / 180) * 100,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ 
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: type === 'favorite'
                ? [
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                    '0 0 40px rgba(239, 68, 68, 0.6)',
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                  ]
                : [
                    '0 0 20px rgba(156, 163, 175, 0.3)',
                    '0 0 40px rgba(156, 163, 175, 0.6)',
                    '0 0 20px rgba(156, 163, 175, 0.3)',
                  ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
