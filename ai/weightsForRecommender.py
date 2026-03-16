"""

Video Game Recommendation System

This is for my Honours stage project. A content-based filtering system that recommends 
video games based on the users preferences from a questionnaire.

I use weighted tag matching combined with KNN to help find games that match what the user likes.
The idea is to compare the tags from games with what the user selected in 
the questionnaire and give a match score.

"""

import numpy as np
import requests
from typing import List, Dict, Any, Optional
import os

# Load the API key from environment
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # If dotenv not installed, just continue
    pass

# Import config settings
from config import (
    RAWG_BASE_URL,
    PLATFORM_IDS,
    GAME_ERA_MAPPING
)

# Get the RAWG API key
RAWG_API_KEY = os.getenv("RAWG_API_KEY", "")



# TAG WEIGHTS FOR MATCHING

# These weights determine how important each tag is when calculating similarity
# Higher weight = more important for matching
# I chose these based on what genres are stated on RAWG and what users might care about. 

# High priority tags - genre and game mode are most important
HIGH_WEIGHT_TAGS = {
    # Genre tags - these are the most important
    "action": 10,
    "adventure": 10,
    "rpg": 10,
    "role-playing-games-rpg": 10,
    "shooter": 10,
    "strategy": 10,
    "simulation": 10,
    "sports": 10,
    "indie": 8,
    "horror": 10,  # Horror is important for horror game fans
    "puzzle": 8,
    "racing": 10,
    "fighting": 10,
    
    # Game mode - whether singleplayer or multiplayer matters a lot
    "singleplayer": 15,
    "multiplayer": 15,
    "co-op": 15,
    "cooperative": 15,
    "online-co-op": 15,
    "multiplayer-only": 15,
    
    # Tactical/military tags - important for shooter fans who like realism
    "military": 12,
    "war": 12,
    "tactical": 12,
    "pvp": 12,
    "team-based": 12,
    
    # Camera perspective
    "first-person": 8,
    "fps": 8,
    "third-person": 8,
    "tps": 8,
    
    # Theme/atmosphere
    "horror": 8,
    "scary": 8,
    "dark": 6,
    "sci-fi": 6,
    "futuristic": 6,
    "fantasy": 6,
}

# Medium priority tags
MEDIUM_WEIGHT_TAGS = {
    # World type - open world vs linear
    "open-world": 6,
    "sandbox": 5,
    "linear": 4,
    
    # Story importance
    "story-rich": 6,
    "narrative": 5,
    
    # Difficulty
    "difficult": 5,
    "hard": 5,
    "casual": 4,
    "easy": 4,
    
    # Replay value
    "roguelike": 6,
    "roguelite": 5,
    "procedural": 5,
    
    # Graphics style
    "realistic": 5,
    "pixel-art": 4,
    "stylized": 4,
}

# Low priority tags - nice to have but not critical
LOW_WEIGHT_TAGS = {
    "atmospheric": 3,
    "exploration": 3,
    "relaxing": 2,
    "cozy": 2,
}


