# -*- coding: utf-8 -*-
"""Move the shot cuts from the old line starts to the new ones.

    python3 pipeline/retime_edl.py

Reads the v3 cut list (data/edl_v3.tsv), which was laid out on the v3 line starts
(data/cues_v3.json, wrong), and writes data/edl.tsv for the line starts now in
data/cues.json. Always starts from the v3 files, so re-running is safe. Every cut is
mapped through the piecewise-linear warp old_start[i] -> new_start[i], so a cut that
sat on a line start lands on that line's new start and a mid-line cut keeps its
relative place. Source in-points are unchanged; only positions and durations move.
The intro title card in pipeline/graph.txt is re-timed to end on the new first cut.
"""
import json, os, re, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
END = 202.92

def main(old_path=os.path.join(ROOT, "data", "cues_v3.json"),
         new_path=os.path.join(ROOT, "data", "cues.json"),
         src_edl=os.path.join(ROOT, "data", "edl_v3.tsv")):
    old = [c["start"] for c in json.load(open(old_path, encoding="utf-8"))]
    new = [c["start"] for c in json.load(open(new_path, encoding="utf-8"))]
    xs, ys = [0.0], [0.0]
    for a, b in zip(old, new):                  # keep only the monotonic part of the old list
        if a > xs[-1] and b > ys[-1]:
            xs.append(a); ys.append(b)
    xs.append(END); ys.append(END)
    warp = lambda t: float(np.interp(t, xs, ys))
    edl = os.path.join(ROOT, "data", "edl.tsv")
    rows = [l.split() for l in open(src_edl) if l.strip() and not l.startswith("#")]
    pos = [round(warp(float(r[2])) * 25) / 25 for r in rows] + [END]
    out = []
    for k, r in enumerate(rows):
        out.append("%.3f\t%.3f\t%.3f\t%s" % (float(r[0]), pos[k + 1] - pos[k], pos[k], r[3]))
    open(edl, "w").write("\n".join(out) + "\n")
    first_t = next(p for p, r in zip(pos, rows) if r[3] == "T")
    g = os.path.join(ROOT, "pipeline", "graph.txt")
    s = open(g).read()
    s = re.sub(r"lt\(t\\,[0-9.]+\)", "lt(t\\\\,%.2f)" % first_t, s)
    open(g, "w").write(s)
    short = [(k + 1, round(pos[k + 1] - pos[k], 2)) for k in range(len(rows)) if pos[k + 1] - pos[k] < 1.0]
    print("re-timed %d shots; intro card now ends at %.2f s" % (len(rows), first_t))
    if short:
        print("shots under 1s:", short)

if __name__ == "__main__":
    main(*sys.argv[1:])
