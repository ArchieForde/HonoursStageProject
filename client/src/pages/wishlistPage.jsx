import { useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft } from "lucide-react";
import GameCard from "../components/gamecard";
import Button from "../components/button";
import { LightPillar } from "../components/background.jsx";
import { useWishlist } from "../hooks/useWishlist";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeGame, clearWishlist } = useWishlist();

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
              <GameCard game={game} />
              
              {/* Remove Button - Overlay on hover */}
              <button
                onClick={() => removeGame(game.id)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={20} />
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
    </div>
  );
}
