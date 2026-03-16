"""
RAWG API Client
==============

Handles all communication with the RAWG Video Games Database API.
This is where we fetch game data for our recommendations.

For my Honours project using RAWG as our game database
"""

import os
import requests
from typing import List, Dict, Any, Optional

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from config import (
    RAWG_BASE_URL,
    GENRE_SLUGS,
    PLATFORM_IDS,
    GAME_ERA_MAPPING,
    GAME_MODE_TAGS,
    MILITARY_SHOOTER_TAGS
)

# Get API key
RAWG_API_KEY = os.getenv("RAWG_API_KEY", "")

# Genre to tags mapping - helps with genres RAWG doesn't have
GENRE_TO_TAGS = {
    "horror": "horror,scary,zombie,supernatural",
}

# Enhanced tags for each genre - makes recommendations better
GENRE_ENHANCED_TAGS = {
    "action": "action,fighting,beat-em-up,hack-and-slash",
    "adventure": "adventure,story,exploration",
    "rpg": "rpg,role-playing,turn-based,real-time",
    "shooter": "shooter,fps,tps,shooting,military,war,tactical,pvp",
    "strategy": "strategy,turn-based,real-time-strategy",
    "simulation": "simulation,building,management",
    "sports": "sports,football,basketball,soccer",
    "indie": "indie,alternative,artistic",
    "horror": "horror,scary,zombie,supernatural",
    "puzzle": "puzzle,logic,brain-teaser",
    "racing": "racing,driving,arcade",
    "fighting": "fighting,beat-em-up,martial-arts",
    "board": "board-games,card,strategy"
}

# Ordering options for RAWG API
RAWG_ORDERING_OPTIONS = {
    "popularity": "-popularity",
    "rating": "-rating",
    "released": "-released",
    "metacritic": "-metacritic",
}


