#!/bin/bash
# Rebuild base508.mp4 (960x508, 25fps, no audio, no subtitles) from src_video.mp4
# and data/edl.tsv.  Run from dekburg-psa/.
#   pipeline/build_base.sh [src_video.mp4] [base508.mp4]
# EDL columns: source_in  duration  timeline_pos  kind(I=intro, T=talking)
# Each shot: crop the burnt-in subtitle rows away (keep y 0..251), scale to 960x508.
# Shot lengths are taken from consecutive timeline positions in whole frames, so
# cuts land exactly on the EDL positions with no drift.
set -e
SRC=${1:-src_video.mp4}; OUT=${2:-base508.mp4}; FPS=25; END=202.92
inputs=(); graph=""; n=0
mapfile -t rows < <(grep -v '^#' data/edl.tsv)
for k in "${!rows[@]}"; do
  read -r sin dur pos kind <<<"${rows[$k]}"
  if (( k + 1 < ${#rows[@]} )); then read -r _ _ npos _ <<<"${rows[$((k+1))]}"; else npos=$END; fi
  frames=$(python3 -c "print(round($npos*$FPS)-round($pos*$FPS))")
  inputs+=(-ss "$sin" -i "$SRC")
  graph+="[$k:v]fps=$FPS,trim=end_frame=$frames,setpts=PTS-STARTPTS,crop=476:252:0:0,scale=960:508:flags=lanczos,setsar=1[v$k];"
  n=$((n+1))
done
for k in $(seq 0 $((n-1))); do graph+="[v$k]"; done
graph+="concat=n=$n:v=1:a=0[v]"
ffmpeg -nostdin -v error "${inputs[@]}" -filter_complex "$graph" -map "[v]" \
  -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p -r $FPS "$OUT" -y
echo "wrote $OUT ($n shots)"
