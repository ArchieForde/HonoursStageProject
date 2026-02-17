import { useState, useEffect } from 'react';

/**
 * logic for managing user's game wishlist
 * Currently uses localStorage, but can be easily swapped for when using the API 
 */
export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  {/* Initialize from localStorage */} 
  useEffect(() => {
    const savedWishlist = localStorage.getItem('gameWishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        setWishlist([]);
      }
    }
    setIsLoading(false);
  }, []);

  {/* Persist to localStorage whenever wishlist changes */}
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('gameWishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoading]);

  /**
   * Add a game to wishlist
   * @param {Object} game - Game object with id, name, image, rating
   */
  const addGame = (game) => {
    setWishlist(prev => {
      const exists = prev.some(g => g.id === game.id);
      if (exists) return prev;
      
      return [...prev, {
        ...game,
        addedAt: new Date().toISOString()
      }];
    });
  };

  /**
   * Remove a game from wishlist
   * @param {number} gameId - ID of the game to remove
   */
  const removeGame = (gameId) => {
    setWishlist(prev => prev.filter(g => g.id !== gameId));
  };

  /**
   * Check if a game is in the wishlist
   * @param {number} gameId - ID of the game to check
   * @returns {boolean}
   */
  const isInWishlist = (gameId) => {
    return wishlist.some(g => g.id === gameId);
  };

  /**
   * Toggle a game in/out of wishlist
   * @param {Object} game - Game object
   */
  const toggleGame = (game) => {
    if (isInWishlist(game.id)) {
      removeGame(game.id);
    } else {
      addGame(game);
    }
  };

  /**
   * Clear entire wishlist
   */
  const clearWishlist = () => {
    setWishlist([]);
  };

  /**
   * Get wishlist count
   */
  const getWishlistCount = () => {
    return wishlist.length;
  };

  return {
    wishlist,
    addGame,
    removeGame,
    isInWishlist,
    toggleGame,
    clearWishlist,
    getWishlistCount,
    isLoading
  };
}
