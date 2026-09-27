# -*- coding: utf-8 -*-
"""Automatic line timing: vocal separation -> ASR with timestamps -> script alignment.

    python3 pipeline/auto_align.py src_audio.mp3 [--anchors data/anchor_list.txt] [--write-cues]

1. UVR-MDX vocal separation strips the music bed (sherpa-onnx).
2. Two independent recognisers transcribe the vocal stem with token timestamps:
   Parakeet-TDT (English) and SenseVoice (en/ja).
3. Each transcript is aligned to the script (data/official_lines.json) at the
   character level, so misheard words ("deck berg" / "dekburg") still anchor.
4. A line's start comes from its first confidently matched characters. Hand-timed
   anchors ("12 = 1:03.4" lines in the anchor file) override everything. Lines nobody
   could hear are interpolated by syllable count between their neighbours, then snapped
   to the nearest vocal onset. Two recognisers agreeing is the verification.

Writes WORK/align_report.json and, with --write-cues, data/cues.json.
Models are fetched from the k2-fsa/sherpa-onnx GitHub releases (see HANDOFF.md).
"""
import argparse, json, os, re, subprocess
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")

# ---------------------------------------------------------------- audio io

def load(path, sr, ch):
    """Decode anything ffmpeg reads -> float32 array (ch, n)."""
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", path, "-f", "f32le",
                          "-ac", str(ch), "-ar", str(sr), "-"], check=True,
                         stdout=subprocess.PIPE).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).T.copy()

def save(path, x, sr):
    import soundfile as sf
    sf.write(path, np.asarray(x).T, sr)

# ---------------------------------------------------------------- separation

def separate(src, work, models):
    out = os.path.join(work, "vocals.wav")
    if os.path.exists(out):
        return out
    import sherpa_onnx as so
    x = load(src, 44100, 2)
    cfg = so.OfflineSourceSeparationConfig(model=so.OfflineSourceSeparationModelConfig(
        uvr=so.OfflineSourceSeparationUvrModelConfig(model=os.path.join(models, "UVR-MDX-NET-Voc_FT.onnx")),
        num_threads=os.cpu_count() or 2))
    res = so.OfflineSourceSeparation(cfg).process(sample_rate=44100, samples=x)
    stems = [np.array(s.data) for s in res.stems]
    save(out, stems[0], res.sample_rate)                    # stem 0 = vocals
    save(os.path.join(work, "instrumental.wav"), stems[1], res.sample_rate)
    return out

# ---------------------------------------------------------------- recognisers

def _recognizer(kind, models):
    import sherpa_onnx as so
    nt = os.cpu_count() or 2
    if kind == "parakeet":
        d = os.path.join(models, "sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8")
        return so.OfflineRecognizer.from_transducer(
            encoder=d + "/encoder.int8.onnx", decoder=d + "/decoder.int8.onnx",
            joiner=d + "/joiner.int8.onnx", tokens=d + "/tokens.txt",
            num_threads=nt, model_type="nemo_transducer")
    if kind == "sensevoice":
        d = os.path.join(models, "sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17")
        return so.OfflineRecognizer.from_sense_voice(
            model=d + "/model.int8.onnx", tokens=d + "/tokens.txt", num_threads=nt,
            language="en", use_itn=False)
    raise ValueError(kind)

def transcribe(kind, v16, models, win=20.0, hop=10.0):
    """Overlapping windows; each token is kept from the window where it is most central.
    Returns [[token_text, start_s], ...] (token text keeps the leading-space convention)."""
    rec = _recognizer(kind, models)
    sr = 16000; n = len(v16); total = n / sr
    starts = list(np.arange(0.0, max(total - win, 0) + 1e-6, hop))
    if not starts or starts[-1] + win < total:
        starts.append(max(total - win, 0.0))
    cuts = [0.0] + [(a + win + b) / 2 for a, b in zip(starts, starts[1:])] + [total + 1]
    toks = []
    for k, w0 in enumerate(starts):
        seg = v16[int(w0 * sr): int((w0 + win) * sr)]
        st = rec.create_stream(); st.accept_waveform(sr, seg); rec.decode_stream(st)
        r = st.result
        for tk, ts in zip(r.tokens, r.timestamps):
            t = w0 + float(ts)
            if cuts[k] <= t < cuts[k + 1]:
                toks.append([tk, round(t, 3)])
    toks.sort(key=lambda z: z[1])
    return toks

