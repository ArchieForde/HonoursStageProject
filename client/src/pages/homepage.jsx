import { ArrowRight, HelpCircle, Zap, Gift } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LightPillar } from "../components/background.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  {/* Style variables */}
  const cardStyles = "bg-purple-800/40 backdrop-blur-sm p-8 rounded-xl border border-purple-700/40 cursor-pointer transition-all duration-300 hover:border-purple-500/80 hover:bg-purple-800/60 hover:shadow-lg hover:shadow-purple-500/20 transform hover:scale-105 hover:-translate-y-1";
  const iconContainerBase = "flex justify-center mb-4 transition-transform duration-300 origin-center";
  const hoverTextStyles = "mt-4 text-sm text-purple-300 animate-fadeIn";
  
  {/* Main text, Left side */}
  return (
    <>
      <LightPillar/>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white">

      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

        <div className="-translate-x-35">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-700/40 text-sm">
            AI-Powered Game Recommendations
          </span>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Find Your <span className="text-purple-400">Perfect</span> Game
          </h1>

          <p className="text-lg text-purple-200 mb-8">
            Stop scrolling through pointless game lists.  
            Answer this questionaire and discover games tailored to your taste using live RAWG data.
          </p>

          {/*Main page buttons for CTA */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/quiz")}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 transition px-6 py-3 rounded-lg font-semibold"
            >
              Start Quiz Now
              <ArrowRight size={18} />
            </button>


            <button className="px-6 py-3 rounded-lg border border-purple-400/40 hover:bg-purple-400/10 transition">
              Learn More
            </button>
          </div>
        </div>

        {/*Photo of Controller added to the right side */}
        <div className="relative translate-x-70">
          <div className="absolute -inset-2 rounded-2xl bg-purple-500/30 blur-2xl"></div>
          <img
            src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Game controller"
            className="relative rounded-2xl shadow-2xl"
          />
        </div>

      </section>

      {/* Explanation cards explaining the website, added interactivity to them */}
      <section className="max-w-6xl mx-auto px-6 py-2">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div 
            className={cardStyles}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`${iconContainerBase} ${hoveredCard === 0 ? 'scale-110 rotate-12' : ''}`}>
              <HelpCircle size={40} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Answer Questions</h3>
            <p className="text-purple-200">
              Tell us what genres, play styles, and experiences you enjoy.
            </p>
            {hoveredCard === 0 && (
              <div className={hoverTextStyles}>
                ✨ Takes just 2 minutes
              </div>
            )}
          </div>

          <div 
            className={cardStyles}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`${iconContainerBase} ${hoveredCard === 1 ? 'scale-110 -rotate-12' : ''}`}>
              <Zap size={40} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Smart Analysis</h3>
            <p className="text-purple-200">
              Your answers are analysed using real game data from the RAWG API.
            </p>
            {hoveredCard === 1 && (
              <div className={hoverTextStyles}>
                ⚡ Powered by AI
              </div>
            )}
          </div>

          <div 
            className={cardStyles}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`${iconContainerBase} ${hoveredCard === 2 ? 'scale-110 rotate-12' : ''}`}>
              <Gift size={40} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Get Recommendations</h3>
            <p className="text-purple-200">
              Receive personalised game suggestions and save them to your wishlist.
            </p>
            {hoveredCard === 2 && (
              <div className={hoverTextStyles}>
                🎮 Curated for you
              </div>
            )}
          </div>

        </div>
      </section>
      </div>
    </>
  )
}
