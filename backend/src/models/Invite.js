import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomCode: {
    type: String,
    required: function() { return this.type !== 'follow'; }
  },
  type: {
    type: String,
    enum: ['blend', 'live', 'follow'],
    default: 'blend'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Automatically delete after 24 hours
  }
}, { timestamps: true });

export default mongoose.model('Invite', inviteSchema);
