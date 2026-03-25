import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft, Info, ShoppingCart, X, Loader2 } from "lucide-react";
import GameCard from "../components/gamecard";
import Button from "../components/button";
import { LightPillar } from "../components/background.jsx";
import { useWishlist } from "../components/wishlistLogic";
import GameDetailModal from "../components/GameCardDetails.jsx";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeGame, clearWishlist, isInWishlist, toggleGame } = useWishlist();
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [similarGames, setSimilarGames] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);

  const fetchSimilarGames = async (gameId) => {
    setLoadingSimilar(true);
    setShowSimilar(true);
    try {
      const response = await fetch(`http://localhost:5000/api/games/${gameId}/similar`);
      const data = await response.json();
      setSimilarGames(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching similar games:', error);
      setSimilarGames([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div 
        className="min-h-screen text-white overflow-hidden relative"
        style={{
          backgroundImage: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <LightPillar/>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-200 hover:text-white mb-12 transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>

          <div className="text-center py-20">
            <h1 className="text-5xl font-bold mb-4">Your Wishlist</h1>
            <p className="text-lg text-purple-200 mb-8">
              No games added yet. Start exploring to build your wishlist!
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/quiz")}
            >
              Discover Games
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white overflow-hidden relative"
      style={{
        backgroundImage: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <LightPillar/>

      <section className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-purple-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
            <h1 className="text-5xl font-bold">My Wishlist</h1>
            <p className="text-purple-200 mt-2">
              {wishlist.length} game{wishlist.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={clearWishlist}
            className="transition-all hover:scale-105"
          >
            Clear All
          </Button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((game) => (
            <div key={game.id} className="relative group">
              {/* Clickable card */}
              <div
                className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                onClick={() => setSelectedGameId(game.id)}
                title="Click to view details"
              >
                <GameCard game={game} />
              </div>
              
              {/* Remove Button - Overlay on hover */}
              <button
                onClick={(e) => { e.stopPropagation(); removeGame(game.id); }}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={20} />
              </button>

              {/* View Details button */}
              <button
                onClick={() => setSelectedGameId(game.id)}
                className="absolute top-4 left-4 flex items-center gap-1.5 bg-purple-700/80 hover:bg-purple-600 px-3 py-1.5 rounded-full text-xs text-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
              >
                <Info size={13} />
                Details
              </button>

              {/* Buy Now button */}
              <a
                href={`https://www.google.com/search?q=buy+${encodeURIComponent(game.name)}+video+game`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-green-600 hover:bg-green-500 px-4 py-1.5 rounded-full text-xs text-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
              >
                <ShoppingCart size={13} />
                Buy Now
              </a>

              {/* Games Like button */}
              <button
                onClick={(e) => { e.stopPropagation(); fetchSimilarGames(game.id); }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-full text-xs text-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
              >
                Games Like This
              </button>

              {/* Added date */}
              <div className="mt-2 text-sm text-purple-300">
                Added {new Date(game.addedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center gap-4 mt-16">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/quiz")}
            className="transition-all hover:scale-105"
          >
            Find More Games
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/")}
            className="transition-all hover:scale-105"
          >
            Back to Home
          </Button>
        </div>
      </section>

      {/* Game Detail Modal */}
      {selectedGameId && (
        <GameDetailModal
          gameId={selectedGameId}
          onClose={() => setSelectedGameId(null)}
          isSaved={isInWishlist(selectedGameId)}
          onToggleSave={() => {
            const game = wishlist.find(g => g.id === selectedGameId);
            if (game) toggleGame(game);
          }}
        />
      )}

      {/* Similar Games Modal */}
      {showSimilar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSimilar(false); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-purple-700/40 shadow-2xl shadow-purple-900/60"
            style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #2e1065 40%, #1a1a2e 100%)" }}
          >
            <button
              onClick={() => setShowSimilar(false)}
              className="absolute top-4 right-4 z-20 bg-purple-800/60 hover:bg-purple-700 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Games Like This</h2>
              
              {loadingSimilar ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin" size={32} />
                </div>
              ) : similarGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarGames.map((game) => (
                    <div 
                      key={game.id} 
                      className="cursor-pointer hover:scale-[1.02] transition-transform"
                      onClick={() => {
                        setShowSimilar(false);
                        setSelectedGameId(game.id);
                      }}
                    >
                      <GameCard game={{ 
                        id: game.id, 
                        name: game.name, 
                        rating: game.rating, 
                        image: game.background_image 
                      }} />
                      <p className="mt-2 text-sm font-medium text-center">{game.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-purple-300 py-8">No similar games found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
