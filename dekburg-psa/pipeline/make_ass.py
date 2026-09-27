# -*- coding: utf-8 -*-
import json,re
D="/tmp/claude-0/-home-user-yolo/a7ab82fc-862c-58df-9672-3ae93c7fe1cc/scratchpad"
PINK="&H00CC66FF&"; BLUE="&H00FFA64D&"; GOLD="&H0000D7FF&"; WHITE="&H00FFFFFF&"
REL=r"rele+a*se+"
def esc(t): return t.replace("\\","").replace("{","(").replace("}",")")
def wrap_en(t,lim=42):
    if len(t)<=lim: return t,31
    w=t.split(); best=None
    for i in range(1,len(w)):
        a=" ".join(w[:i]); b=" ".join(w[i:])
        c=abs(len(a)-len(b))+max(0,max(len(a),len(b))-lim)*2
        if best is None or c<best[0]: best=(c,a,b)
    return best[1]+r"\N"+best[2],28
def wrap_jp(t,lim=20):
    if len(t)<=lim: return t,46
    mid=len(t)//2; cut=None
    for d in range(len(t)//2):
        for i in (mid-d,mid+d):
            if 0<i<len(t) and t[i-1] in "。、": cut=i;break
        if cut:break
    cut=cut or mid
    return t[:cut]+r"\N"+t[cut:],38
def paint(t,pat):
    out="";parts=re.split("("+pat+"[.,!]*)",t,flags=re.I)
    for p in parts:
        if not p: continue
        col=BLUE if re.fullmatch(pat+"[.,!]*",p,re.I) else PINK
        out+="{\\c"+col+"}"+p
    return out
def ts(t):
    h=int(t//3600);m=int(t%3600//60);s=t%60
    return "%d:%02d:%05.2f"%(h,m,s)
cues=json.load(open(D+"/cues.json"))
ev=[]
for c in cues:
    en,jp=esc(c["cap"]),esc(c["jp"])
    isc=bool(re.search(r"clench|cleancen|"+REL,en,re.I))
    enw,ensz=wrap_en(en); jpw,jpsz=wrap_jp(jp)
    if isc:
        fade=r"{\fad(120,650)}"
        ent=fade+paint(enw,REL); jpt=fade+paint(jpw,"緩めよ")
    else:
        fade=r"{\fad(80,140)}"
        ent=fade+"{\\c"+GOLD+"}"+enw; jpt=fade+"{\\c"+WHITE+"}"+jpw
    ev.append("Dialogue: 0,%s,%s,JP,,0,0,0,,{\\pos(480,560)\\fs%d}%s"%(ts(c["start"]),ts(c["end"]),jpsz,jpt))
    ev.append("Dialogue: 0,%s,%s,EN,,0,0,0,,{\\pos(480,648)\\fs%d}%s"%(ts(c["start"]),ts(c["end"]),ensz,ent))
head=open(D+"/sample.ass").read().split("[Events]")[0]
open(D+"/final.ass","w",encoding="utf-8").write(
  head+"[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"+"\n".join(ev)+"\n")
print("wrote %d cues"%len(cues))
