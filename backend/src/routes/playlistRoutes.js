import express from 'express';
import {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/playlistController.js';

const router = express.Router();

router.route('/')
  .get(getPlaylists)
  .post(createPlaylist);

router.route('/:id')
  .get(getPlaylistById)
  .put(updatePlaylist)
  .delete(deletePlaylist);

router.route('/:id/songs')
  .post(addSongToPlaylist);

router.route('/:id/songs/:songId')
  .delete(removeSongFromPlaylist);

export default router;
