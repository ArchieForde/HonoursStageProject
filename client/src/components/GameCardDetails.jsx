import { useEffect, useState } from "react";
import { X, Star, Calendar, Monitor, Tag, BookmarkPlus, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./button";

export default function GameDetailModal({ gameId, gameName, onClose, isSaved, onToggleSave }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screenshotIndex, setScreenshotIndex] = useState(0);

  useEffect(() => {
    if (!gameId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/games/${gameId}`);
        if (!res.ok) throw new Error("Failed to fetch game details");
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [gameId]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const screenshots = details?.screenshots || [];

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/'/g, "'").replace(/"/g, '"');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-purple-700/40 shadow-2xl shadow-purple-900/60"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #2e1065 40%, #1a1a2e 100%)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-purple-800/60 hover:bg-purple-700 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
          </div>
        )}

        {error && (
          <div className="p-8 text-center text-red-300">
            <p>Failed to load game details.</p>
            <p className="text-sm mt-1 text-purple-300">{error}</p>
          </div>
        )}

        {details && !loading && (
          <>
            {/* Hero image */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
              <img
                src={details.background_image || "https://via.placeholder.com/800x400?text=No+Image"}
                alt={details.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6">
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">{details.name}</h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Meta row */}
              <div className="flex flex-wrap gap-4 text-sm">
                {/* Rating */}
                <div className="flex items-center gap-1.5 bg-purple-800/40 px-3 py-1.5 rounded-lg">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-semibold">{details.rating?.toFixed(1) || "N/A"}</span>
                  <span className="text-purple-300">/ 5</span>
                </div>

                {/* Release date */}
                {details.released && (
                  <div className="flex items-center gap-1.5 bg-purple-800/40 px-3 py-1.5 rounded-lg">
                    <Calendar size={14} className="text-purple-400" />
                    <span className="text-purple-200">{new Date(details.released).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                )}

                {/* Metacritic */}
                {details.metacritic && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold ${
                    details.metacritic >= 75 ? "bg-green-700/40 text-green-300" :
                    details.metacritic >= 50 ? "bg-yellow-700/40 text-yellow-300" :
                    "bg-red-700/40 text-red-300"
                  }`}>
                    Metacritic: {details.metacritic}
                  </div>
                )}
              </div>

              {/* Genres */}
              {details.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Tag size={14} className="text-purple-400 mt-0.5" />
                  {details.genres.map((g) => (
                    <span key={g.id} className="bg-purple-700/40 border border-purple-600/40 text-purple-200 text-xs px-2.5 py-1 rounded-full">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Platforms */}
              {details.platforms?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor size={14} className="text-purple-400" />
                    <span className="text-sm text-purple-300 font-medium">Platforms</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {details.platforms.map(({ platform }) => (
                      <span key={platform.id} className="bg-indigo-800/40 border border-indigo-600/40 text-indigo-200 text-xs px-2.5 py-1 rounded-full">
                        {platform.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {details.description_raw && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <p className="text-purple-200 text-sm leading-relaxed line-clamp-6">
                    {stripHtml(details.description_raw)}
                  </p>
                </div>
              )}

              {/* Screenshots */}
              {screenshots.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Screenshots</h3>
                  <div className="relative">
                    <img
                      src={screenshots[screenshotIndex]?.image}
                      alt={`Screenshot ${screenshotIndex + 1}`}
                      className="w-full h-52 md:h-72 object-cover rounded-xl"
                    />
                    {screenshots.length > 1 && (
                      <>
                        <button
                          onClick={() => setScreenshotIndex((i) => (i - 1 + screenshots.length) % screenshots.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() => setScreenshotIndex((i) => (i + 1) % screenshots.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {screenshots.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setScreenshotIndex(i)}
                              className={`rounded-full transition-all ${i === screenshotIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant={isSaved ? "primary" : "secondary"}
                  size="md"
                  icon={BookmarkPlus}
                  onClick={onToggleSave}
                  className="transition-all hover:scale-105"
                >
                  {isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
                </Button>
                {details.website && (
                  <a
                    href={details.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-800/40 hover:bg-purple-700/60 border border-purple-600/40 rounded-xl text-purple-200 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Official Site
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
