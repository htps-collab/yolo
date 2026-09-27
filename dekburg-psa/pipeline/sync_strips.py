# -*- coding: utf-8 -*-
"""Draw the vocal stem with caption starts on it, to check sync by eye.

    python3 pipeline/sync_strips.py [--work work] [--old data/cues.json] [--span 25.5]

One PNG per time window in WORK/strips/: the isolated vocal's spectrogram (dark =
voice), each line's new start as a solid red rule labelled with its number, the
previous cue times (--old) as dashed grey rules, and what each recogniser heard
underneath. A caption is in sync when its red rule sits at the left edge of a
voiced burst.
"""
import argparse, json, os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INK, MUTED, GRID, NEW, OLD = "#16181D", "#5B616C", "#D9DCE2", "#C81E1E", "#8A909B"

def words(toks):
    """Merge sub-word tokens (leading space = new word) into (text, start)."""
    out = []
    for tk, t in toks:
        if not out or tk.startswith(" ") or tk.startswith("▁"):
            out.append([tk.strip(" ▁"), t])
        else:
            out[-1][0] += tk
    return [(w, t) for w, t in out if w]

def spectrogram(x, sr, n=512, hop=160):
    win = np.hanning(n)
    frames = np.lib.stride_tricks.sliding_window_view(np.pad(x, n // 2), n)[::hop] * win
    S = np.abs(np.fft.rfft(frames, axis=1)).T
    f = np.fft.rfftfreq(n, 1 / sr)
    keep = f <= 4000
    db = 20 * np.log10(S[keep] + 1e-6)
    return db, f[keep], np.arange(S.shape[1]) * hop / sr

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", default="work")
    ap.add_argument("--old", help="earlier cues.json to overlay as dashed rules")
    ap.add_argument("--span", type=float, default=25.5)
    a = ap.parse_args()
    x, sr = sf.read(os.path.join(a.work, "vocals16k.wav"))
    rep = json.load(open(os.path.join(a.work, "align_report.json")))
    starts, status = rep["starts"], rep["status"]
    old = [c["start"] for c in json.load(open(a.old, encoding="utf-8"))] if a.old else None
    heard = {k: words(json.load(open(os.path.join(a.work, "tokens_%s.json" % k))))
             for k in ("parakeet", "sensevoice")}
    db, f, t = spectrogram(x, sr)
    vmax = np.percentile(db, 99.5); vmin = vmax - 60
    out = os.path.join(a.work, "strips"); os.makedirs(out, exist_ok=True)
    total = len(x) / sr; k = 0; t0 = 0.0
    plt.rcParams.update({"font.family": ["DejaVu Sans", "IPAGothic"], "font.size": 9})
    while t0 < total - 1:
        t1 = min(t0 + a.span, total)
        fig, (ax, lane) = plt.subplots(2, 1, figsize=(20, 5.2), dpi=100, sharex=True,
                                       gridspec_kw={"height_ratios": [3, 1.3], "hspace": 0.04})
        m = (t >= t0) & (t <= t1)
        ax.imshow(db[:, m], origin="lower", aspect="auto", cmap="Greys", vmin=vmin, vmax=vmax,
                  extent=[t[m][0], t[m][-1], f[0], f[-1]], interpolation="nearest")
        ax.set_ylabel("Hz", color=MUTED); ax.tick_params(colors=MUTED)
        for i, s in enumerate(starts):
            if t0 <= s <= t1:
                ax.axvline(s, color=NEW, lw=2)
                ax.text(s + 0.05, 3850, "%d%s" % (i + 1, "" if status[i] == "both" else " " + status[i]),
                        color=INK, va="top", fontsize=10, fontweight="bold",
                        bbox=dict(facecolor="white", edgecolor="none", pad=1.5, alpha=0.85))
        if old:
            for i, s in enumerate(old):
                if t0 <= s <= t1:
                    ax.axvline(s, color=OLD, lw=1.2, ls=(0, (4, 3)))
                    ax.text(s + 0.05, 150, "v3 %d" % (i + 1), color=MUTED, fontsize=8)
        for row, (name, ws) in enumerate(heard.items()):
            y = 1 - row
            lane.text(t0 + 0.05, y + 0.32, name, color=MUTED, fontsize=8)
            for w, s in ws:
                if t0 <= s <= t1:
                    lane.plot([s, s], [y - 0.35, y - 0.15], color=OLD, lw=0.8)
                    lane.text(s, y - 0.12, w, color=INK, fontsize=8, rotation=35, ha="left", va="bottom")
        for s in starts:
            if t0 <= s <= t1:
                lane.axvline(s, color=NEW, lw=1, alpha=0.5)
        lane.set_ylim(-0.6, 1.6); lane.set_yticks([])
        lane.set_xlim(t0, t1); lane.set_xticks(np.arange(np.ceil(t0), t1, 1.0))
        lane.tick_params(colors=MUTED); lane.set_xlabel("seconds", color=MUTED)
        lane.grid(axis="x", color=GRID, lw=0.6)
        for s_ in ("top", "right"):
            lane.spines[s_].set_visible(False); ax.spines[s_].set_visible(False)
        fig.savefig(os.path.join(out, "strip_%02d.png" % k), bbox_inches="tight", facecolor="white")
        plt.close(fig); k += 1; t0 = t1
    print("wrote %d strips to %s" % (k, out))

if __name__ == "__main__":
    main()
