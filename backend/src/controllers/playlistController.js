import Playlist from '../models/Playlist.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Get all playlists
// @route   GET /api/playlists
// @access  Public
export const getPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({}).populate('songs');
    sendSuccess(res, playlists, 'Playlists retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get single playlist
// @route   GET /api/playlists/:id
// @access  Public
export const getPlaylistById = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }
    sendSuccess(res, playlist, 'Playlist retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new playlist
// @route   POST /api/playlists
// @access  Public
export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const playlist = await Playlist.create({
      name,
      description
    });

    sendSuccess(res, playlist, 'Playlist created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Public
export const updatePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('songs');

    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    sendSuccess(res, playlist, 'Playlist updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Public
export const deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    await Playlist.deleteOne({ _id: playlist._id });
    
    sendSuccess(res, {}, 'Playlist removed successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Public
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.body;
    
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    if (playlist.songs.includes(songId)) {
      res.status(400);
      throw new Error('Song already in playlist');
    }

    playlist.songs.push(songId);
    await playlist.save();
    
    const updatedPlaylist = await Playlist.findById(req.params.id).populate('songs');
    sendSuccess(res, updatedPlaylist, 'Song added to playlist');
  } catch (error) {
    next(error);
  }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Public
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    playlist.songs = playlist.songs.filter(
      (id) => id.toString() !== req.params.songId
    );
    
    await playlist.save();
    
    const updatedPlaylist = await Playlist.findById(req.params.id).populate('songs');
    sendSuccess(res, updatedPlaylist, 'Song removed from playlist');
  } catch (error) {
    next(error);
  }
};
