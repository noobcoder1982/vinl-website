import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import * as musicMetadata from 'music-metadata';
import dotenv from 'dotenv';
import AdmZip from 'adm-zip';
import Song from '../src/models/Song.js';

// Setup environment and paths
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_EXTRACT_PATH = path.join(__dirname, '../temp-extract');

// Check if a zip path was provided as a CLI argument
const zipPath = process.argv[2];

if (!zipPath) {
  console.log('\n❌ ERROR: No ZIP file path provided.');
  console.log('Usage: npm run upload-zip <path-to-zip-file>');
  console.log('Example: npm run upload-zip C:/Music/MyLibrary.zip');
  process.exit(1);
}

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

// Helper to sanitize folder and file names for Cloudinary (removes characters like &, ?, #, etc.)
const sanitizeForCloudinary = (str) => {
  return str.replace(/[^a-zA-Z0-9_\-\/]/g, '_');
};

async function processZip() {
  try {
    console.log('\n--- 📦 BULK ZIP UPLOAD INITIALIZED ---');
    console.log(`🔍 Processing: ${zipPath}`);
    
    // Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create temp directory for extraction
    if (!fs.existsSync(TEMP_EXTRACT_PATH)) fs.mkdirSync(TEMP_EXTRACT_PATH);

    // Extract ZIP
    console.log('📂 Extracting files...');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(TEMP_EXTRACT_PATH, true);
    console.log('✅ Extraction complete.');

    // Function to recursively find mp3 files
    const findAudioFiles = (dir, results = []) => {
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          findAudioFiles(filePath, results);
        } else if (file.toLowerCase().endsWith('.mp3')) {
          results.push(filePath);
        }
      }
      return results;
    };

    const audioFiles = findAudioFiles(TEMP_EXTRACT_PATH);
    console.log(`🎵 Found ${audioFiles.length} audio tracks.`);

    if (audioFiles.length === 0) {
      console.log('⚠️ No MP3 files found in the ZIP.');
      process.exit(0);
    }

    for (const filePath of audioFiles) {
      const relPath = path.relative(TEMP_EXTRACT_PATH, filePath);
      const pathParts = relPath.split(path.sep);

      // We expect {Language}/{Genre}/{Song.mp3}
      // If the structure is deeper or flatter, handle it gracefully
      let language = 'Global';
      let genre = 'Unknown';
      let title = path.parse(filePath).name;

      if (pathParts.length >= 3) {
        language = pathParts[0];
        genre = pathParts[1];
      } else if (pathParts.length === 2) {
        genre = pathParts[0];
      }

      console.log(`\n🚀 Uploading: [${language}] [${genre}] ${title}`);

      console.log(`\n🚀 Processing: [${language}] [${genre}] ${title}`);

      // 1. Extract metadata (duration)
      try {
        const metadata = await musicMetadata.parseFile(filePath);
        const durationStr = formatDuration(metadata.format.duration || 0);

        // Define sanitized paths early
        const safeLanguage = sanitizeForCloudinary(language);
        const safeGenre = sanitizeForCloudinary(genre);
        const safeTitle = sanitizeForCloudinary(title);

        // 2. Extract and Upload Cover Art (if exists in metadata)
        let coverUrl = `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&language=${language}`; // Default fallback
        const picture = metadata.common.picture && metadata.common.picture[0];
        
        if (picture) {
          console.log(`🖼️  Extracting cover art for: ${title}`);
          const coverTempPath = path.join(TEMP_EXTRACT_PATH, `cover_${safeTitle}_${Date.now()}.jpg`);
          fs.writeFileSync(coverTempPath, picture.data);
          
          try {
            const coverUploadResult = await cloudinary.uploader.upload(coverTempPath, {
              folder: `antigravity_lib/${safeLanguage}/${safeGenre}/covers`,
              public_id: `cover_${safeTitle}`
            });
            coverUrl = coverUploadResult.secure_url;
            console.log(`✅ Cover art uploaded for: ${title}`);
          } catch (coverErr) {
            console.warn(`⚠️  Cover upload failed for ${title}, using fallback.`, coverErr.message);
          } finally {
            if (fs.existsSync(coverTempPath)) fs.unlinkSync(coverTempPath);
          }
        }

        // 3. Upload Audio to Cloudinary with sanitized paths
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          resource_type: 'video', // Audio files are 'video' in Cloudinary API
          folder: `antigravity_lib/${safeLanguage}/${safeGenre}`,
          public_id: safeTitle
        });

        // 4. Upsert into MongoDB
        await Song.findOneAndUpdate(
          { title: title, genre: genre },
          {
            title: title,
            artist: metadata.common.artist || 'AI Generation',
            album: metadata.common.album || `${language} ${genre} Selection`,
            genre: genre,
            language: language,
            duration: durationStr,
            fileUrl: uploadResult.secure_url,
            coverUrl: coverUrl
          },
          { upsert: true, new: true }
        );

        console.log(`✅ Success: ${title} updated/synced!`);
      } catch (err) {
        console.error(`❌ Failed to process: ${title}`, err.message);
      }
    }

    console.log('\n--- ✨ All tasks complete! Cleaning up... ---');
    
    // Cleanup temporary files
    fs.rmSync(TEMP_EXTRACT_PATH, { recursive: true, force: true });
    console.log('🗑️  Temporary files deleted.');
    
    process.exit(0);

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR:', error);
    process.exit(1);
  }
}

processZip();
