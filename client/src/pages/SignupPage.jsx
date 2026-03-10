import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LightPillar } from "../components/background.jsx";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate("/quiz");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white overflow-hidden relative flex items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #1e1b4b 0%, #2e1065 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <LightPillar />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              GameFinder
            </h1>
            <p className="text-purple-200 mt-2 text-sm">
              {mode === "login"
                ? "Welcome back! Sign in to continue."
                : "Create an account to get started."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === "login"
                  ? "bg-purple-600 text-white"
                  : "text-purple-300 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === "register"
                  ? "bg-purple-600 text-white"
                  : "text-purple-300 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-purple-200 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                placeholder="Enter your username"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-purple-200 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter your password"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm text-purple-200 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Confirm your password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-4 py-2 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-purple-900/40 mt-2"
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
