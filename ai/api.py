"""
Honours Stage Project - Video Game Recommendation System
======================================================

A machine learning based recommendation system that uses content-based filtering
with weighted tag matching to recommend video games based on user preferences 
from a questionnaire.

"""

import os
from flask import Flask, request, jsonify
from engine import get_recommendations as get_knn_recommendations
from weightsForRecommender import get_weighted_recommendations

app = Flask(__name__)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Get RAWG API key
RAWG_API_KEY = os.getenv("RAWG_API_KEY", "")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "recommendation-engine"
    })


@app.route('/recommend', methods=['POST'])
def recommend():
    """
    Main recommendation endpoint.
    
    Uses a hybrid approach combining:
    1. KNN-based collaborative filtering from engine.py
    2. Weighted tag matching from weightsForRecommender.py
    
    This combines both ML (KNN) and content-based filtering for better results.
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
        
        answers = data.get('answers', {})
        limit = data.get('limit', 5)
        
        if not answers:
            return jsonify({
                "success": False,
                "error": "No user answers provided"
            }), 400
        
        # Get recommendations from BOTH approaches
        
        # 1. KNN-based recommendations (from engine.py)
        knn_result = get_knn_recommendations(
            answers=answers,
            n_recommendations=limit * 2,
            api_key=RAWG_API_KEY
        )
        
        # 2. Weighted tag matching recommendations
        weighted_result = get_weighted_recommendations(
            answers=answers,
            n_recommendations=limit * 2,
            api_key=RAWG_API_KEY
        )
        
        # Combine both results
        combined_recommendations = combine_recommendations(
            knn_result.get('recommendations', []),
            weighted_result.get('recommendations', []),
            limit
        )
        
        if not combined_recommendations:
            return jsonify({
                "success": False,
                "error": "No games found matching your preferences",
                "recommendations": []
            }), 400
        
        return jsonify({
            "success": True,
            "recommendations": combined_recommendations,
            "total_found": len(combined_recommendations),
            "user_preferences": answers,
            "method": "hybrid (KNN + weighted tag matching)"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


def combine_recommendations(knn_recs, weighted_recs, limit):
    """
    Combine recommendations from KNN and weighted tag matching.
    Uses a weighted average: 40% KNN + 60% weighted tag matching.
    """
    # Create a dictionary to store combined scores
    combined = {}
    
    # Process KNN recommendations (weight: 40%)
    for rec in knn_recs:
        game_id = rec.get('id')
        if game_id:
            combined[game_id] = {
                'id': game_id,
                'name': rec.get('name'),
                'released': rec.get('released'),
                'rating': rec.get('rating'),
                'background_image': rec.get('background_image'),
                'genres': rec.get('genres', []),
                'platforms': rec.get('platforms', []),
                'metacritic': rec.get('metacritic'),
                'knn_score': rec.get('final_score', 0) * 0.4,
                'weighted_score': 0,
                'match_percentage': rec.get('match_percentage', 0)
            }
    
    # Process weighted recommendations (weight: 60%)
    for rec in weighted_recs:
        game_id = rec.get('id')
        if game_id:
            if game_id in combined:
                # Game already exists, add weighted score
                combined[game_id]['weighted_score'] = rec.get('final_score', 0) * 0.6
                combined[game_id]['match_percentage'] = max(
                    combined[game_id].get('match_percentage', 0),
                    rec.get('match_percentage', 0)
                )
            else:
                combined[game_id] = {
                    'id': game_id,
                    'name': rec.get('name'),
                    'released': rec.get('released'),
                    'rating': rec.get('rating'),
                    'background_image': rec.get('background_image'),
                    'genres': rec.get('genres', []),
                    'platforms': rec.get('platforms', []),
                    'metacritic': rec.get('metacritic'),
                    'knn_score': 0,
                    'weighted_score': rec.get('final_score', 0) * 0.6,
                    'match_percentage': rec.get('match_percentage', 0)
                }
    
    # Calculate final scores and sort
    results = []
    for game_id, data in combined.items():
        final_score = data['knn_score'] + data['weighted_score']
        results.append({
            'id': data['id'],
            'name': data['name'],
            'released': data['released'],
            'rating': data['rating'],
            'background_image': data['background_image'],
            'genres': data['genres'],
            'platforms': data['platforms'],
            'metacritic': data['metacritic'],
            'similarity_score': round(final_score / 100, 3),
            'match_percentage': data['match_percentage'],
            'final_score': round(final_score)
        })
    
    # Sort by final score
    results.sort(key=lambda x: x['final_score'], reverse=True)
    
    return results[:limit]


@app.route('/recommend/knn', methods=['POST'])
def recommend_knn():
    """KNN-only endpoint for comparison."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
        
        answers = data.get('answers', {})
        limit = data.get('limit', 5)
        
        if not answers:
            return jsonify({
                "success": False,
                "error": "No user answers provided"
            }), 400
        
        result = get_knn_recommendations(
            answers=answers,
            n_recommendations=limit,
            api_key=RAWG_API_KEY
        )
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
