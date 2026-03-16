"""
Configuration and Mappings
==========================

All the mappings and configurations for the recommendation system.
Keeps all the constants in one place.

"""

# =============================================================================
# API Configuration
# =============================================================================

RAWG_BASE_URL = "https://api.rawg.io/api"

# =============================================================================
# Platform Configuration
# =============================================================================

PLATFORM_WEIGHTS = {
    "pc": 1.0,
    "playstation": 0.9,
    "xbox": 0.85,
    "nintendo": 0.7,
    "nintendo switch": 0.7,
    "mobile": 0.5
}

PLATFORM_IDS = {
    "pc": 1,
    "playstation": 2,
    "xbox": 3,
    "nintendo": 7,
    "nintendo switch": 7,
    "mobile": 4
}

# =============================================================================

# Genre Configuration

# Genre weights - how much each genre matches user preferences
GENRE_WEIGHTS = {
    "action": 1.0,
    "adventure": 0.7,
    "rpg": 0.8,
    "shooter": 1.0,
    "strategy": 0.3,
    "simulation": 0.4,
    "sports": 0.6,
    "indie": 0.5,
    "horror": 0.9,
    "puzzle": 0.4,
    "racing": 0.7,
    "fighting": 0.9,
    "family": 0.3,
    "board": 0.3,
    "educational": 0.2,
    "card": 0.4
}

# Genre slugs for RAWG API
# Note: Some genres like 'horror' are TAGS in RAWG, not genres

GENRE_SLUGS = {
    "action": "action",
    "adventure": "adventure",
    "rpg": "role-playing-games-rpg",
    "shooter": "shooter",
    "strategy": "strategy",
    "simulation": "simulation",
    "sports": "sports",
    "indie": "indie",
    "horror": "horror",  # This is a tag in RAWG, not a genre
    "puzzle": "puzzle",
    "racing": "racing",
    "fighting": "fighting",
    "family": "family",
    "board": "board-games",
    "educational": "educational",
    "card": "card"
}

# Genres that should be queried as tags in RAWG (not genres)
GENRES_AS_TAGS = {
    "horror",
    "survival-horror",
    "zombies",
    "post-apocalyptic"
}

# Genre indexing for one-hot encoding
GENRE_INDEX_MAPPING = {
    "action": 0,
    "adventure": 1,
    "rpg": 2,
    "shooter": 3,
    "strategy": 4,
    "simulation": 5,
    "sports": 6,
    "indie": 7,
    "horror": 8,
    "puzzle": 9,
    "racing": 10,
    "fighting": 11
}

# =============================================================================

# # Other Feature Mappings


PACE_MAPPING = {
    "fast-paced": 1.0,
    "balanced": 0.5,
    "strategic": 0.2
}

STORY_MAPPING = {
    "no story needed": 0.0,
    "light story": 0.25,
    "moderate story": 0.5,
    "deep story": 0.75,
    "the story is the game": 1.0
}

GAME_MODE_MAPPING = {
    "singleplayer": 1.0,
    "multiplayer": 0.0,
    "co-op": 0.5,
    "both": 0.7
}

SESSION_MAPPING = {
    "quick (15-30 min)": 0.2,
    "short sessions (30 min - 1 hour)": 0.4,
    "medium (1-2 hours)": 0.5,
    "medium sessions (1-2 hours)": 0.6,
    "long (3+ hours)": 1.0,
    "long sessions (2-4 hours)": 0.8,
    "marathon sessions (4+ hours)": 1.0
}

ATMOSPHERE_MAPPING = {

    "dark/serious": 0.9,
    "dark": 0.9,
    "lighthearted/fun": 0.3,
    "lighthearted": 0.3,
    "sci-fi/futuristic": 0.7,
    "sci-fi": 0.7,
    "fantasy": 0.6,
    "historical": 0.5,
    "horror/scary": 1.0,
    "horror": 1.0,
    "humorous/satire": 0.2,
    "humor": 0.2,
    "emotional": 0.5,
    "doesn't matter": 0.5,
    "any": 0.5
}

