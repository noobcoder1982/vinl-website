import express from 'express';
import { getSongs, getSongById, createSong, updateSong, deleteSong, recordPlay } from '../controllers/songController.js';

const router = express.Router();

router.route('/')
  .get(getSongs)
  .post(createSong);

router.post('/:id/play', recordPlay);

router.route('/:id')
  .get(getSongById)
  .put(updateSong)
  .delete(deleteSong);

export default router;
