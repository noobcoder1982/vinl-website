import Song from '../models/Song.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
export const getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find({});
    sendSuccess(res, songs, 'Songs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get single song
// @route   GET /api/songs/:id
// @access  Public
export const getSongById = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      res.status(404);
      throw new Error('Song not found');
    }
    sendSuccess(res, song, 'Song retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new song
// @route   POST /api/songs
// @access  Public (for now)
export const createSong = async (req, res, next) => {
  try {
    const { title, artist, album, genre, duration, fileUrl, coverUrl } = req.body;

    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      duration,
      fileUrl,
      coverUrl
    });

    sendSuccess(res, song, 'Song created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update song
// @route   PUT /api/songs/:id
// @access  Public
export const updateSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!song) {
      res.status(404);
      throw new Error('Song not found');
    }

    sendSuccess(res, song, 'Song updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete song
// @route   DELETE /api/songs/:id
// @access  Public
export const deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      res.status(404);
      throw new Error('Song not found');
    }

    // Use deleteOne instead of remove built-in helper
    await Song.deleteOne({ _id: song._id });
    
    sendSuccess(res, {}, 'Song removed successfully');
  } catch (error) {
    next(error);
  }
};
// @desc    Record a play
// @route   POST /api/songs/:id/play
// @access  Public
export const recordPlay = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const song = await Song.findById(req.params.id);
    if (!song) {
      res.status(404);
      throw new Error('Song not found');
    }

    // 1. Increment global song plays
    song.plays = (song.plays || 0) + 1;
    await song.save();

    // 2. Track per-user plays and auto-fav if userId provided
    if (userId) {
       const user = await User.findById(userId);
       if (user) {
          // Initialize playHistory if it doesn't exist
          if (!user.playHistory) user.playHistory = new Map();
          
          const songIdStr = song._id.toString();
          const currentCount = user.playHistory.get(songIdStr) || 0;
          const newCount = currentCount + 1;
          
          user.playHistory.set(songIdStr, newCount);

          // Auto-like if count reaches 3
          const isAlreadyLiked = user.likedSongs.some(id => id.toString() === songIdStr);
          if (newCount >= 3 && !isAlreadyLiked) {
             user.likedSongs.push(song._id);
          }

          await user.save();
       }
    }

    sendSuccess(res, { 
      song, 
      isAutoFavorite: userId ? (user.playHistory.get(song._id.toString()) === 3) : false 
    }, 'Play recorded');
  } catch (error) {
    next(error);
  }
};
