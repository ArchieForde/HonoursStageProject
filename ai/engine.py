"""
Main Recommendation Engine
=========================

This is the core code that ties everything together.
It fetches games from the RAWG API, extracts the games features, runs KNN 
and generates personalized recommendations.

For my Honours project using KNN for game recommendations
"""

import numpy as np
from typing import List, Dict, Any, Optional

from config import MATCH_WEIGHTS
from feature_extraction import (
    extract_user_features,
    extract_game_features,
    expand_user_features
)
from knn_engine import (
    KNNRecommender,
    calculate_match_percentage
)
from rawg_client import get_games_for_recommendation


class RecommendationEngine:
    
    """
    Main recommendation engine class.
    Combines KNN with rule-based scoring for best results.
    """
    
    def __init__(self, n_neighbors: int = 20):
        self.n_neighbors = n_neighbors
        self.knn_model = None
        self.game_metadata = []
        self.game_features = []
        
    def fit(self, answers: Dict[str, Any], api_key: Optional[str] = None):
        """Load games and train the KNN model."""
        print("Fetching games from RAWG API...")
        
        games = get_games_for_recommendation(answers, api_key)
        
        if not games:
            print("Warning: No games fetched from RAWG API")
            return self
            
        print(f"Processing {len(games)} games...")
        

        # Extract features from each game
        self.game_features = []
        self.game_metadata = []
        
        for game in games:
            try:
                features = extract_game_features(game)
                self.game_features.append(features)
                
                # Store game info for display
                self.game_metadata.append({
                    "id": game.get("id"),
                    "name": game.get("name"),
                    "released": game.get("released"),
                    "rating": game.get("rating") or 0,
                    "background_image": game.get("background_image"),
                    "genres": [g.get("name", "Unknown") for g in (game.get("genres") or [])],
                    "platforms": [p.get("platform", {}).get("name", "Unknown") for p in (game.get("platforms") or [])],
                    "metacritic": game.get("metacritic"),
                    "tags": [t.get("slug", "") for t in (game.get("tags") or [])]
                })
            except Exception as e:
                game_name = game.get("name", "Unknown")
                print(f"Warning: Error processing game {game_name}: {e}")
                continue
        

        # Train KNN
        if len(self.game_features) > 0:
            feature_matrix = np.array(self.game_features)
            n_samples = len(feature_matrix)
            n_neighbors = min(self.n_neighbors, max(1, n_samples))
            self.knn_model = KNNRecommender(n_neighbors=n_neighbors)
            self.knn_model.fit(feature_matrix)
            print(f"Model trained with {len(self.game_metadata)} games!")
        else:
            print("Warning: No valid game features extracted")
            
        return self
    

    
    def recommend(self, answers: Dict[str, Any], n_recommendations: int = 5):
        """Generate recommendations based on user preferences."""
        if not self.knn_model or not self.game_metadata:
            raise ValueError("Model not fitted. Call fit() first.")
        
        # Get user feature vector
        user_features = extract_user_features(answers)
        expanded_features = expand_user_features(user_features)
        
        # Get KNN recommendations
        k = min(n_recommendations * 4, len(self.game_metadata))
        distances, indices = self.knn_model.predict(expanded_features, k)
        similarities = self.knn_model.get_similarity_scores(distances)
        
        # Build recommendation list
        recommendations = []
        seen_names = set()
        
        for i, idx in enumerate(indices):
            if idx >= len(self.game_metadata):
                continue
                
            game = self.game_metadata[idx]
            game_name = game.get("name", "")
            
            if game_name in seen_names:
                continue
            seen_names.add(game_name)
            
            # Calculate match percentage
            match_percentage = calculate_match_percentage(answers, game)
            
            # Combine KNN similarity with rule-based matching
            knn_score = similarities[i]
            final_score = (knn_score * 0.3) + (match_percentage / 100.0 * 0.7)
            
            # Boost for higher rated games
            rating_boost = (game.get("rating", 0) / 5.0) * 0.1
            final_score = min(1.0, final_score + rating_boost)
            
            recommendations.append({
                "id": game["id"],
                "name": game_name,
                "released": game.get("released"),
                "rating": game.get("rating"),
                "background_image": game.get("background_image"),
                "genres": game.get("genres", []),
                "platforms": game.get("platforms", []),
                "metacritic": game.get("metacritic"),
                "website": game.get("website"),
                "metacritic_url": game.get("metacritic_url"),
                "rawg_url": f"https://rawg.io/games/{game.get('slug', '')}" if game.get('slug') else None,
                "slug": game.get("slug"),
                "playtime": game.get("playtime", 0),
                "movies": game.get("movies", []),
                "short_screenshots": game.get("short_screenshots", []),
                "similarity_score": round(knn_score, 3),
                "match_percentage": match_percentage,
                "final_score": round(final_score * 100)
            })
            
            if len(recommendations) >= n_recommendations * 2:
                break
        
        # Sort by final score
        recommendations.sort(key=lambda x: x["final_score"], reverse=True)
        
        return recommendations[:n_recommendations]


def get_recommendations(answers: Dict[str, Any], n_recommendations: int = 5, api_key: Optional[str] = None):
    """
    Main function to get recommendations.
    Call this to get game recommendations from user answers.
    """
    try:
        engine = RecommendationEngine(n_neighbors=20)
        engine.fit(answers, api_key)
        
        if not engine.game_metadata:
            return {
                "success": False,
                "error": "No games found matching your preferences",
                "recommendations": []
            }
        
        recommendations = engine.recommend(answers, n_recommendations)
        
        return {
            "success": True,
            "recommendations": recommendations,
            "total_found": len(recommendations),
            "user_preferences": answers
        }
        
    except Exception as e:
        import traceback
        print(f"Error generating recommendations: {e}")
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "recommendations": []
        }


if __name__ == "__main__":
    # Quick test
    test_answers = {
        "platform": "PC",
        "genres": ["RPG", "Action"],
        "pace": "Balanced",
        "difficulty": 3,
        "storyImportance": "Deep story",
        "gameMode": "Singleplayer",
        "sessionLength": "Long (3+ hours)",
        "atmosphere": "Dark/Serious",
        "gameEra": "Modern (2018-2022)",
        "replayability": "High replay value",
        "exploration": 4
    }
    
    result = get_recommendations(test_answers, n_recommendations=5)
    print(result)