class RAWGClient:
    """Client for interacting with RAWG API."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or RAWG_API_KEY
        self.base_url = RAWG_BASE_URL
        
    def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        """Make a request to the RAWG API."""
        if not self.api_key:
            raise ValueError("RAWG API key not provided")
            
        url = f"{self.base_url}/{endpoint}"
        
        if params is None:
            params = {}
        params["key"] = self.api_key
        
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        
        return response.json()
    
    def get_games(self, genres=None, platforms=None, dates=None, 
                  ordering="-rating", tags=None, page_size=50, page=1):
        """
        Get games with optional filtering.
        
        Uses genres, tags, platforms, and dates to filter results.
        """
        params = {
            "ordering": ordering,
            "page_size": page_size,
            "page": page
        }
        
        # Handle genres
        if genres:
            genre_slugs = []
            for g in genres:
                genre_lower = g.lower()
                slug = GENRE_SLUGS.get(genre_lower, genre_lower)
                slug = slug.replace(" ", "-")
                genre_slugs.append(slug)
            params["genres"] = ",".join(genre_slugs[:2])
        
        # Handle tags
        if tags:
            params["tags"] = tags
        
        # Handle platforms
        if platforms:
            params["platforms"] = platforms
            
        # Handle dates
        if dates:
            params["dates"] = dates

        try:
            data = self._make_request("games", params)
            return data.get("results", [])
        except requests.RequestException as e:
            print(f"Error fetching games: {e}")
            return []
    
    def get_game_details(self, game_id: int) -> Dict:
        """Get detailed info about a specific game."""
        try:
            return self._make_request(f"games/{game_id}", {})
        except:
            return {}


def build_query_params(answers: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build query parameters from user answers.
    
    This converts our questionnaire answers into something
    the RAWG API can understand.
    """
    params = {
        "page_size": 60,
        "ordering": "-rating"
    }
    
    # Handle game era
    game_era = answers.get("gameEra", "any era").lower()
    era_settings = GAME_ERA_MAPPING.get(game_era, GAME_ERA_MAPPING["any era"])
    
    current_year = 2026
    
    if "min_year" in era_settings:
        params["dates"] = f"{era_settings['min_year']}-01-01,{current_year}-12-31"
    elif "max_year" in era_settings:
        params["dates"] = f"1980-01-01,{era_settings['max_year']}-12-31"
    
    if "ordering" in era_settings:
        params["ordering"] = era_settings["ordering"]
    
    # Handle genres - use BOTH genres AND tags for better results
    genres = answers.get("genres", [])
    if genres:
        genre_slugs = []
        all_tags = []
        
        # For genre combinations like Shooter + Simulation, we prioritize
        # the more relevant genre and use tags for the rest (RAWG uses AND filter)
        genre_lower_list = [g.lower() for g in genres]
        
        # If combining shooter with simulation, just use shooter with military tags
        # because tactical shooters like Arma, Squad are in Shooter genre
        if "shooter" in genre_lower_list and "simulation" in genre_lower_list:
            # Prioritize shooter with military/simulation tags
            genre_slugs.append("shooter")
            all_tags.append("shooter,fps,tps,military,war,tactical,simulation,team-based,pvp,multiplayer")
        else:
            # Normal processing for other genre combinations
            for g in genres[:2]:
                genre_lower = g.lower()
                
                # Check if genre needs tags instead
                if genre_lower in GENRE_TO_TAGS:
                    all_tags.append(GENRE_TO_TAGS[genre_lower])
                else:
                    slug = GENRE_SLUGS.get(genre_lower, genre_lower)
                    slug = slug.replace(" ", "-")
                    genre_slugs.append(slug)
                    
                    # Add enhanced tags
                    if genre_lower in GENRE_ENHANCED_TAGS:
                        all_tags.append(GENRE_ENHANCED_TAGS[genre_lower])
        
        if genre_slugs:
            params["genres"] = ",".join(genre_slugs)
        if all_tags:
            params["tags"] = ",".join(all_tags)
    
    # Handle game mode - add tags for multiplayer/singleplayer filtering
    game_mode = answers.get("gameMode", "").lower()
    if game_mode:
        # Check for exact match first
        if game_mode in GAME_MODE_TAGS:
            mode_tags = GAME_MODE_TAGS[game_mode]
            if params.get("tags"):
                # Combine with existing tags
                existing = params["tags"].split(",")
                new_tags = mode_tags.split(",")
                # Merge without duplicates
                combined = list(set(existing + new_tags))
                params["tags"] = ",".join(combined)
            else:
                params["tags"] = mode_tags
        # Handle various multiplayer descriptions
        elif "multiplayer" in game_mode or "online" in game_mode:
            # Add military/tactical tags if it's a shooter genre
            if genres and any(g.lower() == "shooter" for g in genres):
                multiplayer_tags = "multiplayer,online,pvp,team-based,military,war,tactical"
            else:
                multiplayer_tags = "multiplayer,online"
            
            if params.get("tags"):
                existing = params["tags"].split(",")
                new_tags = multiplayer_tags.split(",")
                combined = list(set(existing + new_tags))
                params["tags"] = ",".join(combined)
            else:
                params["tags"] = multiplayer_tags
        # Singleplayer
        elif "single" in game_mode:
            if params.get("tags"):
                params["tags"] = params["tags"] + ",singleplayer"
            else:
                params["tags"] = "singleplayer"
        # Co-op
        elif "co-op" in game_mode or "coop" in game_mode:
            if params.get("tags"):
                params["tags"] = params["tags"] + ",co-op,online-co-op"
            else:
                params["tags"] = "co-op,online-co-op"
    
    # Handle platform
    platform = answers.get("platform", "")
    if platform:
        platform_id = PLATFORM_IDS.get(platform.lower())
        if platform_id:
            params["platforms"] = platform_id
    
    return params


