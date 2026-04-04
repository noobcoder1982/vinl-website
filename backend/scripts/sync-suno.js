import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import * as musicMetadata from 'music-metadata';
import dotenv from 'dotenv';
import Song from '../src/models/Song.js';

// Setup environment and paths
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LIBRARY_PATH = path.join(__dirname, '../suno-library');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper to format duration (ms to M:SS)
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

async function syncMusic() {
  try {
    console.log('--- Connecting to Database ---');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    if (!fs.existsSync(LIBRARY_PATH)) {
      fs.mkdirSync(LIBRARY_PATH);
      console.log('📁 Created suno-library folder. Put your Suno tracks there categorized by mood folders.');
      return;
    }

    const moods = fs.readdirSync(LIBRARY_PATH).filter(f => fs.statSync(path.join(LIBRARY_PATH, f)).isDirectory());
    
    if (moods.length === 0) {
        console.log('⚠️  No mood folders found in suno-library. Create folders like "Chill", "Banger", "Hindi" to get started.');
        return;
    }

    for (const mood of moods) {
      const moodPath = path.join(LIBRARY_PATH, mood);
      const files = fs.readdirSync(moodPath).filter(f => f.endsWith('.mp3'));

      console.log(`\n📂 Syncing mood: [${mood}] (${files.length} tracks found)`);

      for (const file of files) {
        const filePath = path.join(moodPath, file);
        const songName = path.parse(file).name;

        // Check if song already exists
        const existingSong = await Song.findOne({ title: songName, genre: mood });
        if (existingSong) {
          console.log(`⏭️  Skipping: ${songName} (Already in DB)`);
          continue;
        }

        console.log(`🚀 Uploading: ${songName}...`);
        
        // 1. Extract metadata
        const metadata = await musicMetadata.parseFile(filePath);
        const durationStr = formatDuration(metadata.format.duration || 0);

        // 2. Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          resource_type: 'video', // Audio files are 'video' in Cloudinary API
          folder: `suno_library/${mood}`,
          public_id: songName.replace(/\s+/g, '_')
        });

        // 3. Save to MongoDB
        await Song.create({
          title: songName,
          artist: 'Suno AI',
          album: `Suno ${mood} Collection`,
          genre: mood,
          duration: durationStr,
          fileUrl: uploadResult.secure_url,
          coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000' // High-quality generic vinyl/music cover
        });

        console.log(`✅ Success: ${songName} is now live!`);
      }
    }

    console.log('\n--- Sync Complete! ---');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR during sync:', error);
    process.exit(1);
  }
}

syncMusic();
