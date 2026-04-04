import Invite from '../models/Invite.js';
import User from '../models/User.js';
import Follow from '../models/Follow.js';

/**
 * Send an invitation (Blend or Follow).
 */
export const sendInvite = async (req, res, next) => {
  try {
    const { toUsername, roomCode, type } = req.body;
    const fromUser = req.user._id;

    const toUser = await User.findOne({ username: toUsername });
    if (!toUser) return res.status(404).json({ success: false, message: 'Recipient not found' });
    if (toUser._id.equals(fromUser)) return res.status(400).json({ success: false, message: 'You cannot invite yourself' });

    // Handle existing follow requests
    if (type === 'follow') {
       const existingFollow = await Follow.findOne({ follower: fromUser, following: toUser._id });
       if (existingFollow) return res.status(400).json({ success: false, message: 'Already followed' });
    }

    const invite = await Invite.create({
      fromUser,
      toUser: toUser._id,
      roomCode: type === 'follow' ? null : roomCode,
      type: type || 'blend'
    });

    res.status(201).json({ success: true, data: invite });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all pending invites for the current user.
 */
export const getMyInvites = async (req, res, next) => {
  try {
    const invitations = await Invite.find({ toUser: req.user._id, status: 'pending' })
      .populate('fromUser', 'username profilePicture email')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: invitations });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invites sent BY the current user.
 */
export const getSentInvites = async (req, res, next) => {
  try {
    const invitations = await Invite.find({ fromUser: req.user._id })
      .populate('toUser', 'username profilePicture')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: invitations });
  } catch (error) {
    next(error);
  }
};

/**
 * Update invite status (Accept/Decline).
 */
export const updateInviteStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const invite = await Invite.findOneAndUpdate(
       { _id: req.params.inviteId, toUser: req.user._id },
       { status },
       { new: true }
    );

    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });

    // Logic for successful follow
    if (invite.type === 'follow' && status === 'accepted') {
       await Follow.create({ follower: invite.fromUser, following: invite.toUser, status: 'accepted' });
    }

    res.status(200).json({ success: true, data: invite });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an invite.
 */
export const deleteInvite = async (req, res, next) => {
  try {
    const invite = await Invite.findOneAndDelete({ 
       _id: req.params.inviteId, 
       $or: [{ toUser: req.user._id }, { fromUser: req.user._id }] 
    });
    
    if (!invite) {
      return res.status(404).json({ success: false, message: 'Invite not found' });
    }

    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};
