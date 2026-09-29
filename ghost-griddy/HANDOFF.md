# Handoff — Ghost Griddy clip (roaming camera)

Seedance 2.0 R2V on Venice.ai. 11 seconds, 9:16 vertical.

---

## 1. What this shot is

A second camera at the mansion party. A handheld operator on a 14mm
ultra-wide walks through the crowd filming the room. Somewhere in the
background, a semi-transparent 18th-century ghost is doing the Griddy,
deadpan, and nobody — including the cameraman — notices.

This is a **new camera angle**, not a locked-off shot. It is the only clip
in this project where the model invents the camera rather than copying it
from source footage.

---

## 2. Upload manifest

All files are in `references/`.

| Slot | File | Tag | Carries |
|---|---|---|---|
| Video | `griddy_reference_clean.mp4` | `@Video1` | The Griddy move, nothing else |
| Image 1 | `bingo8.jpg` | `@Image1` | Faces, wigs, gown colours, colour grade |
| Image 2 | `bingo7.jpg` | `@Image2` | More faces, second angle on same crowd |
| Image 3 | `bingo5.jpg` | `@Image3` | Room at head height, windows, plasterwork |
| Image 4 | `Bingo2.jpg` | `@Image4` | Full room layout, fresco, archway |

**If only three image slots are available:** drop `bingo7.jpg`. Then
`bingo8` = `@Image1`, `bingo5` = `@Image2`, `Bingo2` = `@Image3`, and edit
the ROOM paragraph in the prompt to say `@Image2 and @Image3`.

Set the aspect ratio dropdown to 9:16 in the Venice UI as well as in the
prompt. The in-prompt lock is a fallback, not a replacement.

### Notes on specific files

- `bingo8.jpg` is byte-identical to `thiisss2.jpg`. Either name works.
- `bingo5.jpg` matters more than its slot position suggests. It is the
  only frame shot at head height from inside the crowd, and the only one
  showing the tall arched windows and the rococo plasterwork on that wall.
  The roaming camera occupies that exact viewpoint. Without it the model
  has to invent that entire side of the room.
- Images here are resized to 768px wide, 150–190 KB each. The video is
  3.3s H.264, no audio, 663 KB. Earlier "failed to fetch" errors on Venice
  were upload-weight problems — this whole set is smaller than one
  original file.

### `@Video1` means something different in this prompt

In every earlier prompt in this project, `@Video1` locked the camera and
the DJ's movement to source footage. **Here it supplies a body movement
only.** The four lines in the GHOST section reading "take ONLY the dance
movement / do NOT copy its setting" are what hold that distinction. Do not
cut them if the prompt needs shortening.

The reference clip also shows the man walking forward while he dances. The
ghost must stay planted. That negation is explicit in the prompt and must
survive any edit.

---

## 3. The prompt

```
Vertical 9:16 aspect ratio, portrait orientation, tall vertical frame,
taller than wide, do not output landscape, do not output 16:9, do not
output square.

This is a SECOND CAMERA at the party shown in @Image1, @Image2, @Image3 and
@Image4 — a different operator, a different angle, the same room, the same
night, the same people. Do not reproduce the framing of any of those
images.

CAMERA: one continuous handheld shot on a 14mm ultra-wide lens at head
height, held by an operator walking through the crowd. Ultra-wide look:
barrel distortion, curved edges, deep focus, exaggerated depth where people
close to the lens loom large. He moves the way a real person with a camera
moves at a party — walks slowly forward through the guests, weaving between
them, turning his shoulders to catch faces as he passes, pausing on a group
for a second before drifting on. Wigs, shoulders and raised champagne
flutes pass close across the lens. Natural handheld: weight shifts,
breathing drift, small framing corrections, soft bumps as people brush
past. No gimbal glide, no tripod smoothness, no whip pans. Framing is
slightly imperfect — not perfectly centred, horizon a degree or two off.
One unbroken take, no cuts.

THE ROOM comes from @Image3 and @Image4. @Image3 shows this room at head
height from inside the crowd — the tall arched windows, the ornate rococo
plasterwork, the panelled walls, the warm lights of the building outside.
@Image4 shows the full room layout, the baroque domed cherub fresco on the
ceiling, the archway and the second room beyond it. Build the space from
these two. Deep purple and magenta lighting throughout, warm practical
lights low in the room.

THE PEOPLE are the same guests shown in @Image1 and @Image2 — 1700s
aristocrats in powdered wigs, silk gowns, brocaded coats, lace fans and
champagne flutes. Match their faces, wig styles and costume colours to
those two images. Keep the exact colour grade of @Image1 — warm champagne
and gold crowd against cooler purple walls. Do not cool the crowd toward
teal or navy, do not darken the scene, do not re-grade. Everyone in every
layer is in full period costume. No modern clothing, no bare heads, no
generic extras.

THE BALANCE, the key crowd instruction: most of the crowd is facing the DJ
and moving to the music — dancing, bouncing on the beat, nodding hard, arms
up, hips going, drinks raised, some with eyes closed locked in. That is the
default state of this room. Woven through that, smaller groups are talking
and laughing while they dance — leaning in to shout over the music without
stopping moving, pulling back to laugh, clinking flutes mid-dance, grabbing
a friend's arm and pointing at the DJ. The talking happens WHILE they
dance, not instead of dancing. Nobody has turned their back on the music
for a full conversation. A couple are filming the DJ on phones, one is
filming a friend dancing badly, one is pushing toward the front for a
better view. Most of the frame is dancing and watching the DJ; a smaller
number are dancing and talking at once. Keep that ratio. Movement is loose
and individual — no two people doing the same thing, no synchronised
bobbing, no generic AI dance loops. A couple of people notice the camera
and give it a quick grin or a raised glass before carrying on.

THE GHOST — one single additional figure, played completely straight:
A semi-transparent woman in an 18th century gown stands among the crowd,
off to one side of the room. She is see-through — guests, walls and
furniture behind her are clearly visible THROUGH her body and gown, like a
double exposure. She is pale and drained of colour, grey and washed out,
while everyone around her stays warm champagne and gold. She has NO glow,
NO light emission, NO blue or white aura, NO particle effects, NO motion
trail, NO digital VFX look. She is simply transparent, otherwise
photographed exactly like everyone else under the same purple lighting.

She is doing the Griddy dance exactly as demonstrated in @Video1. Match the
move from @Video1 precisely: the footwork, the swinging legs, the bounce,
and the hands raised beside her eyes making circles with thumb and index
finger. Take ONLY the dance movement from @Video1 — ignore everything else
about that clip. Do NOT copy its setting, its lighting, its clothing, its
camera framing, or its bright indoor look. Critically, the man in @Video1
walks forward while dancing — the ghost does NOT travel. She stays planted
in one spot for the entire clip, doing the move on the same patch of floor.

This is specifically the Griddy from @Video1 — NOT breakdancing, NOT the
running man, NOT the floss, NOT generic dancing, NOT arm waving.

She does it continuously, fully committed, completely deadpan with a
neutral serene expression — she never smiles, never laughs, never looks
pleased with herself. She is doing it perfectly and taking it entirely
seriously.

CRITICAL: absolutely nobody notices her. No one reacts, turns, points,
stares or acknowledges her. Every guest continues dancing and talking
exactly as they were. She is invisible to them.

CRITICAL: the camera does not follow her, does not pan toward her, does not
centre her. The operator never notices her. As he walks through the crowd
she simply passes through part of the frame in the background — sometimes
only partly in shot, sometimes near the edge — and he keeps moving past
her. She is incidental background, never the subject. Guests walk in front
of her and behind her.

She does not fade out. She is still going when the clip ends.

Audio: no music generated, no crowd noise, no chatter, no cheering, no
ambient room sound. The only audio is the clean line-out signal from the
DJ's mixer with no room acoustics.
```

