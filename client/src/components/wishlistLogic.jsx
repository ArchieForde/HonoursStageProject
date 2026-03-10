import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Logic for managing user's game wishlist.
 * When logged in, syncs with the backend. Falls back to localStorage otherwise.
 */
export function useWishlist() {
  const { user, saveWishlist } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize: prefer user's server wishlist, else localStorage
  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist);
    } else {
      const saved = localStorage.getItem('gameWishlist');
      if (saved) {
        try { setWishlist(JSON.parse(saved)); } catch { setWishlist([]); }
      }
    }
    setIsLoading(false);
  }, [user]);

  // Persist changes
  const persist = useCallback(
    (newList) => {
      localStorage.setItem('gameWishlist', JSON.stringify(newList));
      if (saveWishlist) saveWishlist(newList);
    },
    [saveWishlist]
  );

  const addGame = (game) => {
    setWishlist((prev) => {
      if (prev.some((g) => g.id === game.id)) return prev;
      const next = [...prev, { ...game, addedAt: new Date().toISOString() }];
      persist(next);
      return next;
    });
  };

  const removeGame = (gameId) => {
    setWishlist((prev) => {
      const next = prev.filter((g) => g.id !== gameId);
      persist(next);
      return next;
    });
  };

  const isInWishlist = (gameId) => wishlist.some((g) => g.id === gameId);

  const toggleGame = (game) => {
    if (isInWishlist(game.id)) removeGame(game.id);
    else addGame(game);
  };

  const clearWishlist = () => {
    setWishlist([]);
    persist([]);
  };

  const getWishlistCount = () => wishlist.length;

  return {
    wishlist,
    addGame,
    removeGame,
    isInWishlist,
    toggleGame,
    clearWishlist,
    getWishlistCount,
    isLoading,
  };
}
