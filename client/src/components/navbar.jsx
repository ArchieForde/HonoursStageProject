import { Gamepad2, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  {/* if scrolled the navbar style adjusts*/}
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

        {/* Logo */}
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

          {user ? (
            <>
              <NavLink to="/quiz" label="Quiz" location={location} />
              <NavLink to="/results" label="Results" location={location} />
              <NavLink to="/wishlist" label="Wishlist" location={location} />

              {/* User info + logout */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-purple-500/30">
                <span className="flex items-center gap-1.5 text-sm text-purple-200">
                  <User size={15} className="text-purple-400" />
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-purple-300 hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="ml-4 px-4 py-1.5 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
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
