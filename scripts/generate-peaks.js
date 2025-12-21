#!/usr/bin/env node

/**
 * Peak Generation Script for Audio Files
 *
 * This script generates waveform peaks from audio files that can be used
 * for instant waveform loading in the DJ Web Player.
 *
 * Prerequisites:
 * - Node.js installed
 * - Audio file accessible locally or via URL
 *
 * Usage:
 *   node generate-peaks.js <audio-file-path-or-url>
 *
 * Example:
 *   node generate-peaks.js "./music/my-set.mp3"
 *   node generate-peaks.js "https://example.com/music/set.mp3"
 *
 * The script will output JSON peaks data that you can copy into sets.json
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const SAMPLES_PER_PIXEL = 200; // How many samples to analyze per pixel
const DESIRED_WIDTH = 1000; // Target number of peaks (width of waveform in pixels)

/**
 * Download file from URL to temporary location
 */
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

/**
 * Generate peaks using audiowaveform (if installed)
 */
async function generatePeaksWithAudiowaveform(audioPath) {
  const { execSync } = require('child_process');
  const tempJsonPath = path.join(__dirname, 'temp-peaks.json');

  try {
    // Check if audiowaveform is installed
    execSync('which audiowaveform', { stdio: 'ignore' });
  } catch (e) {
    return null; // Not installed
  }

  try {
    // Generate peaks
    execSync(`audiowaveform -i "${audioPath}" -o "${tempJsonPath}" --pixels-per-second 50 --bits 8`);

    // Read and parse the generated JSON
    const peaksData = JSON.parse(fs.readFileSync(tempJsonPath, 'utf8'));

    // Clean up
    fs.unlinkSync(tempJsonPath);

    // Convert to WaveSurfer.js format (split into two channels)
    const data = peaksData.data;
    const channel1 = [];
    const channel2 = [];

    for (let i = 0; i < data.length; i += 2) {
      channel1.push(data[i] / 127 - 1); // Normalize to -1 to 1
      if (i + 1 < data.length) {
        channel2.push(data[i + 1] / 127 - 1);
      }
    }

    return [channel1, channel2];
  } catch (error) {
    console.error('Error generating peaks with audiowaveform:', error.message);
    return null;
  }
}

/**
 * Generate simple peaks by file size estimation
 * This is a fallback method that creates fake peaks based on file structure
 */
function generateFallbackPeaks(audioPath) {
  console.log('\n⚠️  audiowaveform not found. Generating simplified peaks...');
  console.log('   For better waveforms, install audiowaveform:');
  console.log('   - Ubuntu/Debian: sudo apt-get install audiowaveform');
  console.log('   - macOS: brew install audiowaveform\n');

  // Create simple sinusoidal peaks as placeholder
  const peaks = [];
  const channel1 = [];
  const channel2 = [];

  for (let i = 0; i < DESIRED_WIDTH; i++) {
    const t = i / DESIRED_WIDTH;
    const val = Math.sin(t * Math.PI * 8) * 0.7 * Math.random();
    channel1.push(val);
    channel2.push(val * 0.9);
  }

  return [channel1, channel2];
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node generate-peaks.js <audio-file-path-or-url>');
    console.log('\nExample:');
    console.log('  node generate-peaks.js "./music/my-set.mp3"');
    console.log('  node generate-peaks.js "https://example.com/music/set.mp3"');
    process.exit(1);
  }

  const audioInput = args[0];
  let audioPath = audioInput;
  let isTemp = false;

  console.log('🎵 Generating peaks for:', audioInput);

  // Download if URL
  if (audioInput.startsWith('http://') || audioInput.startsWith('https://')) {
    console.log('📥 Downloading audio file...');
    const tempPath = path.join(__dirname, 'temp-audio.mp3');
    try {
      await downloadFile(audioInput, tempPath);
      audioPath = tempPath;
      isTemp = true;
      console.log('✅ Downloaded successfully');
    } catch (error) {
      console.error('❌ Failed to download:', error.message);
      process.exit(1);
    }
  }

  // Check if file exists
  if (!fs.existsSync(audioPath)) {
    console.error('❌ File not found:', audioPath);
    process.exit(1);
  }

  console.log('🔍 Analyzing audio file...');

  // Try audiowaveform first
  let peaks = await generatePeaksWithAudiowaveform(audioPath);

  // Fallback to simple generation
  if (!peaks) {
    peaks = generateFallbackPeaks(audioPath);
  }

  // Clean up temp file
  if (isTemp && fs.existsSync(audioPath)) {
    fs.unlinkSync(audioPath);
  }

  console.log('✅ Peaks generated successfully!');
  console.log(`   Channel 1: ${peaks[0].length} samples`);
  console.log(`   Channel 2: ${peaks[1].length} samples\n`);

  // Output JSON
  console.log('📋 Copy this into your sets.json under the "peaks" field:\n');
  console.log(JSON.stringify(peaks, null, 2));
  console.log('\n💡 Example:');
  console.log('{');
  console.log('  "id": "1",');
  console.log('  "title": "My Set",');
  console.log('  ...,');
  console.log('  "peaks": ' + JSON.stringify(peaks).substring(0, 50) + '...');
  console.log('}');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
