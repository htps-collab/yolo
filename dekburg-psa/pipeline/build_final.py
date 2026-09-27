# -*- coding: utf-8 -*-
"""Takes an ordered English line list -> finished bilingual PSA video."""
import sys, re, difflib, subprocess, numpy as np
D="/tmp/claude-0/-home-user-yolo/a7ab82fc-862c-58df-9672-3ae93c7fe1cc/scratchpad"
PINK="&H00CC66FF&"; BLUE="&H00FFA64D&"; GOLD="&H0000D7FF&"; WHITE="&H00FFFFFF&"

def norm(s): return re.sub(r"[^a-z0-9 ]","",re.sub(r"\s+"," ",s.lower().replace("...", " "))).strip()

def _envelope():
    x=np.load(D+"/vocal.npy"); hop=320; n=len(x)//hop
    env=np.sqrt(np.array([(x[i*hop:(i+1)*hop]**2).mean() for i in range(n)])+1e-12)
    env=np.convolve(env,np.ones(5)/5,mode='same')
    return 20*np.log10(env+1e-9)

def reconcile(segs, target, db):
    """Merge/split detected phrases until there is exactly one per line."""
    segs=[list(s) for s in segs]
    while len(segs)>target:                      # merge across the smallest gap
        gaps=[(segs[i+1][0]-segs[i][1], i) for i in range(len(segs)-1)]
        _,i=min(gaps)
        segs[i][1]=segs[i+1][1]; segs.pop(i+1)
    while len(segs)<target:                      # split the longest at its quietest point
        durs=[(s[1]-s[0], i) for i,s in enumerate(segs)]
        _,i=max(durs); a,b=segs[i]
        lo,hi=int(a/0.02),int(b/0.02)
        pad=max(1,int((hi-lo)*0.25))
        win=db[lo+pad:hi-pad]
        cut=(a+b)/2 if len(win)==0 else (lo+pad+int(np.argmin(win)))*0.02
        segs[i]=[a,cut]; segs.insert(i+1,[cut,b])
    return [tuple(s) for s in segs]

def phrases(target):
    db=_envelope(); n=len(db)
    best=None
    for pct in np.arange(20,62,0.5):
        for gap in (6,8,10,12):
            v=db>np.percentile(db,pct); segs=[];i=0
            while i<n:
                if v[i]:
                    j=i
                    while j<n and (v[j] or (j+gap<n and v[j:j+gap].any())): j+=1
                    segs.append((i*0.02,j*0.02)); i=j
                else: i+=1
            segs=[s for s in segs if s[1]-s[0]>0.28]
            d=abs(len(segs)-target)
            if best is None or d<best[0]: best=(d,segs,pct,gap)
            if d==0: return segs,pct,gap
    segs=reconcile(best[1],target,db)
    return segs,best[2],best[3]

def colourise(en, jp):
    """Pink 'clench', blue 'release', fade out on the release beat."""
    fade=r"{\fad(80,140)}"
    if re.search(r"\bclench|\brelease\b", en, re.I):
        fade=r"{\fad(120,650)}"
        def paint(t, rel_word):
            parts=re.split("("+rel_word+")", t, flags=re.I)
            out=""
            for p in parts:
                if not p: continue
                out += ("{\\c"+BLUE+"}" if re.fullmatch(rel_word,p,re.I) else "{\\c"+PINK+"}")+p
            return out
        return fade+paint(en,r"release[.!]?"), fade+paint(jp,r"緩めよ。?")
    return fade+"{\\c"+GOLD+"}"+en, fade+"{\\c"+WHITE+"}"+jp

def wrap_en(t, limit=44):
    """Balance a long English line over two rows instead of shrinking it."""
    if len(t)<=limit: return t, 31
    words=t.split(); best=None
    for i in range(1,len(words)):
        a=" ".join(words[:i]); b=" ".join(words[i:])
        cost=abs(len(a)-len(b))+max(0,max(len(a),len(b))-limit)*2
        if best is None or cost<best[0]: best=(cost,a,b)
    return best[1]+"\\N"+best[2], 28

def wrap_jp(t, limit=20):
    if len(t)<=limit: return t, 46
    mid=len(t)//2; cut=None
    for d in range(0,len(t)//2):
        for i in (mid-d, mid+d):
            if 0<i<len(t) and t[i-1] in "。、":
                cut=i; break
        if cut: break
    if cut is None: cut=mid
    return t[:cut]+"\\N"+t[cut:], 38


def main(linefile):
    lines=[l.strip() for l in open(linefile,encoding="utf-8") if l.strip()]
    jp={}
    for row in open(D+"/jp_table.tsv",encoding="utf-8"):
        e,j=row.rstrip("\n").split("\t"); jp[norm(e)]=(e,j)
    keys=list(jp)
    segs,pct,gap=phrases(len(lines))
    print("lines=%d  phrases=%d (pct=%.1f gap=%d)"%(len(lines),len(segs),pct,gap))
    if len(segs)!=len(lines): print("!! count mismatch - will pad/truncate")
    miss=[]
    ev=[]
    for i,en in enumerate(lines):
        if i>=len(segs): break
        st,et=segs[i]
        m=difflib.get_close_matches(norm(en),keys,n=1,cutoff=0.72)
        j = jp[m[0]][1] if m else ""
        if not m: miss.append(en)
        et=min(et+0.35, segs[i+1][0]-0.05 if i+1<len(segs) else et+0.6)
        enw,ensz=wrap_en(en); jpw,jpsz=wrap_jp(j)
        ent,jpt=colourise(enw, jpw)
        def ts(t): 
            h=int(t//3600); m_=int(t%3600//60); s=t%60
            return "%d:%02d:%05.2f"%(h,m_,s)
        ev.append("Dialogue: 0,%s,%s,JP,,0,0,0,,{\\pos(480,560)\\fs%d}%s"%(ts(st),ts(et),jpsz,jpt))
        ev.append("Dialogue: 0,%s,%s,EN,,0,0,0,,{\\pos(480,648)\\fs%d}%s"%(ts(st),ts(et),ensz,ent))
    head=open(D+"/sample.ass").read().split("[Events]")[0]
    with open(D+"/final.ass","w",encoding="utf-8") as f:
        f.write(head+"[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n")
        f.write("\n".join(ev)+"\n")
    if miss:
        print("NO JAPANESE for %d line(s):"%len(miss))
        for m_ in miss: print("   -",m_)
    print("wrote final.ass with %d cues"%(len(ev)//2))

if __name__=="__main__": main(sys.argv[1])
