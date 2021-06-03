ffmpeg -f concat -safe 0 -i files.txt output.wav
ffmpeg -i output.wav -c:a libopus -b:a 128k Chapter3.caf
ffmpeg -i output.wav -c:a libopus -b:a 128k Chapter3.ogg


