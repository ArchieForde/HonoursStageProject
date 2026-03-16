"""
KNN Algorithm Implementation
===========================

This module contains the K-Nearest Neighbors algorithm implementation
for finding similar video games based on user preferences.

For my Honours project - using scikit-learn's NearestNeighbors
""" 

import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Any, Tuple, Optional


class KNNRecommender:
    """
    K-Nearest Neighbors recommender.
    Uses cosine similarity to find similar games.
    """
    
    def __init__(self, n_neighbors: int = 10, metric: str = 'cosine'):
        self.n_neighbors = n_neighbors
        self.metric = metric
        self.scaler = StandardScaler()
        self.knn_model = None
        self.is_fitted = False
        
    def fit(self, feature_matrix: np.ndarray):

        #Train the KNN model on game features.
        # Normalize features

        normalized_matrix = self.scaler.fit_transform(feature_matrix)
        
        # Initialize and train KNN
        self.knn_model = NearestNeighbors(
            n_neighbors=min(self.n_neighbors, len(feature_matrix)),
            metric=self.metric,
            algorithm='brute'
        )
        
        self.knn_model.fit(normalized_matrix)
        self.is_fitted = True
        
        return self
    
    def predict(self, query_vector: np.ndarray, n_recommendations: int = 5):
        #Find K nearest neighbors.
        if not self.is_fitted:
            raise ValueError("The Model is not fitted. Call fit() first.")
        
        # Normalize query
        
        query_normalized = self.scaler.transform(query_vector.reshape(1, -1))


        
        # Find neighbors
        distances, indices = self.knn_model.kneighbors(
            query_normalized, 
            n_neighbors=min(n_recommendations, self.n_neighbors)
        )
        
        return distances[0], indices[0]
    
    def get_similarity_scores(self, distances: np.ndarray):

        #Convert distances to similarity scores (0-1).

        # Cosine distance: 0 is identical, 2 is opposite
        # Convert to similarity: 1 is identical, 0 is opposite

        similarities = 1 - (distances / 2.0)
        return np.clip(similarities, 0, 1)


def calculate_match_percentage(user_answers: Dict[str, Any], game: Dict[str, Any]) -> int:
    """
    Calculate how well a game matches user preferences.
    
    Uses rule-based scoring to complement the current KNN algorithm.
    
    Weights:
    - Genre matching: 40%
    - Platform matching: 20%
    - Game mode: 15%
    - Difficulty: 8%
    - Story: 7%
    - Replayability: 10%
    """
    from config import GAME_MODE_TAGS, DIFFICULTY_TAGS, STORY_TAGS, REPLAY_TAGS
    
    score = 0.0

    max_score = 0.0
    
    # Genre matching (40%)

    user_genres = [g.lower() for g in user_answers.get("genres", [])]
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
    

    if user_genres:
        max_score += 40
        matched = 0
        for ug in user_genres:
            if ug == "horror":
                if any("horror" in gg for gg in game_genres):
                    matched += 1
            # Handle shooter and simulation combo
            elif ug == "shooter" or ug == "simulation":

                # Check if game has shooter or action 
                if any(g in ["shooter", "action"] for g in game_genres):
                    matched += 1
            elif any(ug in gg or gg in ug for gg in game_genres):
                matched += 1
        
        score += (matched / len(user_genres)) * 40
    

    # Platform matching (20%)

    user_platform = user_answers.get("platform", "").lower()
    
    platforms_data = game.get("platforms", [])
    
    game_platforms = []
    for p in platforms_data:
        if isinstance(p, str):
            game_platforms.append(p.lower())
        else:
            game_platforms.append(p.get("platform", {}).get("name", "").lower())
    

    max_score += 20
    if user_platform:
        platform_match = False
        if user_platform == "pc":
            platform_match = any("pc" in gp for gp in game_platforms)
        elif user_platform == "playstation":
            platform_match = any("playstation" in gp for gp in game_platforms)
        elif user_platform == "xbox":
            platform_match = any("xbox" in gp for gp in game_platforms)
        elif "nintendo" in user_platform:
            platform_match = any("nintendo" in gp or "switch" in gp for gp in game_platforms)
        

        if platform_match:
            score += 20
    
    # Game mode matching (20% - increased weight)

    user_mode = user_answers.get("gameMode", "").lower()
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
    
    max_score += 20
    if user_mode and user_mode != "both":

        # Check for PRIMARY game mode indicators
        is_singleplayer_only = "singleplayer" in game_tags and "multiplayer" not in game_tags
        is_multiplayer_only = "multiplayer" in game_tags and "singleplayer" not in game_tags
        is_multiplayer_mixed = "multiplayer" in game_tags and "singleplayer" in game_tags
        

        if user_mode == "singleplayer":
            # Penalize games that have multiplayer
            if is_singleplayer_only:
                score += 20
            elif is_multiplayer_mixed:
                score += 10  # Mixed - partial credit
            # If only multiplayer, score stays 0
        elif "multiplayer" in user_mode or "online" in user_mode:
            # Make it stricter, only gives full score to multiplayer-only games
            if is_multiplayer_only:
                score += 20
            elif is_multiplayer_mixed:
                score += 12  # Mixed - partial credit

            # Singleplayer-only games get 0
        elif "co-op" in user_mode or "coop" in user_mode:
            has_coop = "co-op" in game_tags or "cooperative" in game_tags
            if has_coop:
                score += 20
            elif is_multiplayer:
                score += 10
    elif user_mode == "both":
        score += 10
    
    # Replayability (10%)


    user_replay = user_answers.get("replayability", "").lower()
    
    max_score += 10
    if user_replay:

        has_replay_tags = any(t in game_tags for t in ["replay", "roguelike", "procedural", "randomized"])
        
        if "high" in user_replay:
            score += 10 if has_replay_tags else 3
        elif "some" in user_replay:
            score += 5
        else:
            score += 10


    # Rating bonus (remaining)
    max_score += 15
    rating = game.get("rating", 0)
    
    if rating >= 4.5:
        score += 15
    elif rating >= 4.0:
        score += 12
    elif rating >= 3.5:
        score += 8
    elif rating >= 3.0:
        score += 4
    
    # Calculate percentage
    if max_score > 0:
        percentage = (score / max_score) * 100
    else:
        percentage = 0
    
    return round(percentage)
