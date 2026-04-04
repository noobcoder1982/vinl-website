const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BACKEND_HOST = isLocalhost ? "localhost" : window.location.hostname;
const API_BASE = `http://${BACKEND_HOST}:5001/api`;

class AIService {
  /**
   * Get AI-powered recommendations based on a natural language query
   * @param {string} query - e.g. "I feel sad", "Upbeat coding music"
   */
  async getRecommendations(query) {
    try {
      const resp = await fetch(`${API_BASE}/ai/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      const json = await resp.json();
      
      // If the backend returns success: true and data: [songs]
      if (json.success && Array.isArray(json.data)) {
        return json.data.map(song => ({
          ...song,
          id: song.id || song._id,
          audioUrl: song.fileUrl || song.audioUrl,
          imageUrl: song.coverUrl || song.imageUrl,
          artist: "AI Recommended ✨",
        }));
      }
      
      return [];
    } catch (err) {
      console.error("AI Service error:", err);
      return [];
    }
  }

  /**
   * Determine if a query should be handled by AI instead of keyword search
   * @param {string} query 
   */
  isAIQuery(query) {
    const aiKeywords = [
      'feel', 'felt', 'sad', 'happy', 'coding', 'vibes', 'working', 
      'relax', 'nature', 'upbeat', 'slow', 'chill', 'hype', 'i ', 'me ',
      'want', 'need', 'something', 'sounds like'
    ];
    const lower = query.toLowerCase();
    // Use AI if query is long (sentences) or contains "feeling" keywords
    return lower.split(' ').length > 2 || aiKeywords.some(kw => lower.includes(kw));
  }
}

export const aiService = new AIService();
