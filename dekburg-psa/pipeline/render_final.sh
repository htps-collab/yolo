#!/bin/bash
# Usage: render_final.sh <lines.txt> <out.mp4>
set -e
D=/tmp/claude-0/-home-user-yolo/a7ab82fc-862c-58df-9672-3ae93c7fe1cc/scratchpad
JP=/usr/share/fonts/truetype/fonts-japanese-gothic.ttf
EN=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
python3 $D/build_final.py "$1"
cat > $D/graph.txt <<EOF
[0:v]pad=960:720:0:0:black,
drawbox=x=0:y=508:w=960:h=212:color=0x0E0E12:t=fill,
drawbox=x=0:y=508:w=960:h=5:color=0xC81E1E:t=fill,
drawbox=x=0:y=0:w=320:h=126:color=0x0A0A0C:t=fill,
drawbox=x=0:y=0:w=8:h=126:color=0xC81E1E:t=fill,
drawtext=fontfile=$JP:textfile=$D/t_bug_jp.txt:x=28:y=22:fontsize=30:fontcolor=white,
drawtext=fontfile=$EN:textfile=$D/t_bug_en.txt:x=28:y=70:fontsize=26:fontcolor=0xE03C3C,
drawbox=x=0:y=0:w=960:h=720:color=black@0.84:t=fill:enable='lt(t\,5.2)',
drawbox=x=150:y=168:w=660:h=6:color=0xC81E1E:t=fill:enable='lt(t\,5.2)',
drawbox=x=150:y=470:w=660:h=6:color=0xC81E1E:t=fill:enable='lt(t\,5.2)',
drawtext=fontfile=$JP:textfile=$D/t_ti_jp1.txt:x=(w-text_w)/2:y=205:fontsize=50:fontcolor=0xFF4040:enable='lt(t\,5.2)',
drawtext=fontfile=$EN:textfile=$D/t_ti_en1.txt:x=(w-text_w)/2:y=290:fontsize=62:fontcolor=white:enable='lt(t\,5.2)',
drawtext=fontfile=$EN:textfile=$D/t_ti_en2.txt:x=(w-text_w)/2:y=372:fontsize=30:fontcolor=0xFFD700:enable='lt(t\,5.2)',
drawtext=fontfile=$JP:textfile=$D/t_ti_jp2.txt:x=(w-text_w)/2:y=418:fontsize=26:fontcolor=0xCCCCCC:enable='lt(t\,5.2)',
ass=$D/final.ass[v]
EOF
ffmpeg -nostdin -v error -i $D/base508.mp4 -i $D/src_audio.mp3 \
  -filter_complex_script $D/graph.txt -map "[v]" -map 1:a -shortest \
  -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 256k \
  -movflags +faststart "$2" -y
echo "RENDERED: $2"
