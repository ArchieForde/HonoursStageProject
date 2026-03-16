"""
Feature Extraction Module
=====================

Converts user answers and game data into numerical features for ML.
For my Honours project.

This is crucial for the KNN algorithm to work as we need to convert
everything into numbers it can understand.

"""

import numpy as np
from typing import Dict, List, Any

from config import (
    PLATFORM_WEIGHTS,
    GENRE_WEIGHTS,
    GENRE_INDEX_MAPPING,
    PACE_MAPPING,
    STORY_MAPPING,
    GAME_MODE_MAPPING,
    SESSION_MAPPING,
    ATMOSPHERE_MAPPING,
    REPLAY_MAPPING,
    USER_FEATURE_COUNT,
    PERSPECTIVE_MAPPING,
    WORLD_TYPE_MAPPING,
    GRAPHICS_MAPPING
)


def extract_user_features(answers: Dict[str, Any]) -> np.ndarray:
    """
    Convert user questionnaire answers into a feature vector.
    
    Features (17 total):
    0: Platform preference
    1-3: Genre preferences (top 3)
    4: Gameplay pace
    5: Difficulty
    6: Story importance
    7: Game mode
    8: Session length
    9: Atmosphere
    10: Replayability
    11: Game era
    12: Exploration
    13: Perspective
    14: World type
    15: Graphics style
    16: Minimum rating
    """
    features = np.zeros(17)
    

    # Platform
    platform = answers.get("platform", "").lower()
    features[0] = PLATFORM_WEIGHTS.get(platform, 0.5)
    
    # Genres (up to 3)
    genres = answers.get("genres", [])
    for i, genre in enumerate(genres[:3]):
        genre_lower = genre.lower()
        features[i + 1] = GENRE_WEIGHTS.get(genre_lower, 0.5)
    
    if len(genres) < 3:
        selected = genres[:len(genres)] if genres else []
        avg = np.mean([GENRE_WEIGHTS.get(g.lower(), 0.5) for g in selected]) if selected else 0.5
        for i in range(len(genres), 3):
            features[i + 1] = avg
    
    # Pace
    pace = answers.get("pace", "").lower()
    features[4] = PACE_MAPPING.get(pace, 0.5)
    
    # Difficulty (normalize 1-5 to 0-1)
    difficulty = answers.get("difficulty", 3)
    features[5] = (difficulty - 1) / 4.0
    
    # Story importance
    story = answers.get("storyImportance", "").lower()
    features[6] = STORY_MAPPING.get(story, 0.5)
    
    # Game mode
    game_mode = answers.get("gameMode", "").lower()
    features[7] = GAME_MODE_MAPPING.get(game_mode, 0.5)
    
    # Session length
    session = answers.get("sessionLength", "").lower()
    features[8] = SESSION_MAPPING.get(session, 0.5)
    
    # Atmosphere
    atmosphere = answers.get("atmosphere", "").lower()
    features[9] = ATMOSPHERE_MAPPING.get(atmosphere, 0.5)
    
    # Replayability
    replay = answers.get("replayability", "").lower()
    features[10] = REPLAY_MAPPING.get(replay, 0.5)
    
    # Game era
    game_era = answers.get("gameEra", "any era").lower()
    if "2024" in game_era or "latest" in game_era:
        features[11] = 1.0
    elif "2021" in game_era:
        features[11] = 0.9
    elif "modern" in game_era or "2018" in game_era:
        features[11] = 0.75
    elif "classic" in game_era or "2010" in game_era:
        features[11] = 0.4
    elif "retro" in game_era:
        features[11] = 0.1
    else:
        features[11] = 0.5
    
    # Exploration
    exploration = answers.get("exploration", 3)
    features[12] = (exploration - 1) / 4.0
    
    # Perspective
    perspective = answers.get("perspective", "").lower()
    features[13] = PERSPECTIVE_MAPPING.get(perspective, 0.5)
    
    # World type
    world = answers.get("worldType", "").lower()
    features[14] = WORLD_TYPE_MAPPING.get(world, 0.5)
    
    # Graphics
    graphics = answers.get("graphicsStyle", "").lower()
    features[15] = GRAPHICS_MAPPING.get(graphics, 0.5)
    
    # Min rating
    min_rating = answers.get("minRating", 0)
    if isinstance(min_rating, str):
        try:
            min_rating = float(min_rating)
        except:
            min_rating = 0
    features[16] = min_rating / 5.0
    
    return features




