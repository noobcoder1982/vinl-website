import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../src/models/Song.js';

dotenv.config();

const MOODS = ['happy', 'sad', 'energetic', 'chill', 'hype', 'lofi', 'upbeat'];

async function seedTags() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- Connected to DB for Tag Seeding ---');

    const songs = await Song.find({});
    console.log(`Found ${songs.length} songs to tag.`);

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        
        // Pick 2 random moods per song
        const randomMoods = [
            MOODS[Math.floor(Math.random() * MOODS.length)],
            MOODS[Math.floor(Math.random() * MOODS.length)]
        ];
        
        // Remove duplicates and save
        song.tags = [...new Set(randomMoods)];
        await song.save();
        console.log(`- Tagged "${song.title}" as: ${song.tags.join(', ')}`);
    }

    console.log('--- Successfully Tagged All Songs ---');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding tags:', err);
    process.exit(1);
  }
}

seedTags();