class WeightedTagRecommender:
    
    def __init__(self):
        """Initialize the recommender."""
        self.game_metadata = []
    
    def _extract_game_tags(self, game: Dict) -> set:
        """
        Extract all tags from a game into a set.
        
        Tags come from the RAWG API and include genre, themes, 
        gameplay features, etc.
        """
        tags = set()
        
        # Get tags from the tags field
        game_tags = game.get("tags", [])
        if game_tags:
            for tag in game_tags:
                # Each tag can be a dict or just a string
                if isinstance(tag, dict):
                    tag_slug = tag.get("slug", "").lower()
                    if tag_slug:
                        tags.add(tag_slug)
                elif isinstance(tag, str):
                    tags.add(tag.lower())
        
        # Also add genre tags - these are important
        genres = game.get("genres", [])
        if genres:
            for genre in genres:
                if isinstance(genre, dict):
                    genre_slug = genre.get("slug", "").lower()
                    if genre_slug:
                        tags.add(genre_slug)
                elif isinstance(genre, str):
                    tags.add(genre.lower())
        
        return tags
    
    def _calculate_user_tag_weights(self, answers: Dict) -> Dict[str, float]:
        """
        Convert user questionnaire answers into tag weights.
        
        This is where I map what the user selected to what tags
        to look for in games.
        """
        tag_weights = {}
        
        # Process genre selections - these get highest weight (20)
        genres = answers.get("genres", [])
        for g in genres:
            g_lower = g.lower()
            # Add the genre itself as a high-weight tag
            tag_weights[g_lower] = 20
            
            # Also map to RAWG slug format
            slug_map = {
                "action": "action",
                "adventure": "adventure",
                "rpg": "role-playing-games-rpg",
                "shooter": "shooter",
                "strategy": "strategy",
                "simulation": "simulation",
                "sports": "sports",
                "indie": "indie",
                "horror": "horror",  # Horror is a tag in RAWG, not genre
                "puzzle": "puzzle",
                "racing": "racing",
                "fighting": "fighting"
            }
            if g_lower in slug_map:
                tag_weights[slug_map[g_lower]] = 20
            
            # Special case: horror needs high weight as a tag
            if g_lower == "horror":
                tag_weights["horror"] = 25
                tag_weights["survival-horror"] = 20
        
        # Process game mode - very important (weight 25)
        game_mode = answers.get("gameMode", "").lower()
        if game_mode == "singleplayer":
            tag_weights["singleplayer"] = 25
        elif game_mode == "multiplayer" or "online" in game_mode:
            tag_weights["multiplayer"] = 20
            tag_weights["online"] = 15
            
            # If they want multiplayer AND shooter, add tactical tags
            # This helps find games like CS2, Squad, Arma 3
            if genres and any(g.lower() == "shooter" for g in genres):
                tag_weights["tactical"] = 15
                tag_weights["military"] = 15
                tag_weights["war"] = 12
                tag_weights["pvp"] = 15
                tag_weights["team-based"] = 15
                
        elif "co-op" in game_mode or "coop" in game_mode:
            tag_weights["co-op"] = 20
            tag_weights["cooperative"] = 20
            tag_weights["online-co-op"] = 15
        
        # Process camera perspective
        perspective = answers.get("perspective", "").lower()
        if "first" in perspective or "fps" in perspective:
            tag_weights["first-person"] = 12
            tag_weights["fps"] = 12
        elif "third" in perspective:
            tag_weights["third-person"] = 10
            tag_weights["tps"] = 10
        
        # Process atmosphere/theme preference
        atmosphere = answers.get("atmosphere", "").lower()
        if "dark" in atmosphere:
            tag_weights["dark"] = 8
        elif "horror" in atmosphere or "scary" in atmosphere:
            tag_weights["horror"] = 12
            tag_weights["survival-horror"] = 10
        elif "sci-fi" in atmosphere or "futuristic" in atmosphere:
            tag_weights["sci-fi"] = 8
        elif "fantasy" in atmosphere:
            tag_weights["fantasy"] = 8
        
        # Process world type preference
        world = answers.get("worldType", "").lower()
        if "open" in world:
            tag_weights["open-world"] = 10
        elif "linear" in world:
            tag_weights["linear"] = 5
        
        # Process difficulty preference
        difficulty = answers.get("difficulty", 3)
        try:
            diff = int(difficulty)
            if diff >= 4:
                # Hard/difficult games
                tag_weights["difficult"] = 8
                tag_weights["hard"] = 8
            elif diff <= 2:
                # Easy/casual games
                tag_weights["casual"] = 6
        except:
            pass
        
        return tag_weights
    
    def _calculate_similarity(self, game_tags: set, user_weights: Dict[str, float]) -> float:
        """
        Calculate how well a game matches user preferences.
        
        I sum up the weights of all matching tags and normalize
        to get a score between 0 and 1.
        """
        if not game_tags or not user_weights:
            return 0.0
        
        # Find matching tags and sum their weights
        score = 0.0
        for tag in game_tags:
            if tag in user_weights:
                score += user_weights[tag]
        
        # Calculate max possible score (if all user tags matched)
        max_possible = sum(user_weights.values())
        
        if max_possible > 0:
            # Normalize to 0-1 range
            return min(1.0, score / max_possible)
        return 0.0
    
    def fit(self, games: List[Dict]):
        """
        Load game data into the recommender.
        
        I store the metadata including tags for each game so I can
        compare against user preferences later.
        """
        self.game_metadata = []
        
        for game in games:
            # Extract tags from this game
            game_tags = self._extract_game_tags(game)
            
            # Stores relevant info
            self.game_metadata.append({
                "id": game.get("id"),
                "name": game.get("name"),
                "released": game.get("released"),
                "rating": game.get("rating") or 0,
                "background_image": game.get("background_image"),
                "genres": [g.get("name", "Unknown") if isinstance(g, dict) else g for g in (game.get("genres") or [])],
                "platforms": [p.get("platform", {}).get("name", "Unknown") if isinstance(p, dict) else p for p in (game.get("platforms") or [])],
                "metacritic": game.get("metacritic"),
                "tags": game_tags,
                "raw_tags": [t.get("slug", "") if isinstance(t, dict) else t for t in (game.get("tags") or [])]
            })
        
        return self
    
    def recommend(self, answers: Dict, n_recommendations: int = 5) -> List[Dict]:
        
        """
        Generate game recommendations based on user answers.
        
        This is the main function which takes the questionnaire answers,
        calculates similarity scores for all games, and returns the top matches.
        """

        if not self.game_metadata:
            raise ValueError("No games loaded. Call fit() first.")
        
        # Convert answers to tag weights
        user_weights = self._calculate_user_tag_weights(answers)
        
        if not user_weights:
            raise ValueError("No user preferences provided.")
        
        # Score each game
        game_scores = []
        for game in self.game_metadata:
            game_tags = game.get("tags", set())
            similarity = self._calculate_similarity(game_tags, user_weights)
            
            # Convert to percentage (0-100)
            match_percentage = int(similarity * 100)
            
            # Add a small boost for highly rated games
            # This helps break ties and promotes quality
            rating = game.get("rating", 0)
            rating_boost = (rating / 5.0) * 8  # Max 8% boost
            final_score = min(100, match_percentage + rating_boost)
            
            game_scores.append({
                "game": game,
                "similarity": similarity,
                "match_percentage": match_percentage,
                "final_score": final_score
            })
        

        # Sort by score (highest first)
        game_scores.sort(key=lambda x: x["final_score"], reverse=True)
        
        
        # Get top recommendations
        recommendations = []
        for item in game_scores[:n_recommendations * 3]:  # Get extra for filtering
            game = item["game"]
            
            recommendations.append({
                "id": game["id"],
                "name": game["name"],
                "released": game.get("released"),
                "rating": game.get("rating"),
                "background_image": game.get("background_image"),
                "genres": game.get("genres", []),
                "platforms": game.get("platforms", []),
                "metacritic": game.get("metacritic"),
                "similarity_score": round(item["similarity"], 3),
                "match_percentage": item["match_percentage"],
                "final_score": round(item["final_score"])
            })
            
            if len(recommendations) >= n_recommendations:
                break
        
        return recommendations


