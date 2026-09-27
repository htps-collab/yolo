#!/bin/bash
# Download the alignment models into models/ (~1GB). huggingface.co is blocked here,
# but GitHub release assets are allowed, and k2-fsa/sherpa-onnx republishes these there.
#   pip install sherpa-onnx soundfile numpy
#   pipeline/fetch_models.sh [models]
set -e
M=${1:-models}; mkdir -p "$M"; cd "$M"
R=https://github.com/k2-fsa/sherpa-onnx/releases/download
get() {
  f=$(basename "$1"); d=${f%.tar.bz2}
  if [ -e "$d" ]; then echo "have $d"; return; fi
  for i in 1 2 3 4; do curl -fsSL -C - --retry 3 -o "$f" "$1" && break; sleep $((2**i)); done
  case "$f" in *.tar.bz2) tar xjf "$f" && rm -f "$f";; esac
  echo "got $d"
}
get $R/source-separation-models/UVR-MDX-NET-Voc_FT.onnx
get $R/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2
get $R/asr-models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17.tar.bz2
