/**
 * Enhanced Questionnaire for Video Game Recommendations
 * 
 * This questionnaire is designed to map directly to RAWG API genres, tags,
 * and filters for maximum recommendation accuracy.
 * 
 * RAWG Genres: Action, Adventure, RPG, Shooter, Strategy, Simulation, 
 *              Sports, Indie, Puzzle, Racing, Fighting, Family, Board Games
 * RAWG Tags: singleplayer, multiplayer, co-op, open-world, story, 
 *            difficult, casual, etc.
 */

const questions = [
  // =========================================================================
  // PLATFORM - Maps directly to RAWG platform IDs
  // =========================================================================
  {
    id: 1,
    question: "Which platform do you primarily play games on?",
    type: "single",
    options: [
      "PC (Windows/Mac)",
      "PlayStation 4/5",
      "Xbox One/Series X",
      "Nintendo Switch",
      "Mobile (iOS/Android)"
    ],
    key: "platform",
    rawgMapping: {
      "PC (Windows/Mac)": "pc",
      "PlayStation 4/5": "playstation",
      "Xbox One/Series X": "xbox",
      "Nintendo Switch": "nintendo",
      "Mobile (iOS/Android)": "mobile"
    }
  },
  
  // =========================================================================
  // GENRES - Maps directly to RAWG genre slugs
  // =========================================================================
  {
    id: 2,
    question: "Which game genres do you enjoy the most?",
    type: "multiple",
    maxSelections: 3,
    options: [
      "Action",
      "Adventure",
      "RPG",
      "Shooter",
      "Strategy",
      "Simulation",
      "Sports",
      "Indie",
      "Horror",
      "Puzzle",
      "Racing",
      "Fighting",
      "Board Games"
    ],
    key: "genres",
    // These map directly to RAWG API genre slugs
    rawgMapping: {
      "Action": "action",
      "Adventure": "adventure",
      "RPG": "role-playing-games-rpg",
      "Shooter": "shooter",
      "Strategy": "strategy",
      "Simulation": "simulation",
      "Sports": "sports",
      "Indie": "indie",
      "Horror": "horror",
      "Puzzle": "puzzle",
      "Racing": "racing",
      "Fighting": "fighting",
      "Board Games": "board-games"
    }
  },
  
  // =========================================================================
  // GAME MODE - Maps to RAWG tags (singleplayer, multiplayer, co-op)
  // =========================================================================
  {
    id: 3,
    question: "What game mode do you prefer?",
    type: "single",
    options: [
      "Singleplayer (alone)",
      "Multiplayer (online with others)",
      "Co-op (with friends)",
      "Both singleplayer and multiplayer"
    ],
    key: "gameMode",
    rawgMapping: {
      "Singleplayer (alone)": "singleplayer",
      "Multiplayer (online with others)": "multiplayer",
      "Co-op (with friends)": "co-op",
      "Both singleplayer and multiplayer": "both"
    }
  },
  
  // =========================================================================
  // DIFFICULTY - Maps to RAWG tags (hard, difficult, casual, easy)
  // =========================================================================
  {
    id: 4,
    question: "How challenging do you like your games to be?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: {
      1: "Very casual - I just want to relax",
      2: "Casual - Some challenge is nice",
      3: "Balanced - A good mix",
      4: "Challenging - I like to be tested",
      5: "Very difficult - Bring on the challenge!"
    },
    key: "difficulty"
  },
  
  // =========================================================================
  // STORY IMPORTANCE - Maps to RAWG tags (story, narrative, emotional)
  // =========================================================================
  {
    id: 5,
    question: "How important is the story/narrative in games?",
    type: "single",
    options: [
      "No story needed - gameplay first",
      "Minimal story - just enough context",
      "Moderate story - nice to have",
      "Very important - I love deep narratives",
      "The story IS the game"
    ],
    key: "storyImportance",
    rawgMapping: {
      "No story needed - gameplay first": "none",
      "Minimal story - just enough context": "minimal",
      "Moderate story - nice to have": "moderate",
      "Very important - I love deep narratives": "deep",
      "The story IS the game": "core"
    }
  },
  
  // =========================================================================
  // PLAYER PERSPECTIVE - Maps to RAWG tags (first-person, third-person)
  // =========================================================================
  {
    id: 6,
    question: "What camera perspective do you prefer?",
    type: "single",
    options: [
      "First-person (FPS)",
      "Third-person",
      "Top-down/Isometric",
      "Side-scrolling",
      "No preference"
    ],
    key: "perspective",
    rawgMapping: {
      "First-person (FPS)": "first-person",
      "Third-person": "third-person",
      "Top-down/Isometric": "top-down",
      "Side-scrolling": "side-scrolling",
      "No preference": "any"
    }
  },
  
  // =========================================================================
  // WORLD TYPE - Maps to RAWG tags (open-world, linear)
  // =========================================================================
  {
    id: 7,
    question: "What type of game world do you prefer?",
    type: "single",
    options: [
      "Open world - explore freely",
      "Large sandbox areas",
      "Linear - guided experience",
      "Mix of both"
    ],
    key: "worldType",
    rawgMapping: {
      "Open world - explore freely": "open-world",
      "Large sandbox areas": "sandbox",
      "Linear - guided experience": "linear",
      "Mix of both": "mixed"
    }
  },
  
  // =========================================================================
  // GAME ERA - Used for RAWG date filtering
  // =========================================================================
  {
    id: 8,
    question: "What era of games do you prefer?",
    type: "single",
    options: [
      "Any era - quality over age",
      "Latest releases (2024-2026)",
      "Recent (2021-2023)",
      "Modern classics (2018-2020)",
      "Golden era (2010-2017)",
      "Retro (before 2010)"
    ],
    key: "gameEra",
    rawgMapping: {
      "Any era - quality over age": "any",
      "Latest releases (2024-2026)": "2024",
      "Recent (2021-2023)": "2021",
      "Modern classics (2018-2020)": "2018",
      "Golden era (2010-2017)": "2010",
      "Retro (before 2010)": "retro"
    }
  },
  
  // =========================================================================
  // SESSION LENGTH - Maps to game length estimates
  // =========================================================================
  {
    id: 9,
    question: "How long do you typically play gaming sessions?",
    type: "single",
    options: [
      "Quick sessions (15-30 min)",
      "Short sessions (30 min - 1 hour)",
      "Medium sessions (1-2 hours)",
      "Long sessions (2-4 hours)",
      "Marathon sessions (4+ hours)"
    ],
    key: "sessionLength",
    rawgMapping: {
      "Quick sessions (15-30 min)": "quick",
      "Short sessions (30 min - 1 hour)": "short",
      "Medium sessions (1-2 hours)": "medium",
      "Long sessions (2-4 hours)": "long",
      "Marathon sessions (4+ hours)": "marathon"
    }
  },
  
  // =========================================================================
  // REPLAYABILITY - Maps to RAWG tags (roguelike, procedural, replay)
  // =========================================================================
  {
    id: 10,
    question: "How much replayability do you want?",
    type: "single",
    options: [
      "One-time experience - play once",
      "Some replay value - may revisit",
      "High replay value - love to replay",
      "Infinite replay - roguelikes, procedurally generated"
    ],
    key: "replayability",
    rawgMapping: {
      "One-time experience - play once": "none",
      "Some replay value - may revisit": "some",
      "High replay value - love to replay": "high",
      "Infinite replay - roguelikes, procedurally generated": "infinite"
    }
  },
  
  // =========================================================================
  // ATMOSPHERE/THEME - Maps to RAWG themes
  // =========================================================================
  {
    id: 11,
    question: "What atmosphere or theme do you prefer?",
    type: "single",
    options: [
      "Dark/Serious",
      "Lighthearted/Fun",
      "Sci-Fi/Futuristic",
      "Fantasy",
      "Historical",
      "Horror/Scary",
      "Humorous/Satire",
      "No preference"
    ],
    key: "atmosphere",
    rawgMapping: {
      "Dark/Serious": "dark",
      "Lighthearted/Fun": "lighthearted",
      "Sci-Fi/Futuristic": "sci-fi",
      "Fantasy": "fantasy",
      "Historical": "historical",
      "Horror/Scary": "horror",
      "Humorous/Satire": "humor",
      "No preference": "any"
    }
  },
  
  // =========================================================================
  // GRAPHICS PREFERENCE - Maps to RAWG tags (pixel-art, 3d, realistic)
  // =========================================================================
  {
    id: 12,
    question: "What visual style do you prefer?",
    type: "single",
    options: [
      "Realistic/Photorealistic",
      "Stylized/Cartoon",
      "Pixel Art/Retro",
      "Anime/Asian",
      "No preference"
    ],
    key: "graphicsStyle",
    rawgMapping: {
      "Realistic/Photorealistic": "realistic",
      "Stylized/Cartoon": "stylized",
      "Pixel Art/Retro": "pixel-art",
      "Anime/Asian": "anime",
      "No preference": "any"
    }
  },
  
  // =========================================================================
  // METACRITIC PREFERENCE - Used for filtering by rating
  // =========================================================================
  {
    id: 13,
    question: "What's your minimum quality bar?",
    type: "single",
    options: [
      "Any game - I discover hidden gems",
      "Generally good (3.0+)",
      "Solid games (3.5+)",
      "Highly rated (4.0+)",
      "Only the best (4.5+)"
    ],
    key: "minRating",
    rawgMapping: {
      "Any game - I discover hidden gems": 0,
      "Generally good (3.0+)": 3.0,
      "Solid games (3.5+)": 3.5,
      "Highly rated (4.0+)": 4.0,
      "Only the best (4.5+)": 4.5
    }
  },
  
  // =========================================================================
  // CONTENT PREFERENCE - Maps to RAWG tags (violent, mature, etc.)
  // =========================================================================
  {
    id: 14,
    question: "Are you okay with mature content?",
    type: "single",
    options: [
      "All ages - family friendly",
      "Teen - mild content",
      "Mature - some violence/language",
      "Adults only - explicit content"
    ],
    key: "maturity",
    rawgMapping: {
      "All ages - family friendly": "everyone",
      "Teen - mild content": "teen",
      "Mature - some violence/language": "mature",
      "Adults only - explicit content": "adults"
    }
  }
];

export default questions;
