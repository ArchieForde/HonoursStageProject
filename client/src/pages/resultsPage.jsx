import { ChevronLeft, ChevronRight, BookmarkPlus, Share2, Star, Info } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import GameCard from "../components/gamecard";
import Button from "../components/button";
import { LightPillar } from "../components/background.jsx";
import { useWishlist } from "../components/wishlistLogic";
import GameDetailModal from "../components/GameCardDetails.jsx";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [showAllGames, setShowAllGames] = useState(false);
  const { isInWishlist, toggleGame } = useWishlist();

  // Fetch the games from RAWG using ML recommendations
  useEffect(() => {
    const fetchGames = async () => {
      // Check if user just completed the questionnaire (has new answers)
      const userAnswers = state?.userAnswers || {};
      const hasNewAnswers = Object.keys(userAnswers).length > 0;
      
      // If no new answers, try to load from localStorage first
      if (!hasNewAnswers) {
        const savedGames = localStorage.getItem('savedRecommendations');
        if (savedGames) {
          try {
            const parsedGames = JSON.parse(savedGames);
            if (parsedGames && parsedGames.length > 0) {
              setGames(parsedGames);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Error loading saved games:', e);
          }
        }
      } else {
        // Clear previous saved games when taking new quiz
        localStorage.removeItem('savedRecommendations');
      }
      
      // If we reach here, we need to fetch new games
      try {
        
        // If we have user answers, use ML recommendation endpoint
        if (Object.keys(userAnswers).length > 0) {
          const response = await fetch('http://localhost:5000/api/games/recommend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              answers: userAnswers,
              limit: 5
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to get recommendations');
          }
          
          const data = await response.json();
          
          if (data.success && data.recommendations) {
            // Transform the ML recommendations to match game card format
            const transformedGames = data.recommendations.map(game => ({
              id: game.id,
              name: game.name,
              rating: game.rating || 0,
              image: game.background_image || 'https://via.placeholder.com/400x300?text=No+Image',
              match_percentage: game.match_percentage || 0,  // ML match score
              website: game.website || null,
              rawg_url: game.rawg_url || null,
              metacritic_url: game.metacritic_url || null,
              slug: game.slug || null,
              playtime: game.playtime || 0,
              movies: game.movies || [],
              short_screenshots: game.short_screenshots || []
            }));
            
            setGames(transformedGames);
            // Save to localStorage for persistence
            localStorage.setItem('savedRecommendations', JSON.stringify(transformedGames));
            console.log('ML Recommendations:', data.recommendations);
            return;
          }
        }
        
        // Fallback: Use old genre-based approach if no user answers
        const genre = state?.genre || 'action';
        const response = await fetch(`http://localhost:5000/api/games?genre=${genre}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        
        const data = await response.json();
        
        // Transform the RAWG data to match the game card 
        const transformedGames = data.map(game => ({
          id: game.id,
          name: game.name,
          rating: game.rating || 0,
          image: game.background_image || 'https://via.placeholder.com/400x300?text=No+Image',
          website: game.website || null,
          rawg_url: game.rawg_url || null,
          metacritic_url: game.metacritic_url || null,
          slug: game.slug || null,
          playtime: game.playtime || 0,
          movies: game.movies || [],
          short_screenshots: game.short_screenshots || []
        }));
        
        setGames(transformedGames);
        // Save to localStorage for persistence
        localStorage.setItem('savedRecommendations', JSON.stringify(transformedGames));
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(err.message);
        // Fallback to the dummy data for now on error
        setGames([
          {
            id: 1,
            name: "Cyberpunk 2077",
            rating: 4.2,
            image: "https://assets1.ignimgs.com/2019/08/27/cp77-kv-en-1566871767337.jpg"
          },
          {
            id:2,
            name: "Elden Ring",
            rating: 4.8,
            image: "https://wallpapersbq.com/images/elden-ring/elden-ring-wallpaper-4.webp"
          },
          {
            id: 3, 
            name: "God of War",
            rating: 4.7,
            image: "https://wallpaperaccess.com/full/357451.png"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [state?.genre, state?.userAnswers]);

  const nextGame = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  const prevGame = () => {
    setDirection('left');
    setCurrentIndex((prev) => prev === 0 ? games.length - 1 : prev - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextGame();
      if (e.key === 'ArrowLeft') prevGame();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Touch/Swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.clientX || e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.clientX || e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextGame();
    if (isRightSwipe) prevGame();
  };

  const currentGame = games[currentIndex];
  const isSaved = currentGame ? isInWishlist(currentGame.id) : false;

  if (loading) {
    return (
      <div 
        className="min-h-screen text-white overflow-hidden relative flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-purple-200">Finding your perfect games...</p>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div 
        className="min-h-screen text-white overflow-hidden relative flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-center">
          <p className="text-xl text-purple-200 mb-4">No games found</p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Take Quiz Again
          </Button>
        </div>
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
      <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <LightPillar/>

      <section className="max-w-6xl mx-auto px-6 py-20">

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Your Perfect Matches <span className="text-purple-400">🎮</span>
          </h1>
          <p className="text-lg text-purple-200">
            Based on your preferences, here are some games you might love
          </p>
        </div>

        {/* Carousel Section */}
        <div 
          className="relative select-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevGame}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-purple-600 hover:bg-purple-500 active:scale-95 p-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50 group"
            aria-label="Previous game"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Carousel Container with Side Previews */}
          <div className="flex items-center justify-center gap-4 lg:gap-8 transition-all duration-500">
            {/* Previous Card Preview */}
            <div className="hidden lg:block opacity-50 scale-75 origin-right transition-all duration-500 hover:opacity-70 hover:scale-80">
              <GameCard game={games[(currentIndex - 1 + games.length) % games.length]} />
            </div>

            {/* Main Card */}
            <div className="w-full max-w-2xl">
              <div
                className={`animate-fadeIn transition-all duration-500 cursor-pointer hover:scale-[1.02] ${
                  direction === 'right' ? 'slide-in-right' : 'slide-in-left'
                }`}
                onClick={() => setSelectedGameId(currentGame.id)}
                title="Click to view details"
              >
                <GameCard game={currentGame} />
              </div>

              {/* Game Info Below Card */}
              <div className="mt-8 bg-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-700/40 hover:border-purple-500/60 transition-all duration-300 hover:bg-purple-800/40">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 transition-colors duration-300">{currentGame.name}</h2>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`transition-all duration-300 ${
                              i < Math.floor(currentGame.rating) 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-purple-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-purple-200">{currentGame.rating.toFixed(1)}/5</span>
                    </div>
                  </div>
                  {/* ML Match Percentage Badge */}
                  {currentGame.match_percentage !== undefined && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-lg">
                      <span className="text-white font-bold">{currentGame.match_percentage}%</span>
                      <span className="text-green-100 text-xs ml-1">match</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant={isSaved ? "primary" : "secondary"}
                    size="md"
                    icon={BookmarkPlus}
                    onClick={() => toggleGame(currentGame)}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    {isSaved ? "Saved" : "Save Game"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    icon={Info}
                    onClick={() => setSelectedGameId(currentGame.id)}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    icon={Share2}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Next Card Preview */}
            <div className="hidden lg:block opacity-50 scale-75 origin-left transition-all duration-500 hover:opacity-70 hover:scale-80">
              <GameCard game={games[(currentIndex + 1) % games.length]} />
            </div>
          </div>

          <button
            onClick={nextGame}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-purple-600 hover:bg-purple-500 active:scale-95 p-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50 group"
            aria-label="Next game"
          >
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <div className="flex gap-2">
            {games.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 'right' : 'left');
                  setCurrentIndex(index);
                }}
                className={`rounded-full transition-all duration-300 hover:bg-purple-300 ${
                  index === currentIndex
                    ? "w-8 h-2 bg-purple-400 shadow-lg shadow-purple-400/50"
                    : "w-2 h-2 bg-purple-600"
                }`}
                aria-label={`Go to game ${index + 1}`}
              />
            ))}
          </div>
          <span className="text-sm text-purple-300 font-medium">
            {currentIndex + 1} of {games.length}
          </span>
        </div>

        {/* All Games Grid View */}
        {showAllGames && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">All Recommended Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, index) => (
                <div 
                  key={game.id} 
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setCurrentIndex(index);
                    setSelectedGameId(game.id);
                  }}
                >
                  <GameCard game={game} />
                  <div className="mt-2 text-center">
                    <p className="font-semibold">{game.name}</p>
                    {game.match_percentage !== undefined && (
                      <span className="text-green-400 text-sm">{game.match_percentage}% match</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-center gap-4 mt-16">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            Take Quiz Again
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/wishlist")}
            className="transition-all duration-300 hover:scale-105"
          >
            View My Wishlist
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowAllGames(!showAllGames)}
            className="transition-all duration-300 hover:scale-105"
          >
            {showAllGames ? 'Hide All Games' : `View All ${games.length} Games`}
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
            const game = games.find(g => g.id === selectedGameId);
            if (game) toggleGame(game);
          }}
        />
      )}
    </div>
  );
}