def tokens_to_chars(toks):
    """Token stream -> [(char, time)] with times spread inside each token up to the next one."""
    out = []
    for i, (tk, t) in enumerate(toks):
        t2 = toks[i + 1][1] if i + 1 < len(toks) else t + 0.25
        t2 = min(t2, t + 0.6)
        cs = [c for c in tk.lower() if c.isalnum() and c.isascii()]
        for j, c in enumerate(cs):
            out.append((c, t + (t2 - t) * j / max(len(cs), 1)))
    return out

# ---------------------------------------------------------------- alignment

_SIM = ["ckqg", "sz", "bpv", "dt", "fv", "lr", "iye", "aeo", "ou", "mn", "wu", "hx"]
_ALPHA = "abcdefghijklmnopqrstuvwxyz0123456789"
_SUBM = np.ones((len(_ALPHA), len(_ALPHA)))
for _grp in _SIM:
    for _a in _grp:
        for _b in _grp:
            _SUBM[_ALPHA.index(_a), _ALPHA.index(_b)] = 0.55
np.fill_diagonal(_SUBM, 0.0)

def char_align(script, rec, gap=0.85):
    """Global alignment of script chars against recognised chars; recognised junk at either
    end is free. Returns for each script char the index of its recognised partner (or -1)
    and whether that pairing is an exact match."""
    A = [_ALPHA.index(c) for c in script]; B = np.array([_ALPHA.index(c) for c in rec], int)
    n, m = len(A), len(B)
    D = np.zeros((n + 1, m + 1)); P = np.zeros((n + 1, m + 1), np.int8)
    k = np.arange(m + 1) * gap
    for i in range(1, n + 1):
        diag = D[i - 1, :-1] + _SUBM[A[i - 1]][B]     # match / substitute
        up = D[i - 1, 1:] + gap                       # script char unheard
        val = np.empty(m + 1); val[0] = i * gap; val[1:] = np.minimum(diag, up)
        ptr = np.ones(m + 1, np.int8); ptr[1:] = np.where(diag <= up, 0, 1)
        row = np.minimum.accumulate(val - k) + k      # left moves: recognised junk
        ptr[row < val - 1e-9] = 2
        D[i] = row; P[i] = ptr
    j = int(np.argmin(D[n])); i = n                   # trailing recognised junk is free
    pair = [-1] * n; exact = [False] * n
    while i > 0 and j > 0:
        p = P[i, j]
        if p == 0:
            pair[i - 1] = j - 1; exact[i - 1] = A[i - 1] == B[j - 1]; i -= 1; j -= 1
        elif p == 1: i -= 1
        else: j -= 1
    return pair, exact

def script_chars(lines):
    chars, owner = [], []
    for li, (_, al, _) in enumerate(lines):
        for c in al:
            if c.isalnum():
                chars.append(c); owner.append(li)
    return chars, owner

def _vowel_groups(s):
    return max(1, len(re.findall(r"[aeiouy]+", s)))

def line_times(lines, rec_chars, cps_hint=11.0):
    """Per line: (start, end, confidence) from the character alignment."""
    sc, owner = script_chars(lines)
    pair, exact = char_align(sc, [c for c, _ in rec_chars])
    T = [rec_chars[p][1] if (p >= 0 and ex) else None for p, ex in zip(pair, exact)]
    res = []
    for li in range(len(lines)):
        idx = [k for k, o in enumerate(owner) if o == li]
        hit = [k for k in idx if T[k] is not None]
        conf = len(hit) / len(idx)
        if len(hit) < 2 or conf < 0.35:
            res.append({"start": None, "end": None, "conf": round(conf, 2)}); continue
        # need two consecutive exact hits to trust a run (isolated letters are noise)
        runs = [k for k in hit if (k + 1 in hit) or (k - 1 in hit)] or hit
        k0, k1 = runs[0], runs[-1]
        s = T[k0] - (k0 - idx[0]) / cps_hint       # extrapolate over unheard lead-in chars
        e = T[k1] + (idx[-1] - k1) / cps_hint + 0.25
        res.append({"start": round(s, 2), "end": round(e, 2), "conf": round(conf, 2)})
    return res

