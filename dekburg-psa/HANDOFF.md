# DEKBURG WAKEUP PSA — Handoff

Bilingual (JP/EN) subtitled music video. A custom audio track is laid over stock
footage so the on-screen woman reads as the one delivering the announcement.

**Status: delivered v3, but SUBTITLE TIMING IS STILL WRONG. That is the only open problem.**

---

## 1. The one open problem

Captions do not line up with the vocal. Three rounds have failed to fix it.

The root cause is not the code — it is that **no one in the loop can verify the timing
automatically**. The session cannot listen to the audio, and every automatic method
tried (below) is either unreliable on this material or only verifiable at the endpoints.

### Do this next — it is the shortest path to done

Two files exist for exactly this:

- `SYNC_REFERENCE.mp4` — the audio with a large running timecode burned in, plus the
  current (wrong) captions, so the mismatch is visible directly. Regenerate with the
  command in §6 if lost.
- `data/anchor_list.txt` — all 53 lines numbered, with the current guess, and 12 lines
  marked `**`.

Ask the user for the **true start time of the 12 starred lines**. Then interpolate
piecewise between those anchors instead of fitting the whole track at once. Twelve
anchors across 203s means the worst-case unverified stretch is ~17s, which the existing
syllable-paced fit handles well. Do not attempt another global fit from two endpoints —
that has already been tried and is what produced v3.

Write the anchors into `data/cues.json` (`start`/`end`, seconds), then §6 to render.

---

## 2. What is already correct — do not redo

- **Source measurement.** Old burnt-in subtitles occupy y=256..325 in the 476x360 source.
  Fixed by cropping rows 252..360 away entirely (not blurring). DVDFab watermark is
  visible only 0–58s at roughly x0..150, y0..55; a permanent station bug covers it.
- **Frame design.** 960x720. Video 960x508 on top, 212px subtitle plate below.
  JP line white at y=560, EN line gold at y=648, both `\an5` positioned.
- **Verified time anchors** (forced alignment, two independent windows agreeing):
  - First word starts **10.92s**. The track opens with ~11s of instrumental.
  - Last word ends **201.85s** (track is 202.92s).
- **The intro.** PSA title card holds over the full instrumental (0–10.9s) backed by
  non-talking footage, then hard-cuts to her talking on the first word. This is
  deliberate and the user confirmed the problem it solved — keep it.
- **Captions are verbatim.** The user explicitly overrode an earlier instruction to fix
  spelling/punctuation: *"caption as i wrote"*. Keep every elongation, capitalisation and
  misspelling exactly (`Cleancen ur hole`, `You're Vibe`, `eserve face`, `Hid those bags`,
  `DEKBURGHU~!~!~!~!~~#!@$#@`). Do not tidy these.
- **Japanese register.** Deadpan military/formal, chosen by the user over matching the
  crude English. Translations for all 53 lines are in `data/official_lines.json`.

## 3. Locked creative decisions

| Decision | Value |
|---|---|
| Aspect | 4:3, 960x720 (9:16 offered, not requested) |
| JP tone | Deadpan military formal |
| EN captions | Verbatim as written by the user |
| Intro | PSA card over instrumental, cut to her on first word |
| Station bug | Opaque, top-left, covers watermark |

### Special cue styling — clench/release

Requested explicitly. Applies to all four pairs, including elongated spellings
(`Release.`, `RELEAASE,`, `RELEASEEEE.`):

- clench portion → **pink** `#FF66CC` (ASS `&H00CC66FF`)
- release portion → **blue** `#4DA6FF` (ASS `&H00FFA64D`)
- cue fades out on the release beat: `{\fad(120,650)}`
- same treatment on the Japanese line (`穴を締めよ` pink / `緩めよ` blue)

Implemented in `pipeline/make_ass.py`; regex `rele+a*se+` catches the elongations.

## 4. What was tried and FAILED — do not repeat