def fetch_games_for_recommender(answers: Dict, api_key: Optional[str] = None) -> List[Dict]:
    
    """
    Fetch games from RAWG API that match user preferences.
    
    I build a query based on the user's genre and game mode selections,
    then fetch the most popular matching games.
    
    """

    client_api_key = api_key or RAWG_API_KEY
    
    if not client_api_key:
        return []
    
    
    # Get user preferences
    genres = answers.get("genres", [])
    game_mode = answers.get("gameMode", "").lower()
    platform = answers.get("platform", "")
    game_era = answers.get("gameEra", "any era").lower()
    
    # Start building query params
    # Get lots of games so we have plenty to match against
    params = {
        "page_size": 100,  # Fetch 100 games
        "ordering": "-rating,-metacritic"  # Best rated first
    }
    

    # Handle genres
    
    # Note: In RAWG, most things are genres but horror is actually a TAG
    # So I need to handle that differently
    genre_map = {
        "action": "action",
        "adventure": "adventure", 
        "rpg": "role-playing-games-rpg",
        "shooter": "shooter",
        "strategy": "strategy",
        "simulation": "simulation",
        "sports": "sports",
        "indie": "indie",
        "horror": None,  # Horror is handled as a tag, not genre
        "puzzle": "puzzle",
        "racing": "racing",
        "fighting": "fighting"
    }
    
    # Check if horror is in the selection
    has_horror = any(g.lower() == "horror" for g in (genres or []))
    
    # Only use actual genres (not tags) for the genre filter
    if genres:
        valid_genres = []
        for g in genres[:2]:  # Max 2 genres to avoid too narrow results
            g_lower = g.lower()
            if g_lower in genre_map and genre_map[g_lower] is not None:
                valid_genres.append(genre_map[g_lower])
        
        if valid_genres:
            params["genres"] = ",".join(valid_genres)
    
    # Add horror as a tag if selected 

    if has_horror:
        if params.get("tags"):
            params["tags"] += ",horror"
        else:
            params["tags"] = "horror"
    
    # =========================================================================

    # Handle atmosphere - add relevant tags

    atmosphere = answers.get("atmosphere", "").lower()
    if "horror" in atmosphere or "scary" in atmosphere:
        if params.get("tags"):
            params["tags"] += ",horror,survival-horror"
        else:
            params["tags"] = "horror,survival-horror"
    elif "dark" in atmosphere:
        if params.get("tags"):
            params["tags"] += ",dark"
        else:
            params["tags"] = "dark"
    elif "sci-fi" in atmosphere or "futuristic" in atmosphere:
        if params.get("tags"):
            params["tags"] += ",sci-fi"
        else:
            params["tags"] = "sci-fi"
    elif "fantasy" in atmosphere:
        if params.get("tags"):
            params["tags"] += ",fantasy"
        else:
            params["tags"] = "fantasy"
    
    # =========================================================================

    # Handle game mode - append to existing tags

    # We append existing tags rather than replacing
    # This ensures we filter by both genre and the game mode
    if game_mode == "multiplayer" or "online" in game_mode:
        if params.get("tags"):
            params["tags"] += ",multiplayer,online"
        else:
            if genres and any(g.lower() == "shooter" for g in genres):
                # For shooters who want multiplayer, add tactical tags
                params["tags"] = "multiplayer,online,pvp,team-based,tactical,military,war"
            else:
                params["tags"] = "multiplayer,online"
    elif game_mode == "singleplayer":
        if params.get("tags"):
            params["tags"] += ",singleplayer"
        else:
            params["tags"] = "singleplayer"
    elif "co-op" in game_mode:
        if params.get("tags"):
            params["tags"] += ",co-op,cooperative"
        else:
            params["tags"] = "co-op,cooperative,online-co-op"
    
    # =========================================================================
    # Handle game era - filter by year
    # =========================================================================
    era_settings = GAME_ERA_MAPPING.get(game_era, GAME_ERA_MAPPING["any era"])
    current_year = 2026
    
    if "min_year" in era_settings:
        params["dates"] = f"{era_settings['min_year']}-01-01,{current_year}-12-31"
    elif "max_year" in era_settings:
        params["dates"] = f"1980-01-01,{era_settings['max_year']}-12-31"
    
    # =========================================================================
    # Make the API request
    # =========================================================================
    try:
        response = requests.get(
            f"{RAWG_BASE_URL}/games",
            params={**params, "key": client_api_key},
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])
    except Exception as e:
        print(f"Error fetching games: {e}")
        return []


def get_weighted_recommendations(answers: Dict, n_recommendations: int = 5, api_key: Optional[str] = None):
    
    """
    Main function to get recommendations.
    
    This is what the API calls - it fetches games from RAWG,
    then uses the weighted tag matcher to score them.
    """

    # Fetch games from RAWG
    games = fetch_games_for_recommender(answers, api_key)
    
    if not games:
        return {
            "success": False,
            "error": "No games found matching your preferences",
            "recommendations": []
        }
    
    # Create recommender and fit on the fetched games


    recommender = WeightedTagRecommender()
    
    recommender.fit(games)
    
    # Get recommendations
    recommendations = recommender.recommend(answers, n_recommendations)
    
    return {
        "success": True,
        "recommendations": recommendations,
        "total_found": len(recommendations),
        "user_preferences": {
            "platform": answers.get("platform", ""),
            "genres": answers.get("genres", []),
            "gameMode": answers.get("gameMode", "")
        }
    }