def vocal_onsets(v16, sr=16000, hop=160):
    """Times where the vocal stem comes back after >=150ms of near-silence."""
    n = len(v16) // hop
    e = np.sqrt(np.mean(v16[:n * hop].reshape(n, hop) ** 2, 1) + 1e-12)
    db = 20 * np.log10(np.convolve(e, np.ones(3) / 3, "same") + 1e-9)
    on = db > np.percentile(db, 60) - 12
    quiet = np.convolve(~on, np.ones(15), "full")[:n] >= 15   # 15 frames = 150ms before
    idx = np.flatnonzero(on[1:] & ~on[:-1] & quiet[:-1]) + 1
    return idx * hop / sr

def fill_gaps(lines, fixed, t_end, onsets=None, snap=0.8):
    """fixed: {line_index: start}. Unheard lines are interpolated by syllable count between
    trusted neighbours, then moved to the nearest vocal onset within +-snap s that keeps order."""
    n = len(lines)
    syl = [_vowel_groups(al) for _, al, _ in lines]
    keys = sorted(fixed); out = [None] * n
    for k in keys: out[k] = fixed[k]
    for a, b in zip(keys, keys[1:] + [n]):
        hi = fixed[b] if b < n else t_end
        tot = sum(syl[a:b]); acc = syl[a]
        for i in range(a + 1, b):
            out[i] = fixed[a] + (hi - fixed[a]) * acc / tot; acc += syl[i]
    for i in range(keys[0]):                                   # before the first anchor
        out[i] = fixed[keys[0]] - 1.5 * (keys[0] - i)
    if onsets is not None and len(onsets):
        for i in range(n):
            if i in fixed: continue
            lo = out[i - 1] + 0.25 if i > 0 else 0.0
            nxt = next((out[j] for j in range(i + 1, n) if j in fixed), t_end)
            c = onsets[(np.abs(onsets - out[i]) <= snap) & (onsets > lo) & (onsets < nxt - 0.25)]
            if len(c): out[i] = float(c[np.argmin(np.abs(c - out[i]))])
    return out

def combine(runs, min_step=0.25):
    """Pick at most one candidate start per line, maximising total confidence, subject to
    starts increasing with line order (at least min_step s per line). A confident but
    out-of-order match from one recogniser is dropped instead of trusted."""
    n = len(runs[0])
    cand = [(i, r[i]["start"], r[i]["conf"], r[i]["end"], k)
            for k, r in enumerate(runs) for i in range(n) if r[i]["start"] is not None]
    cand.sort(key=lambda c: (c[0], -c[2]))
    best = [c[2] for c in cand]; prev = [-1] * len(cand)
    for b in range(len(cand)):
        for a in range(b):
            ia, ta = cand[a][0], cand[a][1]; ib, tb = cand[b][0], cand[b][1]
            if ia < ib and tb - ta >= min_step * (ib - ia) and best[a] + cand[b][2] > best[b]:
                best[b] = best[a] + cand[b][2]; prev[b] = a
    out = [{"start": None, "end": None, "conf": 0.0, "src": None, "agree": None} for _ in range(n)]
    b = int(np.argmax(best)) if cand else -1
    while b >= 0:
        i, t, c, e, k = cand[b]
        others = [r[i]["start"] for r in runs if r[i]["start"] is not None]
        out[i] = {"start": t, "end": e, "conf": c, "src": k,
                  "agree": round(max(others) - min(others), 2) if len(others) > 1 else None}
        b = prev[b]
    return out

# ---------------------------------------------------------------- main

