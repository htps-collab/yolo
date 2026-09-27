# DEKBURG WAKEUP PSA — Handoff

Bilingual (JP/EN) subtitled music video. A custom audio track is laid over stock
footage so the on-screen woman reads as the one delivering the announcement.

**Status: delivered v3, but SUBTITLE TIMING IS STILL WRONG. That is the only open problem.**
**Update (session 2): an automatic aligner now exists and is tested; it is waiting on the
source media, which is not in git and must be re-uploaded (§5).**

---

## 1. The one open problem

Captions do not line up with the vocal. Three rounds have failed to fix it.

The root cause was that **no one in the loop could verify the timing automatically**:
Whisper was blocked (huggingface.co refuses) and every classical method in §4 failed on
this material.

### What changed in session 2

huggingface.co is still blocked, but **GitHub release assets are allowed**, and
k2-fsa/sherpa-onnx republishes the models needed there. `pipeline/auto_align.py` now does:

1. UVR-MDX-NET-Voc_FT vocal separation (removes the music bed),
2. two independent recognisers with token timestamps on the vocal stem
   (Parakeet-TDT 0.6B and SenseVoice),
3. character-level alignment of each transcript to the script, so misheard words
   ("deck berg" vs `dekburg`) still anchor,
4. an order-preserving merge of the two, then syllable interpolation + snap-to-vocal-onset
   for any line neither recogniser caught. Hand-timed anchors (`12 = 1:03.4`) override all.

Each line gets a status: `both` (two recognisers agree within 0.35s — verified),
`one`, `disagree`, `interp`, or `anchor`.

**Tested on a synthetic track** (TTS reading all 53 lines at known times over a club bed,
vocal 6.6dB under the music): every line start within 0.22s of truth, median 0.10s;
45–47/53 lines `both`. Re-run with `python3 pipeline/synth_test.py` after any change. The real vocal (accented, over real music) will be harder — the
status column says which lines to eyeball.

### Do this next

1. Get `src_audio.mp3` (and `src_video.mp4` for the render) re-uploaded. Nothing below runs without them.
2. `pip install sherpa-onnx soundfile numpy && pipeline/fetch_models.sh` (~1GB, ~1 min)
3. `python3 pipeline/auto_align.py src_audio.mp3` → read the table; check that line 1 lands
   near the verified **10.92s** and the last line ends near **201.85s** (§2).
4. Eyeball every line not marked `both`. If any are wrong, put `N = m:ss.s` lines in an
   anchor file and re-run with `--anchors FILE`.
5. `--write-cues` → `data/cues.json`, then `pipeline/build_base.sh` and `pipeline/render.sh` (§6).

The anchor-list route (`data/anchor_list.txt`, user supplies 12 starred starts) still works
through `--anchors`, but is no longer required.

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
| Whisper (faster-whisper) | **Blocked.** Model download needs huggingface.co, which this environment's egress policy refuses (403). Do not retry; report it instead. Use the GitHub-hosted sherpa-onnx models instead (§1). |
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

Put them in `dekburg-psa/` (git-ignored). Derived, regenerate if missing:

- `base508.mp4` — the assembled 960x508 cut, 42 shots, no subtitles: `pipeline/build_base.sh`
- `models/` — alignment models: `pipeline/fetch_models.sh`
- `work/` — `auto_align.py` cache: separated `vocals.wav`, recogniser tokens, `align_report.json`
- `voc16k.wav` — old forced-alignment input (§4 only):
  `ffmpeg -i src_audio.mp3 -af "pan=mono|c0=0.5*c0+0.5*c1,highpass=f=180,lowpass=f=3800,dynaudnorm=f=150:g=15" -ar 16000 voc16k.wav`

In git under `data/`: line list with Japanese, cue times, alignment dictionary and
phone-level word timings, the current ASS, and the edit decision list.

## 6. Pipeline

Run everything from `dekburg-psa/`.

```bash
pipeline/build_base.sh                        # src_video.mp4 + data/edl.tsv -> base508.mp4 (~30s)
python3 pipeline/auto_align.py src_audio.mp3 --write-cues   # -> data/cues.json (~3 min first run)
pipeline/render.sh out.mp4                    # cues -> data/final.ass -> 2-pass render, fits 30MB (~1 min)
pipeline/render.sh --sync SYNC_REFERENCE.mp4  # big running timecode + captions, for checking sync
```

`render.sh` runs `pipeline/make_ass.py` (`data/cues.json` -> `data/final.ass`) and then the
`pipeline/graph.txt` filter graph; `AUDIO=` / `BASE=` override the input paths.

`pipeline/build_final.py` and `render_final.sh` are the older phrase-grid path, kept only
for the wrapping/colour helpers. **The cue times it generates are the ones that were
wrong** — drive rendering from `data/cues.json`, not from it.

## 7. Environment

- `ffmpeg` is NOT preinstalled: `apt-get update && apt-get install -y ffmpeg`
- Japanese font: `/usr/share/fonts/truetype/fonts-japanese-gothic.ttf` (IPAGothic)
- Latin font: `/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`
- PyPI is allowed (`pip install sherpa-onnx soundfile numpy`); huggingface.co is not;
  GitHub release downloads are
- Always pass `-nostdin` to ffmpeg inside shell `while read` loops or it eats the input
- Upload limit is 30MB — the 4:3 203s render needs ~930kbps video + 128k audio to fit

## 8. Open questions for the user

1. **Re-upload `src_audio.mp3` and `src_video.mp4`.** Everything is blocked on this.
   The 12 hand-timed anchors (§1) are now optional — only for lines the aligner flags.
2. There is untranscribed Japanese after `Step 1 open your eyes` that the user said they
   could not make out. Currently left with no caption rather than inventing text.
   SenseVoice understands Japanese and could offer a guess for the user to accept or reject.
3. A 9:16 vertical cut was offered and not taken up; the pipeline supports it.
4. The shot cuts in `data/edl.tsv` were placed on the v3 (wrong) line starts. Once the
   timing is fixed, the cuts can be moved to the corrected line starts if the user wants.
