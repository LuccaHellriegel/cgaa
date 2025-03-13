#!/bin/bash

# Script to extract frames from the MP4 video in the feedback folder

# Define variables
VIDEO_PATH="feedback/Bildschirmaufnahme 2025-03-13 22:57:41.mp4"
OUTPUT_DIR="feedback/frames"
FPS=1 # Extract 1 frame per second; adjust as needed

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Check if ffmpeg is installed
if ! command -v ffmpeg &>/dev/null; then
    echo "Error: ffmpeg is not installed. Please install it with:"
    echo "  sudo apt-get install ffmpeg"
    exit 1
fi

# Check if the video file exists
if [ ! -f "$VIDEO_PATH" ]; then
    echo "Error: Video file not found at $VIDEO_PATH"
    exit 1
fi

echo "Extracting frames from video: $VIDEO_PATH"
echo "Frames will be saved to: $OUTPUT_DIR"

# Extract frames using ffmpeg
# -i: input file
# -vf fps=1: extract 1 frame per second
# -q:v 2: quality (2 is high quality, lower number = higher quality)
ffmpeg -i "$VIDEO_PATH" -vf "fps=$FPS" -q:v 2 "$OUTPUT_DIR/frame_%04d.jpg"

echo "Frame extraction complete! Frames saved to $OUTPUT_DIR"

# Optional: display the number of frames extracted
FRAME_COUNT=$(ls -1 "$OUTPUT_DIR" | wc -l)
echo "Total frames extracted: $FRAME_COUNT"
