# Waveform Peaks Generator

This script generates pre-computed waveform peaks for audio files, enabling instant waveform loading in the DJ Web Player.

## Why Pre-computed Peaks?

Without peaks, the browser must download and analyze the entire audio file (e.g., 200MB) to generate the waveform, which can take minutes. With pre-computed peaks, the waveform appears **instantly**.

## Installation

### Option 1: Using audiowaveform (Recommended)

Install `audiowaveform` for accurate peaks:

**Ubuntu/Debian:**
```bash
sudo apt-get install audiowaveform
```

**macOS:**
```bash
brew install audiowaveform
```

**Arch Linux:**
```bash
yay -S audiowaveform
```

### Option 2: Fallback Mode

If you don't install `audiowaveform`, the script will generate simplified placeholder peaks.

## Usage

```bash
node scripts/generate-peaks.js <path-to-audio-file-or-url>
```

### Examples

**Local file:**
```bash
node scripts/generate-peaks.js "./music/2025-11-23 Cellschock Testmaterial.mp3"
```

**Remote URL:**
```bash
node scripts/generate-peaks.js "https://kailohmann.de/music/2025-11-23 Cellschock Testmaterial.mp3"
```

## Output

The script will output JSON peaks data. Copy the output and add it to your `sets.json`:

### Before (slow loading):
```json
{
  "sets": [
    {
      "id": "1",
      "title": "Rise Festival 2024",
      "date": "2025-11-23",
      "duration": "01:32:45",
      "genre": ["Drum & Bass"],
      "cover": "https://kailohmann.de/music/cover1.jpg",
      "audio": "https://kailohmann.de/music/2025-11-23 Cellschock Testmaterial.mp3"
    }
  ]
}
```

### After (instant loading):
```json
{
  "sets": [
    {
      "id": "1",
      "title": "Rise Festival 2024",
      "date": "2025-11-23",
      "duration": "01:32:45",
      "genre": ["Drum & Bass"],
      "cover": "https://kailohmann.de/music/cover1.jpg",
      "audio": "https://kailohmann.de/music/2025-11-23 Cellschock Testmaterial.mp3",
      "peaks": [[...], [...]]  ← ADD THIS
    }
  ]
}
```

## How It Works

1. **Run the script** on your audio file
2. **Copy the peaks JSON** from the output
3. **Paste into sets.json** under the `peaks` field
4. **Deploy** - waveform now loads instantly!

## Performance Comparison

| Without Peaks | With Peaks |
|--------------|------------|
| ❌ 2-5 minutes to load waveform | ✅ Instant waveform |
| ❌ Downloads entire audio file | ✅ Only downloads small JSON |
| ❌ Browser must analyze audio | ✅ Pre-computed on server |

## Automating Peak Generation

You can automate this process when adding new sets:

```bash
#!/bin/bash
# generate-all-peaks.sh

for audio in /path/to/music/*.mp3; do
  echo "Generating peaks for: $audio"
  node scripts/generate-peaks.js "$audio" > "${audio%.mp3}.peaks.json"
done
```

Then manually add the peaks to your `sets.json`, or write a script to merge them automatically.

## Troubleshooting

**Q: "audiowaveform not found"**
A: Install it using the commands above, or the script will use fallback mode.

**Q: Can I generate peaks in the browser?**
A: Yes, but it still requires downloading the full audio file. Pre-computing on the server is much faster.

**Q: How large are the peaks JSON files?**
A: Typically 50-200KB, much smaller than the audio file (100-300MB).

## Technical Details

- Peaks are arrays of normalized amplitude values (-1 to 1)
- Two channels (stereo) = `[[channel1], [channel2]]`
- Default: ~1000 samples per channel (configurable)
- WaveSurfer.js reads peaks and renders waveform instantly
