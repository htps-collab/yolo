#!/bin/bash
# Render from data/cues.json. Run from dekburg-psa/ with base508.mp4 + src_audio.mp3 present.
#   pipeline/render.sh [out.mp4]              final video, 2-pass so 203s fits the 30MB limit
#   pipeline/render.sh --sync [SYNC.mp4]      big running timecode + captions, for checking sync
set -e
AUDIO=${AUDIO:-src_audio.mp3}; BASE=${BASE:-base508.mp4}
python3 pipeline/make_ass.py
if [ "$1" = "--sync" ]; then
  OUT=${2:-SYNC_REFERENCE.mp4}
  TC="%{eif\:trunc(t/60)\:d\:2}\:%{eif\:mod(trunc(t)\,60)\:d\:2}.%{eif\:trunc(mod(t\,1)*10)\:d\:1}"
  ffmpeg -nostdin -v error -f lavfi -i "color=c=0x101014:s=960x720:r=25:d=202.92" -i "$AUDIO" \
    -filter_complex "[0:v]drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='$TC':x=(w-text_w)/2:y=180:fontsize=110:fontcolor=0x33FF66,ass=data/final.ass[v]" \
    -map "[v]" -map 1:a -shortest -c:v libx264 -crf 30 -c:a aac -b:a 128k "$OUT" -y
  echo "wrote $OUT"; exit 0
fi
OUT=${1:-out.mp4}
P=$(mktemp -d)/ff2pass
ffmpeg -nostdin -v error -i "$BASE" -i "$AUDIO" -filter_complex_script pipeline/graph.txt \
  -map "[v]" -an -c:v libx264 -preset medium -b:v 930k -pass 1 -passlogfile "$P" -f mp4 /dev/null -y
ffmpeg -nostdin -v error -i "$BASE" -i "$AUDIO" -filter_complex_script pipeline/graph.txt \
  -map "[v]" -map 1:a -shortest -c:v libx264 -preset medium -b:v 930k -pass 2 -passlogfile "$P" \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$OUT" -y
rm -rf "$(dirname "$P")"
echo "wrote $OUT ($(du -m "$OUT" | cut -f1) MB)"
