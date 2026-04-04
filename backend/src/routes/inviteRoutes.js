import express from 'express';
import { sendInvite, getMyInvites, updateInviteStatus, deleteInvite } from '../controllers/inviteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All invite routes are protected (must be logged in)
router.use(protect);

router.post('/send', sendInvite);
router.get('/my', getMyInvites);
router.put('/:inviteId/status', updateInviteStatus);
router.delete('/:inviteId', deleteInvite);

export default router;
