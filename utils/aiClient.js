const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";

/**
 * Fetch AI-powered turf recommendations from the Python microservice
 * @param {Object} preferences - { sport, budget, location, time, date, booked_turf_slots, top_k }
 * @param {Array} liveTurfs - Array of turf documents from MongoDB
 * @returns {Promise<Array>} List of recommended turfs with match percentages & reasons
 */
async function getRecommendations(preferences = {}, liveTurfs = []) {
    const payload =
    {
        sport: preferences.sport || "cricket",
        budget: Number(preferences.budget) || 1200,
        location: preferences.location || "",
        time: preferences.time || "",
        date: preferences.date || "",
        booked_turf_slots: preferences.booked_turf_slots || {},
        top_k: Number(preferences.top_k) || 6,
        live_turfs: liveTurfs && liveTurfs.length > 0 ? liveTurfs.map(t => ({
            _id: t._id ? t._id.toString() : "",
            name: t.name || "",
            location: t.location || "",
            price: Number(t.price) || 0,
            description: t.description || "",
            image: t.image ? (t.image.url || t.image) : "",
            rating: 4.5
        })) : null
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${ML_SERVICE_URL}/recommend`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`ML Service responded with HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.recommendations || [];
    }
    catch (err) {
        console.warn(`[AI Recommendation Fallback] Python ML service unreachable (${err.message}). Using built-in fallback.`);
        return getFallbackAIRecommendations(preferences, liveTurfs);
    }
}

const COORDINATES_MAP =
{
    "swaroop nagar": [26.4735, 80.3204],
    "kidwai nagar": [26.4350, 80.3340],
    "harsh nagar": [26.4710, 80.3250],
    "govind nagar": [26.4440, 80.3010],
    "hazratganj": [26.8467, 80.9462],
    "aliganj": [26.8920, 80.9380],
    "kanpur": [26.4499, 80.3319],
    "lucknow": [26.8467, 80.9462]
};

const DEFAULT_COORDINATES = [26.4499, 80.3319];

function getCoordinates(locationStr) {
    if (!locationStr) return DEFAULT_COORDINATES;
    const clean = locationStr.toLowerCase().trim();
    const sortedKeys = Object.keys(COORDINATES_MAP).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (clean.includes(key)) {
            return COORDINATES_MAP[key];
        }
    }
    return DEFAULT_COORDINATES;
}

function haversineDistance(coord1, coord2) {
    const R = 6371.0;
    const toRad = deg => (deg * Math.PI) / 180.0;
    const lat1 = toRad(coord1[0]);
    const lon1 = toRad(coord1[1]);
    const lat2 = toRad(coord2[0]);
    const lon2 = toRad(coord2[1]);
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
    const a = Math.sin(dlat / 2.0) ** 2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dlon / 2.0) ** 2);
    const c = 2.0 * Math.asin(Math.sqrt(Math.max(0, Math.min(1, a))));
    return Math.round(R * c * 100) / 100;
}

/**
 * Resilient in-memory fallback in case Python service is offline
 */
function getFallbackAIRecommendations(preferences, turfs) {
    if (!turfs || turfs.length === 0) return [];
    const sport = (preferences.sport || "").toLowerCase().trim();
    const budget = Number(preferences.budget) || 1200;
    const location = (preferences.location || "").toLowerCase().trim();
    const time = (preferences.time || "").trim();
    const bookedMap = preferences.booked_turf_slots || {};
    const userCoords = getCoordinates(location);

    return turfs.map(t => {
        let score = 0.65;
        const reasons = [];

        const desc = (t.description || "").toLowerCase();
        const loc = (t.location || "").toLowerCase();
        const name = (t.name || "").toLowerCase();

        // 1. Sport
        if (sport && (desc.includes(sport) || name.includes(sport))) {
            score += 0.12;
            reasons.push(`Ideal for ${preferences.sport}`);
        }

        // 2. Budget
        if (t.price <= budget) {
            score += 0.10;
            const diff = budget - t.price;
            reasons.push(diff > 0 ? `Rs. ${diff} within budget` : "Exact budget match");
        }
        else if (t.price <= budget * 1.15) {
            score += 0.04;
            reasons.push("Slightly above budget");
        }

        // 3. Geodesic Location (Haversine Formula)
        const turfCoords = getCoordinates(t.location);
        const distKm = haversineDistance(userCoords, turfCoords);

        if (location) {
            if (distKm <= 2.5) {
                score += 0.18;
                reasons.push(`Nearby (${distKm} km away)`);
            }
            else if (distKm <= 6.0) {
                score += 0.12;
                reasons.push(`Close by (${distKm} km away)`);
            }
            else if (distKm <= 15.0) {
                score += 0.06;
                reasons.push(`${distKm} km away`);
            }
            else {
                reasons.push(`${distKm} km away`);
            }
        }

        // 4. Time
        let timeStatus = "Available";
        if (time) {
            const turfId = t._id ? t._id.toString() : "";
            const bookedForThis = bookedMap[turfId] || [];
            if (bookedForThis.includes(time)) {
                timeStatus = `${time} booked`;
                reasons.push("Alternate slots open");
            }
            else {
                score += 0.10;
                timeStatus = `${time} available`;
                reasons.push(`Available at ${time}`);
            }
        }

        if (reasons.length === 0) {
            reasons.push("Popular Choice");
        }

        const match_percentage = Math.min(98, Math.round(score * 100));

        return {
            _id: t._id ? t._id.toString() : "",
            name: t.name,
            location: t.location,
            price: t.price,
            rating: 4.5,
            description: t.description,
            image: t.image ? (t.image.url || t.image) : "",
            match_percentage,
            match_reasons: reasons.slice(0, 3),
            distance_km: distKm,
            time_status: timeStatus
        };
    }).sort((a, b) => b.match_percentage - a.match_percentage).slice(0, preferences.top_k || 6);
}

module.exports =
{
    getRecommendations
};