REPLAY_MAPPING = {
    "none": 0.1,
    "play once": 0.2,
    "some": 0.5,
    "some replay value": 0.5,
    "high": 1.0,
    "high replay value": 1.0,
    "infinite": 1.0,
    "one-time experience - play once": 0.1,
    "some replay value - may revisit": 0.5,
    "high replay value - love to replay": 0.9,
    "infinite replay - roguelikes, procedurally generated": 1.0

}

# Perspective mappings

PERSPECTIVE_MAPPING = {
    "first-person (fps)": 1.0,
    "first-person": 1.0,
    "third-person": 0.7,
    "top-down/isometric": 0.4,
    "top-down": 0.4,
    "side-scrolling": 0.3,
    "no preference": 0.5,
    "any": 0.5
}

# World type mappings
WORLD_TYPE_MAPPING = {
    "open world - explore freely": 1.0,
    "open-world": 1.0,
    "large sandbox areas": 0.8,
    "sandbox": 0.8,
    "linear - guided experience": 0.2,
    "linear": 0.2,
    "mix of both": 0.5,
    "mixed": 0.5
}

# Graphics style mappings
GRAPHICS_MAPPING = {
    "realistic/photorealistic": 1.0,
    "realistic": 1.0,
    "stylized/cartoon": 0.6,
    "stylized": 0.6,
    "pixel art/retro": 0.3,
    "pixel-art": 0.3,
    "anime/asian": 0.5,
    "anime": 0.5,
    "no preference": 0.5,
    "any": 0.5
}

# Game Era Configuration

GAME_ERA_MAPPING = {
    "any era - quality over age": {"ordering": "-rating,-metacritic"},
    "latest releases (2024-2026)": {"min_year": 2024, "ordering": "-metacritic,-rating"},
    "2024": {"min_year": 2024, "ordering": "-metacritic,-rating"},
    "recent (2021-2023)": {"min_year": 2021, "ordering": "-rating,-metacritic"},
    "2021": {"min_year": 2021, "ordering": "-rating,-metacritic"},
    "modern classics (2018-2020)": {"min_year": 2018, "max_year": 2020, "ordering": "-rating,-metacritic"},
    "2018": {"min_year": 2018, "ordering": "-rating,-metacritic"},
    "golden era (2010-2017)": {"min_year": 2010, "max_year": 2017, "ordering": "-rating,-popularity"},
    "2010": {"min_year": 2010, "ordering": "-rating,-popularity"},
    "retro (before 2010)": {"max_year": 2009, "ordering": "-rating,-popularity"},
    "retro": {"max_year": 2009, "ordering": "-rating,-popularity"},
    "any era": {"ordering": "-rating,-metacritic"}
}

# Feature Vector Configuration

USER_FEATURE_COUNT = 17

MATCH_WEIGHTS = {
    "genre": 0.40,
    "platform": 0.20,
    "game_mode": 0.15,
    "difficulty": 0.08,
    "story": 0.07,
    "replayability": 0.10
}

# Game mode tags for filtering

GAME_MODE_TAGS = {
    "singleplayer": "singleplayer,offline",
    "multiplayer": "multiplayer,online,multiplayer-only,online-co-op",
    "co-op": "co-op,co-op,couch-co-op,online-co-op,split-screen",
    "both": "singleplayer,multiplayer",
    "mmo": "mmo,mmorpg,online"
}

# Military/shooter tags for getting realistic shooters
MILITARY_SHOOTER_TAGS = "military,war,tactical,realistic,battle-royale,pvp,team-based"

DIFFICULTY_TAGS = {
    "hard": ["hard", "difficult", "souls-like", "challenge"],
    "casual": ["casual", "easy", "accessible", "relaxing", "cozy"],
    "balanced": []
}

STORY_TAGS = {
    "deep": ["story", "narrative", "emotional", "cinematic"],
    "minimal": ["arcade", "minimalist"],
    "none": []
}

REPLAY_TAGS = {
    "high": ["roguelike", "roguelite", "procedural", "randomized", "replay-value"],
    "some": ["achievements", "collectibles"],
    "none": []
}
