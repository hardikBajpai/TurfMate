import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Dict, Any, Optional

ALL_SLOTS = [
    "06:00 AM - 08:00 AM",
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
    "08:00 PM - 10:00 PM"
]

class TurfAIRecommender:
    """
    AI Recommendation Engine for Sports Turfs.
    Encodes Price, Location, Sport/Amenities, and Time Slots into a unified
    feature space and finds the nearest matching turfs using intelligent similarity.
    """
    def __init__(self, metric: str = "euclidean"):
        self.metric = metric
        self.model = None
        self.turfs_df = None
        self.feature_matrix = None
        self.tfidf_sport = TfidfVectorizer(token_pattern=r"(?u)\b\w+\b", lowercase=True)
        self.tfidf_loc = TfidfVectorizer(token_pattern=r"(?u)\b\w+\b", lowercase=True)
        self.min_price = 500.0
        self.max_price = 3000.0

    def fit(self, turfs: List[Dict[str, Any]]):
        """Fit the AI recommendation model on a list of turf records."""
        if not turfs:
            return False

        df = pd.DataFrame(turfs)
        self.turfs_df = df.copy()

        # 1. Price Feature (Normalized 0 to 1)
        prices = df["price"].astype(float).values
        self.min_price = float(np.min(prices))
        self.max_price = float(np.max(prices))
        price_range = max(1.0, self.max_price - self.min_price)
        norm_prices = ((prices - self.min_price) / price_range).reshape(-1, 1)

        # 2. Sport / Text Content (TF-IDF from description and name)
        text_corpus = (df["name"].fillna("") + " " + df["description"].fillna("")).tolist()
        sport_features = self.tfidf_sport.fit_transform(text_corpus).toarray()

        # 3. Location Features (TF-IDF from location field)
        loc_corpus = df["location"].fillna("").tolist()
        loc_features = self.tfidf_loc.fit_transform(loc_corpus).toarray()

        # 4. Rating Feature (Default to 4.5 if not provided)
        ratings = df.get("rating", pd.Series([4.5] * len(df))).fillna(4.5).astype(float).values
        norm_ratings = (ratings / 5.0).reshape(-1, 1)

        # Weights for feature components in distance space
        W_PRICE = 2.0
        W_SPORT = 2.5
        W_LOC = 2.2
        W_RATING = 0.5

        self.feature_matrix = np.hstack([
            norm_prices * W_PRICE,
            sport_features * W_SPORT,
            loc_features * W_LOC,
            norm_ratings * W_RATING
        ])

        # Initialize and fit scikit-learn NearestNeighbors
        n_neighbors = min(len(turfs), 10)
        self.model = NearestNeighbors(
            n_neighbors=n_neighbors,
            metric=self.metric,
            algorithm="auto"
        )
        self.model.fit(self.feature_matrix)
        return True

    def recommend(
        self,
        preferences: Dict[str, Any],
        live_turfs: Optional[List[Dict[str, Any]]] = None,
        top_k: int = 6
    ) -> List[Dict[str, Any]]:
        """
        Given user preferences { sport, budget, location, time, date, booked_slots },
        returns the top_k nearest turfs with match percentages and human explanations.
        """
        if live_turfs:
            self.fit(live_turfs)

        if self.model is None or self.turfs_df is None or len(self.turfs_df) == 0:
            return []

        user_sport = str(preferences.get("sport") or "cricket").strip().lower()
        user_budget = float(preferences.get("budget") or 1200.0)
        user_loc = str(preferences.get("location") or "").strip().lower()
        user_time = str(preferences.get("time") or "").strip()
        booked_map = preferences.get("booked_turf_slots") or {}  # { turfId: [slot1, slot2] }

        # Build Query Vector
        price_range = max(1.0, self.max_price - self.min_price)
        norm_budget = np.clip((user_budget - self.min_price) / price_range, 0.0, 1.0)
        query_price = np.array([[norm_budget]])

        query_sport = self.tfidf_sport.transform([user_sport]).toarray()
        query_loc = self.tfidf_loc.transform([user_loc]).toarray() if user_loc else np.zeros((1, len(self.tfidf_loc.vocabulary_)))
        query_rating = np.array([[1.0]])  # Target best rating

        W_PRICE = 2.0
        W_SPORT = 2.5
        W_LOC = 2.2
        W_RATING = 0.5

        query_vector = np.hstack([
            query_price * W_PRICE,
            query_sport * W_SPORT,
            query_loc * W_LOC,
            query_rating * W_RATING
        ])

        # Query Nearest Neighbors
        k_neighbors = min(len(self.turfs_df), max(top_k * 2, 6))
        distances, indices = self.model.kneighbors(query_vector, n_neighbors=k_neighbors)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            turf_row = self.turfs_df.iloc[idx].to_dict()
            turf_id = str(turf_row.get("_id", ""))
            turf_price = float(turf_row.get("price", 0))
            turf_loc = str(turf_row.get("location", ""))
            turf_desc = str(turf_row.get("description", ""))

            # Calculate match reasons & fine-tune distance based on time availability
            reasons = []
            bonus = 0.0

            # 1. Budget Evaluation
            if turf_price <= user_budget:
                diff = int(user_budget - turf_price)
                if diff > 0:
                    reasons.append(f"Rs. {diff} within your budget")
                else:
                    reasons.append("Exact budget match")
                bonus += 0.10
            elif turf_price <= user_budget * 1.15:
                reasons.append("Slightly above budget")
            else:
                reasons.append(f"Premium turf (Rs. {int(turf_price)})")

            # 2. Sport Evaluation
            if user_sport in turf_desc.lower() or user_sport in turf_row.get("name", "").lower():
                reasons.append(f"Ideal for {user_sport.capitalize()}")
                bonus += 0.12

            # 3. Location Evaluation
            if user_loc and (user_loc in turf_loc.lower() or any(part in turf_loc.lower() for part in user_loc.split())):
                reasons.append(f"Near {user_loc.title()}")
                bonus += 0.15

            # 4. Time Slot Compatibility Evaluation
            time_status = "Available"
            if user_time:
                booked_for_this = booked_map.get(turf_id, [])
                if user_time in booked_for_this:
                    time_status = f"{user_time} booked (alternative slots open)"
                    reasons.append("Alternate slots available")
                else:
                    time_status = f"{user_time} available"
                    reasons.append(f"Available at {user_time}")
                    bonus += 0.12

            # Convert distance to Match Percentage (0 to 100%)
            raw_match = max(0.40, 1.0 - (dist / (np.linalg.norm(query_vector) + 1e-5)))
            adjusted_match = min(0.99, raw_match + bonus)
            match_percentage = int(round(adjusted_match * 100))

            results.append({
                "_id": turf_id,
                "name": turf_row.get("name"),
                "location": turf_loc,
                "price": turf_price,
                "description": turf_desc,
                "image": turf_row.get("image"),
                "rating": turf_row.get("rating", 4.5),
                "distance": float(round(dist, 4)),
                "match_percentage": match_percentage,
                "match_reasons": reasons[:3],
                "time_status": time_status
            })

        results.sort(key=lambda x: x["match_percentage"], reverse=True)
        return results[:top_k]

recommender = TurfAIRecommender()
