# DEKBURG WAKEUP PSA — Handoff

Bilingual (JP/EN) subtitled music video. A custom audio track is laid over stock
footage so the on-screen woman reads as the one delivering the announcement.

**Status (session 2): v4 delivered. Subtitle timing re-derived from the vocal and checked
line by line; shot cuts moved with it; unintentional spelling errors fixed.**

---

## 1. Timing — how it was fixed (session 2)

**What was wrong with v3.** It spread the lines evenly between two endpoints, but the song
does not pace itself evenly. Captions were 1–5 s off through ~1:40, then drifted to
**22 s late** by line 41 (the countdown sat at 3:04; it is really at 2:43). The "verified"
first-word anchor was also wrong: **10.92 s is silence; the first word is at 11.92 s**
(the 7.9–10.2 s sound is an instrumental sweep, not speech).

**How the v4 timing was made.** huggingface.co is blocked here, but GitHub release assets
are not, and k2-fsa/sherpa-onnx republishes the models there (`pipeline/fetch_models.sh`).

1. `pipeline/auto_align.py` separates the vocal (UVR-MDX-NET-Voc_FT), transcribes it
   with token timestamps (Parakeet-TDT 0.6B), aligns the transcript to the script at the
   character level, fills unheard lines by syllables, and snaps every start to the nearest
   voice onset minus 0.05 s. `pipeline/synth_test.py` checks it against a synthetic track
   with known timing (median 0.09 s, max 0.12 s).
2. `pipeline/sync_strips.py` draws the vocal with every line start on it. Every line was
   checked by eye. 13 starts (and one end) the automatic pass got wrong were fixed by hand
   from the voice onsets, and are in `data/anchors_verified.txt` (fed back via `--anchors`).
   Line 14 was confirmed by re-transcribing 58–67 s in short windows.
3. `pipeline/retime_edl.py` maps the v3 cut list (`data/edl_v3.tsv`, laid out on
   `data/cues_v3.json`) onto the new line starts: 33 of 40 talking-shot cuts land on a
   line start, the other 7 keep their relative place, and the title card ends at 11.92 s.

**Limits.** SenseVoice, meant as the second recogniser, hears this accented voice as
Japanese (katakana) and returns almost nothing, so most lines are confirmed by one
recogniser plus the by-eye check, not two recognisers. A second English model
(`sherpa-onnx-zipformer-gigaspeech-2023-12-12`, same release page) is the natural next
cross-check if anything is disputed.

To reproduce v4 from the source media:

```bash
pipeline/fetch_models.sh
python3 pipeline/auto_align.py src_audio.mp3 --work work/real --anchors data/anchors_verified.txt --write-cues
python3 pipeline/retime_edl.py
pipeline/build_base.sh && pipeline/render.sh DEKBURG_PSA_v4.mp4
```

## 2. What is already correct — do not redo

- **Source measurement.** Old burnt-in subtitles occupy y=256..325 in the 476x360 source.
  Fixed by cropping rows 252..360 away entirely (not blurring). DVDFab watermark is
  visible only 0–58s at roughly x0..150, y0..55; a permanent station bug covers it.
- **Frame design.** 960x720. Video 960x508 on top, 212px subtitle plate below.
  JP line white at y=560, EN line gold at y=648, both `\an5` positioned.
- **Time anchors (session 2, from the separated vocal).** First word starts **11.92 s**
  (not 10.92). Last word ends **~202.1 s** (track is 202.92 s). All 53 line starts are in
  `data/cues.json`; the hand-checked ones are in `data/anchors_verified.txt`.
- **The intro.** PSA title card holds over the full instrumental (0–11.92 s) backed by
  non-talking footage, then hard-cuts to her talking on the first word. This is
  deliberate and the user confirmed the problem it solved — keep it.
- **Captions: user's wording, spelling slips fixed.** The user first said *"caption as i
  wrote"*, then (session 2) *"correct unintentional spelling errors in script"*. Fixed:
  `eserve`→`serve`, `braincells`→`brain cells`, `FIXIT`→`FIX IT`, `You're Vibe`→`Your Vibe`,
  `Cleancen`→`Clench`, `Hid`→`Hide`, `baseline`→`bassline`, `turn up ,`→`turn up,`.
  Deliberate styling stays exactly as written: elongations (`ewwwww`, `bio-hazardoooo`,
  `RELEAASE`, `RELEASEEEE`, `DEK-BURGGGGGGG`, `11111111`), `WHORE-I-Zontal`, `Cunt-o`,
  `ARIGATOADEMAS(E)`, `ur`, capitalisation, and `DEKBURGHU~!~!~!~!~~#!@$#@`.
- **Japanese register.** Deadpan military/formal, chosen by the user over matching the
  crude English. Translations for all 53 lines are in `data/official_lines.json`.

## 3. Locked creative decisions

| Decision | Value |
|---|---|
| Aspect | 4:3, 960x720 (9:16 offered, not requested) |
| JP tone | Deadpan military formal |
| EN captions | As written by the user; unintentional spelling errors corrected |
| Intro | PSA card over instrumental (0–11.92 s), cut to her on first word |
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
  (reads `data/edl.tsv`, which `pipeline/retime_edl.py` writes)
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
python3 pipeline/auto_align.py src_audio.mp3 --anchors data/anchors_verified.txt --write-cues
                                              # -> data/cues.json (~3 min first run)
python3 pipeline/retime_edl.py                # cuts follow the line starts -> data/edl.tsv
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

1. The Japanese phrase after `Step 1 open your eyes` (61.5–62.3 s) is still uncaptioned.
   The recognisers hear it as "Osobusema" / ボスオブセム; neither is trustworthy, so no
   text was invented. Line 13's caption ends before it (`13 end = 61.45`).
2. A 9:16 vertical cut was offered and not taken up; the pipeline supports it.
3. The source media was handed between sessions through a private artifact in the user's
   gallery ("Dekburg Media Drop"). Delete it only if the user asks.
