import { HelpCircle, Zap, Gift } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LightPillar } from "../components/background.jsx";
import Hero from "../components/hero";
import Button from "../components/button";

export default function HomePage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  {/* Style variables */}
  const cardStyles = "bg-purple-800/40 backdrop-blur-sm p-8 rounded-xl border border-purple-700/40 cursor-pointer transition-all duration-300 hover:border-purple-500/80 hover:bg-purple-800/60 hover:shadow-lg hover:shadow-purple-500/20 transform hover:scale-103 hover:-translate-y-1 relative z-0 hover:z-10 overflow-hidden";
  const iconContainerBase = "flex justify-center mb-4 transition-transform duration-300 origin-center";
  const hoverTextStyles = "mt-4 text-sm text-purple-300 animate-fadeIn space-y-2";
  
  return (
    <>
      <LightPillar/>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white">

      <Hero />

      {/* Explanation cards explaining the website, added interactivity to them */}
      <section className="max-w-6xl mx-auto px-6 py-12 overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 items-start">

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
                <div>✨ Takes just 2 minutes</div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/quiz')} className="w-full">
                  Start Now
                </Button>
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
                <div>⚡ Powered by AI</div>
                <Button variant="ghost" size="sm" className="w-full">
                  Learn More
                </Button>
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
                <div>🎮 Curated for you</div>
                <Button variant="ghost" size="sm" className="w-full">
                  Explore
                </Button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Game?</h2>
        <p className="text-lg text-purple-200 mb-8">Join thousands of gamers discovering games tailored to their preferences.</p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={() => navigate('/quiz')}>
            Start Quiz Now
          </Button>
          <Button variant="secondary" size="lg">
            View Our Blog
          </Button>
        </div>
      </section>
      </div>
    </>
  )
}
