import { Gamepad2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  {/* if scrolled the navbar style adjusts*/}
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkStyles = (path) =>
    `relative px-4 py-2 text-sm transition-all duration-200 
    ${
      location.pathname === path
        ? "text-white"
        : "text-purple-200 hover:text-white"
    }
    hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]
    `;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
      backdrop-blur-md border-b
      ${
        scrolled
          ? "bg-purple-900/60 border-purple-500/30 shadow-lg shadow-purple-900/40"
          : "bg-purple-900/30 border-purple-700/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Simple Logo for now */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition"
        >
          <Gamepad2 size={22} className="text-purple-400" />
          <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            GameFinder
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2">

          <NavLink to="/" label="Home" location={location} />
          <NavLink to="/quiz" label="Quiz" location={location} />
          <NavLink to="/results" label="Results" location={location} />

        </div>
      </div>
    </nav>
  );
}

/* Separated the NavLink component for cleaner animations */
function NavLink({ to, label, location }) {
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative px-4 py-2 text-sm transition-all duration-200
      ${
        isActive
          ? "text-white"
          : "text-purple-200 hover:text-white"
      }
      hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]
      `}
    >
      {label}

      {/* underline has been animated*/}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-purple-400 to-pink-400
        transition-all duration-300
        ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
        origin-left`}
      />
    </Link>
  );
}
