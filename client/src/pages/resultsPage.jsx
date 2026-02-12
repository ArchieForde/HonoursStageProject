import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import GameCard from "../components/gamecard";

export default function Results() {
  const { state } = useLocation()

  {/* dummy data to test results page while backend is under development*/}
  const games = state?.games || [
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
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextGame = () => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  const prevGame = () => {
    setCurrentIndex((prev) => prev === 0 ? games.length - 1 : prev -1);
  };

{/* Main layout styles with a basic carousel to browse the games, buttons simple.*/}
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white">

      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            Your Perfect Matches 🎮
          </h1>
          <p className="text-purple-200">
            Based on your preferences, here are some games you might love
          </p>
        </div>

        <div className="relative flex items-center justify-center">

          
          <button
            onClick={prevGame}
            className="absolute left-0 bg-purple-700/40 hover:bg-purple-600/60 p-3 rounded-full transition"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="w-full max-w-xl animate-fadeIn">
            <GameCard game={games[currentIndex]} />
          </div>

          <button
            onClick={nextGame}
            className="absolute right-0 bg-purple-700/40 hover:bg-purple-600/60 p-3 rounded-full transition"
          >
            <ChevronRight size={24} />
          </button>

          </div>

          </section>

        </div>
  );
}