| Attempt | Result |
|---|---|
| Whisper (faster-whisper) | **Blocked.** Model download needs huggingface.co, which this environment's egress policy refuses (403). Do not retry; report it instead. |
| Free recognition, pocketsphinx general LM | Garbage. Japanese-accented vocal over a dense music bed. |
| Constrained n-gram LM from the script | Outputs script words in scrambled order. Unusable as a transcript. |
| Energy-based phrase grid, 1:1 line mapping | Counted the 11s instrumental intro as vocal phrases, shifting everything ~11s early. This produced v1/v2. |
| Mid/low spectral ratio as vocal detector | **Flat across the whole track — proves nothing.** A false negative here caused a correct alignment result to be wrongly discarded. Do not trust it. |
| 3–8Hz speech-modulation VAD | Noisy, fires at 2.5s during instrumental. Useless here. |
| Forced alignment, whole file at once | `seg()` returns `None`. Exceeds an internal limit. |
| Forced alignment, chunked, 40–85s windows | Cursor raced to 196.9s after 90 words. Windows too loose. |
| Forced alignment on `vocal.npy` | Stalls immediately. **Must use `voc16k.wav`** (has `dynaudnorm`). |
| Forced alignment, overlap-commit, tight windows | Correct for the first ~9 lines, then stretches. Stalls at word 153. |
| DP fit anchored to both verified endpoints | Drift-free and well-paced, but interior unverified. **This is v3, still wrong.** |

**Key lesson:** forced alignment *does* work on this audio, but only in tight windows
(~24–32s) on `voc16k.wav`, and only near a known anchor. It cannot carry itself across
the whole track. Use it to *confirm* user-supplied anchors, not to find them.

## 5. Assets

Media is NOT in git (too large). Source files came from the user and must be re-supplied:

- `src_video.mp4` — 476x360, 25fps, 155.6s, 4:3 square pixels
- `src_audio.mp3` — 202.9s, 320kbps

Derived, regenerate if missing:

- `base508.mp4` — the assembled 960x508 cut, 42 shots, no subtitles (~2 min to rebuild)
- `voc16k.wav` — alignment audio. **Required for forced alignment:**
  `ffmpeg -i src_audio.mp3 -af "pan=mono|c0=0.5*c0+0.5*c1,highpass=f=180,lowpass=f=3800,dynaudnorm=f=150:g=15" -ar 16000 voc16k.wav`
- `vocal.npy` — bandpassed float array used by the DP energy envelope

In git under `data/`: line list with Japanese, cue times, alignment dictionary and
phone-level word timings, the current ASS, and the edit decision list.

## 6. Pipeline

```bash
# 1. subtitles from cue times
python3 pipeline/make_ass.py                 # data/cues.json -> data/final.ass

# 2. render (2-pass keeps it under the 30MB upload limit; ~90s)
ffmpeg -i base508.mp4 -i src_audio.mp3 -filter_complex_script pipeline/graph.txt \
  -map "[v]" -an -c:v libx264 -preset medium -b:v 930k -pass 1 -f mp4 /dev/null -y
ffmpeg -i base508.mp4 -i src_audio.mp3 -filter_complex_script pipeline/graph.txt \
  -map "[v]" -map 1:a -shortest -c:v libx264 -preset medium -b:v 930k -pass 2 \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart out.mp4 -y
```

Rebuild the sync reference:

```bash
TC="%{eif\:trunc(t/60)\:d\:2}\:%{eif\:mod(trunc(t)\,60)\:d\:2}.%{eif\:trunc(mod(t\,1)*10)\:d\:1}"
ffmpeg -f lavfi -i "color=c=0x101014:s=640x480:r=25:d=202.92" -i src_audio.mp3 \
 -filter_complex "[0:v]drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:\
text='$TC':x=(w-text_w)/2:y=90:fontsize=76:fontcolor=0x33FF66,ass=data/final.ass[v]" \
 -map "[v]" -map 1:a -shortest -c:v libx264 -crf 30 -c:a aac -b:a 128k SYNC_REFERENCE.mp4 -y
```

`pipeline/build_final.py` and `render_final.sh` are the older phrase-grid path, kept only
for the wrapping/colour helpers. **The cue times it generates are the ones that were
wrong** — drive rendering from `data/cues.json`, not from it.

## 7. Environment

- `ffmpeg` is NOT preinstalled: `apt-get update && apt-get install -y ffmpeg`
- Japanese font: `/usr/share/fonts/truetype/fonts-japanese-gothic.ttf` (IPAGothic)
- Latin font: `/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`
- `pip install pocketsphinx` works (PyPI is allowed); huggingface.co is not
- Always pass `-nostdin` to ffmpeg inside shell `while read` loops or it eats the input
- Upload limit is 30MB — the 4:3 203s render needs ~930kbps video + 128k audio to fit

## 8. Open questions for the user

1. **The 12 anchor timestamps** (§1). Everything is blocked on this.
2. There is untranscribed Japanese after `Step 1 open your eyes` that the user said they
   could not make out. Currently left with no caption rather than inventing text.
3. A 9:16 vertical cut was offered and not taken up; the pipeline supports it.
