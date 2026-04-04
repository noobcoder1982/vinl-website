import axios from 'axios';
import Song from '../models/Song.js';
import { sendSuccess, sendError } from '../utils/response.js';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

/**
 * @desc    Get AI recommendations for a query
 * @route   POST /api/ai/recommend
 * @access  Public
 */
export const getAIRecommendations = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return sendError(res, 'Query is required', 400);
    }

    // 1. Fetch available songs to provide context to the LLM
    const songs = await Song.find({});
    
    // Create a compact list of titles and genres so the LLM knows what we have
    const songContext = songs.map(s => ({
      id: s._id,
      title: s.title,
      artist: s.artist,
      genre: s.genre,
      tags: s.tags
    }));

    // 2. Prepare the prompt for the NVIDIA LLM
    const systemPrompt = `You are a music discovery AI. The user will give you a mood, feeling, or a specific topic. You must recommend the best songs from our library that match this. 
    
    IMPORTANT: Even if a song doesn't have an explicit 'happy' or 'sad' tag, use your knowledge of the GENRE and ARTIST to infer the vibe. (e.g. Ambient = Relaxing, Phonk = Hype/Aggressive).
    
    OUR LIBRARY: ${JSON.stringify(songContext)}
    
    RESPONSE FORMAT: You MUST return ONLY a JSON array of Song IDs from our library that best match the user's request. Max 10 IDs. No conversational text.
    Example response: ["65a123...", "65b456..."]`;

    // 3. Call NVIDIA Llama-3 via axios
    const response = await axios.post(
      NVIDIA_API_URL,
      {
        model: "meta/llama-3.1-405b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `I feel: ${query}` }
        ],
        temperature: 0.2,
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    // 4. Parse LLM response and fetch full song objects
    let recommendedIds = [];
    try {
      const content = response.data.choices[0].message.content;
      // Extract IDs from LLM output (some LLMs might wrap it in a JSON object)
      const parsed = JSON.parse(content);
      recommendedIds = Array.isArray(parsed) ? parsed : (parsed.ids || parsed.recommendations || []);
    } catch (parseErr) {
      console.error("LLM Parsing error:", parseErr);
      return sendError(res, 'Failed to determine recommendations', 500);
    }

    // 5. Fetch full songs in the order returned by the AI
    const recommendedSongs = await Song.find({ _id: { $in: recommendedIds } });
    
    // Sort to match LLM order if possible
    const sortedSongs = recommendedIds
      .map(id => recommendedSongs.find(s => s._id.toString() === id.toString()))
      .filter(s => s != null);

    sendSuccess(res, sortedSongs, `AI recommendations for: ${query}`);
  } catch (error) {
    if (error.response) {
      console.error("NVIDIA API Error:", error.response.data);
    }
    next(error);
  }
};
