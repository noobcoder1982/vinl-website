import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    default: 'Unknown Album'
  },
  genre: {
    type: String,
    default: 'Unknown Genre'
  },
  tags: {
    type: [String],
    default: []
  },
  duration: {
    type: String, // e.g. "3:45"
    required: true
  },
  fileUrl: {
    type: String, // URL/path to the actual audio file
    required: true
  },
  coverUrl: {
    type: String, // URL to the album/song cover art
    default: ''
  },
  plays: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);
export default Song;