---

## 4. If it comes back wrong

Diagnose in this order. Fix one thing per regeneration.

**Room geometry is invented / walls look wrong**
Shorten the camera move. Replace "walks slowly forward through the guests,
weaving between them" with a slow pan and a single half-step from one
position. Less travel means less architecture the model has to invent.

**The ghost renders solid, or flickers between solid and transparent**
This is the most likely failure. Persistent semi-transparency across a
moving handheld shot is genuinely hard for video models. Budget two or
three generations. If it will not hold, go to the composite route in
section 5.

**Someone reacts to the ghost**
Strengthen the negation: add "not a single person in the frame looks at
her, turns toward her, or changes what they are doing at any point."

**Camera drifts toward the ghost or centres her**
Move her further toward the frame edge in the description, and add "she is
never in the centre third of the frame."

**Crowd is talking but nobody is watching the DJ**
This was a failure in an earlier round. The load-bearing line is "the
talking happens WHILE they dance, not instead of dancing." Make sure it
survived any edit.

**Crowd is too busy / looks staged and over-choreographed**
Cut the "a couple are filming the DJ on phones, one is filming a friend
dancing badly, one is pushing toward the front" sentence. That is the most
expendable specificity in the crowd block.

**The Griddy is still wrong**
The hand gesture is weakly represented in the reference — the man does the
eye-circles only briefly at the start, then switches to arm swings. If the
hands are the problem, source a second reference clip where the eye-circle
gesture is held throughout.

**Generation is rejected before it starts**
Historically this has been a Venice-side network issue, not a prompt
problem. Test with a trivial text-only prompt first. If that works, it is
an upload problem — but this reference set is already small, so check
session and VPN before blaming the files.

---

## 5. Fallback: composite in post

If the ghost will not hold transparency after a few attempts, stop
fighting it:

1. Generate the crowd clip clean, with the entire GHOST section deleted
   from the prompt. Everything else stays.
2. Generate the ghost separately — same room references, one figure doing
   the Griddy, no crowd.
3. Composite at reduced opacity.

More work, but you get exact control over how see-through she is, and you
keep the crowd balance without risking it on every regeneration.

---

## 6. Project context for anyone picking this up cold

This clip is part of a series. Established conventions across all prompts:

- Aspect ratio is bookended — stated at the top and again at the bottom —
  because ratio drift was an early recurring failure.
- Audio is always enumerated negatives followed by one positive source
  (mixer line-out only).
- The crowd colour grade is warm champagne and gold against cooler purple
  walls. Protect this explicitly. Models drift it cool when re-rendering a
  crowd, and a large amount of work went into fixing exactly that drift in
  the still-image stage.
- "No modern clothing, no bare heads, no generic extras" is a standing
  rule. Deep background figures default to modern NPCs without it.
- Enumerated negatives beat blanket ones. "NOT breakdancing, NOT the
  running man, NOT the floss" works where "only the Griddy" does not. Same
  technique fixed coloured drone lights in an earlier clip.