def get_games_for_recommendation(answers: Dict[str, Any], api_key: Optional[str] = None):
    """
    Main function to get games for recommendations.
    
    Takes user answers, queries RAWG API, returns game list.
    """
    client = RAWGClient(api_key)
    
    if not client.api_key:
        print("Warning: RAWG_API_KEY not set")
        return get_mock_games()
    
    genres = answers.get("genres", [])
    game_mode = answers.get("gameMode", "").lower()
    
    # Build query
    params = build_query_params(answers)
    
    # Special handling for tactical/military shooter requests
    # If user wants shooter + multiplayer, also search for tactical games
    if genres and any(g.lower() == "shooter" for g in genres):
        if game_mode in ["multiplayer", "online"] or "multiplayer" in game_mode:
            # Add tactical and military tags - but keep it clean to avoid API errors
            tactical_params = params.copy()
            if tactical_params.get("tags"):
                # Add military/tactical but avoid duplicates
                existing = set(tactical_params["tags"].split(","))
                existing.update(["tactical", "military", "war", "pvp", "team-based"])
                tactical_params["tags"] = ",".join(list(existing)[:10])  # Limit to 10 tags
            else:
                tactical_params["tags"] = "tactical,military,war,pvp,team-based"
            
            # Try fetching tactical games
            tactical_games = client.get_games(
                genres=params.get("genres", "").split(",") if params.get("genres") else None,
                platforms=params.get("platforms"),
                dates=params.get("dates"),
                ordering=params.get("ordering", "-rating"),
                tags=tactical_params.get("tags"),
                page_size=40
            )
            
            print(f"[DEBUG] Tactical games found: {len(tactical_games)}")
            print(f"[DEBUG] tactical_games type: {type(tactical_games)}, bool: {bool(tactical_games)}")
            
            if tactical_games and len(tactical_games) > 0:
                print("[DEBUG] Entering tactical_games block")
                # Fetch regular games too
                regular_games = client.get_games(
                    genres=params.get("genres", "").split(",") if params.get("genres") else None,
                    platforms=params.get("platforms"),
                    dates=params.get("dates"),
                    ordering=params.get("ordering", "-rating"),
                    tags=params.get("tags"),
                    page_size=40
                )
                
                # Combine and deduplicate
                all_games = {}
                for g in tactical_games + regular_games:
                    all_games[g.get("id")] = g
                
                game_list = list(all_games.values())
                return game_list
    
    # Fetch games
    games = client.get_games(
        genres=params.get("genres", "").split(",") if params.get("genres") else None,
        platforms=params.get("platforms"),
        dates=params.get("dates"),
        ordering=params.get("ordering", "-rating"),
        tags=params.get("tags"),
        page_size=60
    )
    
    # Try again without platform filter if no results
    if not games and params.get("platforms"):
        params.pop("platforms", None)
        games = client.get_games(
            genres=params.get("genres", "").split(",") if params.get("genres") else None,
            dates=params.get("dates"),
            ordering=params.get("ordering", "-rating"),
            tags=params.get("tags"),
            page_size=60
        )
    
    # Try with just genres/tags if still no results
    if not games and (params.get("genres") or params.get("tags")):
        games = client.get_games(
            genres=params.get("genres", "").split(",") if params.get("genres") else None,
            tags=params.get("tags"),
            page_size=60
        )
    
    # Try tags only as last resort
    if not games and params.get("tags"):
        games = client.get_games(
            tags=params.get("tags"),
            page_size=60
        )
    
    return games if games else get_mock_games()


def get_mock_games():
    """
    Fallback mock data when API is unavailable.
    Just some popular games for testing.
    """
    return [
        {
            "id": 3328,
            "name": "The Witcher 3: Wild Hunt",
            "released": "2015-05-18",
            "rating": 4.64,
            "background_image": "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
            "genres": [
                {"name": "Action", "slug": "action"},
                {"name": "Adventure", "slug": "adventure"},
                {"name": "RPG", "slug": "role-playing-games-rpg"}
            ],
            "platforms": [
                {"platform": {"name": "PC"}},
                {"platform": {"name": "PlayStation 5"}},
                {"platform": {"name": "Xbox One"}}
            ],
            "tags": [
                {"slug": "singleplayer"},
                {"slug": "story"},
                {"slug": "open-world"},
                {"slug": "rpg"}
            ],
            "metacritic": 92
        }
    ]