def create_genre_vector(genres: List[str]) -> np.ndarray:
    """One-hot encode genres."""
    genre_vector = np.zeros(12)
    
    for genre in genres:
        genre_lower = genre.lower()
        if genre_lower in GENRE_INDEX_MAPPING:
            genre_vector[GENRE_INDEX_MAPPING[genre_lower]] = 1.0
    
    return genre_vector


def extract_game_features(game: Dict[str, Any]) -> np.ndarray:
    """Extract features from a game for ML comparison."""
    # Genre features
    genres_data = game.get("genres")
    
    try:
        if genres_data and len(genres_data) > 0 and genres_data[0] is not None:
            if isinstance(genres_data[0], str):
                game_genres = [g.lower() for g in genres_data if g is not None]
            else:
                game_genres = [g.get("slug", "").lower() for g in genres_data if g is not None]
        else:
            game_genres = []
    except:
        game_genres = []
    
    genre_features = create_genre_vector(game_genres)
    
    # Platform score
    platforms_data = game.get("platforms", [])
    platform_scores = []
    for p in platforms_data:
        if isinstance(p, str):
            p_name = p.lower()
        else:
            p_name = p.get("platform", {}).get("name", "").lower()
        
        if "pc" in p_name:
            platform_scores.append(1.0)
        elif "playstation" in p_name:
            platform_scores.append(0.9)
        elif "xbox" in p_name:
            platform_scores.append(0.85)
        elif "nintendo" in p_name or "switch" in p_name:
            platform_scores.append(0.7)
        elif "mobile" in p_name:
            platform_scores.append(0.5)
    
    platform_score = np.mean(platform_scores) if platform_scores else 0.5


    # Tags features
    tags_data = game.get("tags")
    
    try:
        if tags_data and len(tags_data) > 0 and tags_data[0] is not None:
            if isinstance(tags_data[0], str):
                game_tags = [t.lower() for t in tags_data if t is not None]
            else:
                game_tags = [t.get("slug", "").lower() for t in tags_data if t is not None]
        else:
            game_tags = []
    except:
        game_tags = []
    
    # Difficulty from tags
    is_hard = any(t in game_tags for t in ["hard", "difficult", "souls-like"])
    is_casual = any(t in game_tags for t in ["casual", "easy", "accessible"])
    if is_hard:
        difficulty_score = 1.0
    elif is_casual:
        difficulty_score = 0.2
    else:
        difficulty_score = 0.5


    # Story from tags
    has_story = any(t in game_tags for t in ["story", "narrative", "emotional"])
    story_score = 0.8 if has_story else 0.3


    # Game mode from tags
    is_singleplayer = any(t in game_tags for t in ["singleplayer", "solo", "offline"])
    is_multiplayer = any(t in game_tags for t in ["multiplayer", "co-op", "online"])
    if is_singleplayer and not is_multiplayer:
        game_mode_score = 1.0
    elif is_multiplayer:
        game_mode_score = 0.3
    else:
        game_mode_score = 0.5
    
    # Replay from tags
    has_replay = any(t in game_tags for t in ["replay", "roguelike", "procedural", "randomized"])
    replay_score = 1.0 if has_replay else 0.3
    
    # Rating
    rating = game.get("rating", 3.0)
    rating_normalized = rating / 5.0


    # Combine all features
    features = np.concatenate([
        genre_features,           # 12 features
        [platform_score],       # 1 feature
        [difficulty_score],      # 1 feature
        [story_score],           # 1 feature
        [game_mode_score],       # 1 feature
        [replay_score],         # 1 feature
        [rating_normalized]      # 1 feature
    ])
    
    return features



def expand_user_features(user_features: np.ndarray) -> np.ndarray:
    """Expand user features to match game feature dimensions."""
    expanded = np.zeros(18)
    
    expanded[0] = user_features[0]
    expanded[1:4] = user_features[1:4]
    expanded[4] = user_features[4]
    expanded[5] = user_features[5]
    expanded[6] = user_features[6]
    expanded[7] = user_features[7]
    expanded[8] = user_features[8]
    expanded[9] = user_features[10]
    expanded[10] = user_features[5]
    expanded[11:14] = 0.5
    expanded[14] = user_features[12]
    expanded[15:18] = 0.5
    
    return expanded
