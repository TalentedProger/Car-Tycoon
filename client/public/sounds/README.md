# Game Sounds

This directory contains sound files for the Auto Arena game.

## Required Sound Files:

- `engine-ignition.mp3` - Car engine ignition sound for the car selection screen
- `celebration.mp3` - Celebration sound when a car is selected from the wheel

## File Requirements:

- Format: MP3
- Maximum file size: 1MB per file
- Recommended duration: 1-3 seconds
- Sample rate: 44.1 kHz or 48 kHz

## Usage:

Sounds are automatically loaded and played during the intro sequence:
1. Engine ignition sound plays when transitioning to the wheel of fortune
2. Celebration sound plays when a car is selected and the celebration screen appears

## Adding New Sounds:

To add new sound files:
1. Place MP3 files in this directory
2. Reference them in the intro component using the `playSound()` function
3. Ensure files are optimized for web playback