for i in *.mp3;
  do name=$(echo "$i" | cut -d'.' -f1)
  echo "$name"
  ffmpeg -i "$i" -c:a libopus -b:a 128k "${name}.caf"
  ffmpeg -i "$i" -c:a libopus -b:a 128k "${name}.ogg"
done