import { SONGS, PLAYLISTS } from "../data";

/**
 * Service to handle song data fetching.
 * Currently returns data from local JSON, but structured to support future API calls.
 */
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
// Use environment variable VITE_API_URL, or fall back to local/production defaults
const API_BASE = import.meta.env.VITE_API_URL || 
                 (isLocalhost ? "http://localhost:5001/api" : "https://vinl-backend.onrender.com/api"); 

class SongService {
  logError(error, context = "Network") {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`[${timestamp}] SongService ${context} Failure:`, error);
  }

  async getSongs() {
    try {
      const resp = await fetch(`${API_BASE}/songs`);
      const json = await resp.json();
      
      const songs = (json.data || []).map(song => {
        // Map backend properties to frontend names
        const mapped = {
          ...song,
          id: song.id || song._id,
          audioUrl: song.fileUrl || song.audioUrl,
          imageUrl: song.coverUrl || song.imageUrl,
          artist: "Generated from Suno ✨", // Global artist override
        };

        // Convert "M:SS" string duration to seconds if it's a string
        if (typeof song.duration === 'string' && song.duration.includes(':')) {
          const [m, s] = song.duration.split(':').map(Number);
          mapped.duration = (m * 60) + s;
        }

        return mapped;
      });

      return songs;
    } catch (err) {
      this.logError(err, "Get Songs");
      return SONGS; // Fallback to local if server is down
    }
  }

  async getSongById(id) {
    try {
      const resp = await fetch(`${API_BASE}/songs/${id}`);
      const json = await resp.json();
      return json.data;
    } catch (err) {
      this.logError(err, "Get Song By ID");
      return SONGS.find(s => s.id === id);
    }
  }

  async getPlaylists() {
    try {
      const resp = await fetch(`${API_BASE}/playlists`);
      const json = await resp.json();
      return json.data || [];
    } catch (err) {
      this.logError(err, "Get Playlists");
      return PLAYLISTS;
    }
  }

  async searchSongs(query) {
    // Basic local filter for now, but hits backend first
    const songs = await this.getSongs();
    const lowerQuery = query.toLowerCase();
    return songs.filter(s => 
      s.title.toLowerCase().includes(lowerQuery) || 
      s.artist.toLowerCase().includes(lowerQuery) ||
      s.genre.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Record a play for a song
   */
  async recordPlay(songId, userId) {
    try {
      const resp = await fetch(`${API_BASE}/songs/${songId}/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      return await resp.json();
    } catch (err) {
      this.logError(err, "Record Play");
      return null;
    }
  }
}

export const songService = new SongService();
