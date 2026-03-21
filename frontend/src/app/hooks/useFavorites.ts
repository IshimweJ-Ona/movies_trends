import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'cineverse_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movieId: number) => {
    setFavorites(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId);
      }
      return [...prev, movieId];
    });
  };

  const isFavorite = (movieId: number) => {
    return favorites.includes(movieId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