def read_anchors(path):
    """'12 = 1:03.4' or '12 = 63.4' lines -> {11: 63.4} (0-based line index)."""
    out = {}
    for ln in open(path, encoding="utf-8"):
        m = re.match(r"\s*(\d+)\s*=\s*(?:(\d+):)?(\d+(?:\.\d+)?)\s*$", ln)
        if m:
            out[int(m.group(1)) - 1] = int(m.group(2) or 0) * 60 + float(m.group(3))
    return out

def run(src, work, models, write_cues=False, anchors=None):
    os.makedirs(work, exist_ok=True)
    anchors = anchors or {}
    lines = json.load(open(os.path.join(DATA, "official_lines.json"), encoding="utf-8"))
    voc = separate(src, work, models)
    v16 = load(voc, 16000, 1)[0]
    save(os.path.join(work, "vocals16k.wav"), v16[None], 16000)
    t_end = len(v16) / 16000
    report = {"lines": [l[0] for l in lines], "anchors": {str(k + 1): v for k, v in anchors.items()}}
    for kind in ("parakeet", "sensevoice"):
        cache = os.path.join(work, "tokens_%s.json" % kind)
        if os.path.exists(cache):
            toks = json.load(open(cache))
        else:
            toks = transcribe(kind, v16, models)
            json.dump(toks, open(cache, "w"))
        report[kind] = line_times(lines, tokens_to_chars(toks))
    runs = [report[k] for k in ("parakeet", "sensevoice")]
    if anchors:                                   # hand-timed lines win every conflict
        runs.append([{"start": anchors[i], "end": None, "conf": 1e3} if i in anchors
                     else {"start": None, "end": None, "conf": 0} for i in range(len(lines))])
    comb = combine(runs)
    report["combined"] = comb
    fixed = {i: c["start"] for i, c in enumerate(comb) if c["start"] is not None}
    starts = fill_gaps(lines, fixed, t_end, vocal_onsets(v16))
    status = []
    for i, c in enumerate(comb):
        if i in anchors: status.append("anchor")
        elif c["start"] is None: status.append("interp")
        elif c["agree"] is None: status.append("one")
        else: status.append("both" if c["agree"] <= 0.35 else "disagree")
    report["starts"] = [round(t, 2) for t in starts]
    report["status"] = status
    json.dump(report, open(os.path.join(work, "align_report.json"), "w"), indent=1)
    if write_cues:
        write_cue_file(lines, starts, comb, t_end)
    return report

def write_cue_file(lines, starts, comb, t_end, hold=0.4, bridge=0.7):
    cues = []
    for i, (cap, _, jp) in enumerate(lines):
        nxt = starts[i + 1] if i + 1 < len(starts) else t_end + 0.12
        e = comb[i]["end"] + hold if comb[i]["end"] is not None else nxt
        if nxt - e < bridge:
            e = nxt                                  # no blink between close lines
        e = min(max(e, starts[i] + 1.0), nxt - 0.12)  # readable, never overlapping
        cues.append({"cap": cap, "jp": jp, "start": round(starts[i], 2), "end": round(e, 2)})
    json.dump(cues, open(os.path.join(DATA, "cues.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=0)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--work", default="work")
    ap.add_argument("--models", default="models")
    ap.add_argument("--anchors", help="file with '12 = 1:03.4' lines (hand-timed starts)")
    ap.add_argument("--write-cues", action="store_true")
    a = ap.parse_args()
    rep = run(a.src, a.work, a.models, a.write_cues, read_anchors(a.anchors) if a.anchors else None)
    P, S = rep["parakeet"], rep["sensevoice"]
    f = lambda r: "%7.2f (%.2f)" % (r["start"], r["conf"]) if r["start"] is not None else "   --   (%.2f)" % r["conf"]
    print("%-3s %-8s %-15s %-15s %-8s %s" % ("#", "START", "parakeet", "sensevoice", "status", "line"))
    for i, cap in enumerate(rep["lines"]):
        print("%-3d %7.2f  %-15s %-15s %-8s %s" % (i + 1, rep["starts"][i], f(P[i]), f(S[i]), rep["status"][i], cap[:44]))
    from collections import Counter
    print("status:", dict(Counter(rep["status"])))
