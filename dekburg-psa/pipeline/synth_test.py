# -*- coding: utf-8 -*-
"""Regression test for auto_align.py against KNOWN timing.

    python3 pipeline/synth_test.py [--models models] [--work work/synth]

A TTS voice reads all 53 script lines at known times over a synthetic club bed
(11s instrumental intro, vocal ~6.6dB under the music). The aligner runs on the mix
and every line start is scored against the truth. Session-2 result: median 0.10s,
max 0.22s, 45-47/53 lines confirmed by both recognisers (TTS output varies per run).
Exits non-zero if any line is off by more than 0.3s.
"""
import argparse, json, os, subprocess, sys
import numpy as np, soundfile as sf, sherpa_onnx as so
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import auto_align

TTS_URL = ("https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/"
           "vits-piper-en_US-amy-low.tar.bz2")

def build(models, work):
    M = os.path.join(models, "vits-piper-en_US-amy-low")
    if not os.path.isdir(M):
        subprocess.run("curl -fsSL %s | tar xj -C %s" % (TTS_URL, models), shell=True, check=True)
    lines = json.load(open(os.path.join(auto_align.DATA, "official_lines.json"), encoding="utf-8"))
    tts=so.OfflineTts(so.OfflineTtsConfig(model=so.OfflineTtsModelConfig(
        vits=so.OfflineTtsVitsModelConfig(model=M+"/en_US-amy-low.onnx",tokens=M+"/tokens.txt",data_dir=M+"/espeak-ng-data"),
        num_threads=4)))
    SR=44100; rng=np.random.default_rng(7)
    dur=202.92; N=int(dur*SR)
    voc=np.zeros(N,np.float32); truth=[]; t=10.92
    for i,(cap,al,jp) in enumerate(lines):
        a=tts.generate(al, sid=0, speed=float(rng.uniform(0.8,1.05)))
        x=np.asarray(a.samples,np.float32)
        x=np.interp(np.arange(int(len(x)*SR/a.sample_rate))*a.sample_rate/SR, np.arange(len(x)), x).astype(np.float32)
        # trim TTS leading/trailing silence so truth = first/last audible sample
        e=np.abs(x)>0.02*np.abs(x).max(); nz=np.flatnonzero(e); x=x[nz[0]:nz[-1]+1]
        s=int(t*SR); x=x[:max(0,N-s)]; voc[s:s+len(x)]+=x/np.abs(x).max()*0.5
        truth.append({"i":i+1,"start":round(t,3),"end":round(t+len(x)/SR,3),"text":al})
        t+=len(x)/SR+float(rng.uniform(0.6,3.3))
        if t>dur-3: break
    tt=np.arange(N)/SR; bpm=124; beat=60/bpm
    def env(ph,k): return np.exp(-ph*k)
    ph=np.mod(tt,beat)
    kick=np.sin(2*np.pi*(50+120*env(ph,30))*ph)*env(ph,9)
    hat=rng.standard_normal(N)*env(np.mod(tt+beat/2,beat),60)*0.25
    hat=np.diff(hat,prepend=0)
    notes=[41.2,41.2,49.0,36.7]; bar=np.floor(tt/(4*beat)).astype(int)%4
    f=np.array(notes)[bar]; bass=2*(np.mod(tt*f,1)-0.5)*env(np.mod(tt,beat/2),6)*0.5
    chords=[[220,261.6,329.6],[196,246.9,293.7],[174.6,220,261.6],[164.8,207.7,246.9]]
    pad=np.zeros(N)
    for k in range(3):
        fk=np.array([c[k] for c in chords])[bar]
        pad+=np.sin(2*np.pi*fk*tt+np.sin(2*np.pi*0.3*tt))*0.12
    lead=np.sin(2*np.pi*np.array([440,523.3,587.3,659.3])[(np.floor(tt/beat).astype(int))%4]*tt)*env(ph,4)*0.12
    mus=0.9*kick+hat+0.6*bass+pad+lead
    L=mus+0.15*np.roll(pad,441); R=mus-0.15*np.roll(pad,441)
    g=float(os.environ.get("VOCGAIN","0.6")); mix=np.stack([L*0.35+voc*g, R*0.35+voc*g],1)
    mix/=np.abs(mix).max()*1.05
    g = 0.6
    mix = np.stack([L * 0.35 + voc * g, R * 0.35 + voc * g], 1)
    mix /= np.abs(mix).max() * 1.05
    os.makedirs(work, exist_ok=True)
    sf.write(os.path.join(work, "synth_mix.wav"), mix.astype(np.float32), SR)
    json.dump(truth, open(os.path.join(work, "truth.json"), "w"), indent=0)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", default="models")
    ap.add_argument("--work", default="work/synth")
    a = ap.parse_args()
    if not os.path.exists(os.path.join(a.work, "synth_mix.wav")):
        build(a.models, a.work)
    truth = json.load(open(os.path.join(a.work, "truth.json")))
    rep = auto_align.run(os.path.join(a.work, "synth_mix.wav"), a.work, a.models)
    err = np.array([rep["starts"][i] - t["start"] for i, t in enumerate(truth)])
    for i, t in enumerate(truth):
        flag = "  <-- off" if abs(err[i]) > 0.3 else ""
        print("%-3d truth %7.2f  got %7.2f  %+5.2f  %-8s%s" % (i + 1, t["start"], rep["starts"][i], err[i], rep["status"][i], flag))
    print("median |err| %.2f  p90 %.2f  max %.2f  both=%d/53" % (np.median(abs(err)), np.percentile(abs(err), 90),
          abs(err).max(), rep["status"].count("both")))
    sys.exit(0 if abs(err).max() <= 0.3 else 1)
