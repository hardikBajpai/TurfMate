from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from recommender_knn import recommender, ALL_SLOTS

app = FastAPI(
    title="TurfMate AI Recommendation Service",
    description="TurfMate AI Recommendation Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PreferenceRequest(BaseModel):
    sport: Optional[str] = "cricket"
    budget: Optional[float] = 1200.0
    location: Optional[str] = ""
    time: Optional[str] = ""
    date: Optional[str] = ""
    booked_turf_slots: Optional[Dict[str, List[str]]] = None
    live_turfs: Optional[List[Dict[str, Any]]] = None
    top_k: Optional[int] = 6

@app.get("/")
def home():
    return {
        "service": "TurfMate AI Recommendation API",
        "status": "online",
        "model": "scikit-learn AI Recommender",
        "endpoints": {
            "health": "GET /health",
            "slots": "GET /slots",
            "recommend": "POST /recommend"
        }
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "NearestNeighbors"
    }

@app.get("/slots")
def get_slots():
    return {"slots": ALL_SLOTS}

@app.post("/recommend")
def get_recommendations(req: PreferenceRequest):
    try:
        preferences = {
            "sport": req.sport,
            "budget": req.budget,
            "location": req.location,
            "time": req.time,
            "date": req.date,
            "booked_turf_slots": req.booked_turf_slots or {}
        }
        recs = recommender.recommend(
            preferences=preferences,
            live_turfs=req.live_turfs,
            top_k=req.top_k or 6
        )
        return {
            "success": True,
            "count": len(recs),
            "preferences": preferences,
            "recommendations": recs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5001, reload=True)
