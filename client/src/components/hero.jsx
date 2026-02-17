import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./button";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
      <div className="-translate-x-35">
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-700/40 text-sm">
          AI-Powered Game Recommendations
        </span>

        <h1 className="text-5xl font-bold leading-tight mb-6">
          Find Your <span className="text-purple-400">Perfect</span> Game
        </h1>

        <p className="text-lg text-purple-200 mb-8">
          Stop scrolling through pointless game lists. Answer this questionnaire and discover games tailored to your taste using live RAWG data.
        </p>

        <div className="flex gap-4">
          <Button variant="primary" icon={ArrowRight} onClick={() => navigate("/quiz")}>
            Start Quiz Now
          </Button>
          <Button variant="secondary">
            Learn More
          </Button>
        </div>
      </div>

      <div className="relative translate-x-70">
        <div className="absolute -inset-2 rounded-2xl bg-purple-500/30 blur-2xl"></div>
        <img
          src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Game controller"
          className="relative rounded-2xl shadow-2xl"
        />
      </div>
    </section>
  );
}
