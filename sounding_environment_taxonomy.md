# The Sounding Environment → Muster: A Taxonomy for Harmonizing With Found Pitch

*A design-facing classification of dependably-pitched everyday sound sources, mapped onto Muster's own schema. For every source, the question is not "is this a nice sound?" but "can the system trust its pitch, and what role does it play in the harmonic network?" Sources are classified along two axes:*

- **Role** — how the source participates in the network:
  - **ANCHOR** — always-sounding (or duty-cycled). Does NOT add a voice; it *filters* which scales the room can use. The room is already committed to this pitch whether anyone plays or not. (Nathan's "anchors" concept — the fridge hum that constrains rather than contributes.)
  - **EVENT** — an ordinary cueable/waitable voice. Intermittent, triggered by the world or a performer (a train passes, a load finishes, a phone is dialed). Contributes a voice when it sounds and its pitch(es) fit the current scale.
  - **PLAYABLE / ADAPTIVE** — a chameleon voice that conforms to the room. Continuously tunable by the performer to match whatever the host broadcasts (wine glass fill level, whistling, slide). Never blocks a scale; it *becomes* the scale.

- **matchRule** — how its pitch content is tested against the broadcast scale (extending FOUND-INSTRUMENTS.md's `all` / `fundamental`, plus the newly-argued `coverage`):
  - **single** — one pitch class. Fits if that pc is in the scale. (Subject to the "promiscuity problem": one pitch fits ~30 of 57 scales.)
  - **fixed-set / all** — a fixed chord or melody; every pc must be in the scale (harmonica rule).
  - **fixed-set / fundamental** — first/root pc must fit, upper partials tolerated (bell rule).
  - **coverage / k-of-n** — a fixed pool where *k* of *n* pitch classes fit; contributes proportional voices. (The rule the best real instruments need — and, it turns out, the rule most rich found sources need too.)
  - **interval** — no fixed root; a dependable *interval or tempo* atop a variable pitch. Not directly harmonizable as a pitch object — usable as rhythmic/relative material only.

---

## The one big finding

**The sounding environment splits cleanly into three tiers, and each tier wants a different schema treatment:**

1. **A tiny set of true ANCHORS, all electrical.** Only mains hum (and the compressor/transformer hum riding on it) is genuinely always-on and grid-locked. This is the *only* category that should be wired as a scale-filtering anchor. Everything else people call "ambient" is actually intermittent.

2. **A large, rich set of EVENT chords — and they are mostly fixed-SET, not single-pitch.** Train horns, transit chimes, telephony tones, clock/network chimes, appliance melodies. The environment's most valuable found material is *already chords*. This is direct external evidence for the `coverage`/fixed-set argument: the world hands you multi-note objects, and forcing them through a single-pitch model throws away their whole identity.

3. **A quiet third role the schema doesn't yet name: ADAPTIVE voices.** Wine glasses, whistling, slide whistles, tuning-by-fill sources. They have no fixed pitch to test — they *conform*. These are the natural companions to anchors: an anchor says "the room is in G," an adaptive voice instantly *becomes* G. Worth a first-class role.

---

## Tier 1 — ANCHORS (always-on; filter the network, add no voice)

These are the sources that justify Nathan's anchor concept. They sound whether or not anyone is playing, so they don't "count" as voices — they constrain which scales the host may broadcast (any legal scale must contain the anchor's pitch class, exactly as La Monte Young tunes *Dream House* to the 60 Hz grid).

| Source | Pitch | matchRule | Notes for Muster |
|---|---|---|---|
| [Mains hum, 60 Hz](https://www.johndcook.com/blog/2014/04/30/electrical-hum/) (US/Canada) | ~58–60 Hz ≈ **B♭/B**, harmonics 120/180/240 Hz | single (pc = B♭ or B) | The canonical anchor. Present in every powered building. Host scales should be constrained to include this pc. |
| [Mains hum, 50 Hz](https://sengpielaudio.com/calculator-notenames.htm) (Europe/Asia — incl. **Bangkok**) | ~49–50 Hz ≈ **G** | single (pc = G) | The anchor for Nathan's actual location. A Muster session in Thailand is natively a "G-room." |
| [Fridge / HVAC compressor hum](https://www.reddit.com/r/musictheory/comments/12bwy3c/does_humming_hz_identify_machine_rpm/) | Mains-linked (50/60 Hz + 100/120 Hz harmonic) | single | **Quasi-anchor**: dependable pitch *while running*, but duty-cycled. Schema idea: an anchor with an `active` flag — filters only when on. |
| [Transformer / fluorescent-ballast hum](https://www.reddit.com/r/askscience/comments/2yqmwl/why_does_nearly_everything_i_hear_thats_plugged/) | Same 50/60 Hz family | single | Reinforces the mains anchor; not an independent one. |
| [CRT flyback whine](https://en.wikipedia.org/wiki/Flyback_transformer) | 15,734 Hz (NTSC) / 15,625 Hz (PAL) | single (near hearing limit) | Precise but obsolete → **"legacy anchor."** Charming for a retro/CRT-room install; not a mainstream anchor. |

**Design implication:** Anchors need only the `single` matchRule and an `always-on`/`duty-cycled` flag. The host UI should show the room's anchor pitch(es) and grey out any scale that omits them — the room's electricity is the first "player" to sit down.

---

## Tier 2 — EVENT voices (cueable/waitable; add a voice when they fit)

Ordinary voices in the schema's sense. Sub-grouped by how strong the pitch guarantee is.

### 2a. Gold-standard fixed CHORDS — treat as chord objects (matchRule: coverage / all)

These are the crown jewels. Physically tuned, exactly documented, reliable every time. **Argument for the system: model each as a multi-pc object with `coverage`, not a single pitch.** A K5LA train horn IS a B6 chord — its whole value is the chord.

| Source | Notes / chord | Freqs | matchRule |
|---|---|---|---|
| [Nathan K5LA train horn](https://en.wikipedia.org/wiki/Nathan_Manufacturing) | **B major 6th** — D♯4 F♯4 G♯4 B4 D♯5 | 311/370/415/494/622 Hz | coverage (k-of-5) or all |
| [Nathan K5H train horn](https://hornblasters.com/pages/nathan-airchime-train-horns) | **D♯ minor 6th** — D♯ F♯ A C D♯ | — | coverage / all |
| [Nathan P5/P5A train horn](http://www.vibrationdata.com/Newsletters/June2003_NL.pdf) | **A dominant 7th** — C♯ E G A C♯ | — | coverage / all |
| [Transit door chimes (Toronto docs)](https://www.trha.ca/rhythms-on-the-railway-notating-commonly-heard-sounds-on-railways-in-toronto-the-gta-and-southern-ontario/) | Per-line: B7 arpeggio, Dm7, G-D-E-C, B♭-C-E♭ triplet, octave-G e-bell | — | coverage / fixed-set |
| [NBC chimes](https://en.wikipedia.org/wiki/NBC_chimes) | **G3–E4–C4** (trademarked, exact) | — | fixed-set (melody) |
| [Westminster Quarters](https://www.steebar.com/westminster-chimes-notes/) (Big Ben, mantel clocks) | 4 bells, commonly G3-F3-E3-B3 | — | fixed-set (melody) |
| [Church bell / carillon](https://www.gcna.org/about-carillons) | Strike note = virtual pitch from nominal/superquint partials | bell-specific | **fundamental** (root fits; partials tolerated) — the literal bell rule |

### 2b. Fixed melodies (appliance / manufactured) — matchRule: fixed-set or coverage

| Source | Content | matchRule |
|---|---|---|
| [Samsung washer/dryer end chime](https://www.hunker.com/13771126/samsung-laundry-song/) | Schubert *Die Forelle* (fixed per model, transposable) | fixed-set (melody) |
| [LG washer/dryer end chime](https://www.lg.com/us/support/help-library/how-to-turn-onoff-the-washer-chime--20154464592039) | Proprietary fixed melody | fixed-set |
| Car door / seatbelt / turn-signal chimes ([harmony engineers](https://www.cbsnews.com/video/harmony-engineers-make-your-car-sound-musical/)) | Brand-tuned tones | fixed-set (per vehicle) |

### 2c. Exact regulated telephony tones — matchRule: fixed-set (dyads), extremely dependable

A ready-made ~16-tone palette held to tight tolerances by design.

| Source | Frequencies | matchRule |
|---|---|---|
| [NA dial tone](https://www.edn.com/comparing-dial-tone-signals/) | 350 + 440 Hz | fixed-set (dyad) |
| [NA busy signal](https://en.wikipedia.org/wiki/Busy_signal) | 480 + 620 Hz | fixed-set (dyad) |
| Ringback | 440 + 480 Hz | fixed-set (dyad) |
| [DTMF touch-tones](https://w4zt.com/freqs/dtmf.html) | 697/770/852/941 × 1209/1336/1477/1633 Hz | fixed-set (16 dyads) — a whole "keypad instrument" |

### 2d. Single-pitch or borderline events — matchRule: single (watch the promiscuity problem)

| Source | Pitch | Note |
|---|---|---|
| [Kettle whistle](https://makersportal.com/blog/2017/9/24/acoustic-signature-of-a-tea-kettle) | ~1,400–2,500 Hz, fixed per unit | Measure per-kettle → template. |
| [Smoke/CO alarm](https://www.oaktreeproducts.com/smoke-detector-research) | ~3,000–4,000 Hz (regulated band) | Borderline; "around 3–4 kHz." |
| [Ship horn / foghorn](https://kahlenberg.com/pages/international-rules-for-sound-signaling-imo-72-colregs) | 70–2,100 Hz band, lower = bigger ship | Regulated *range*, not a note. Low-drone event. |
| Microwave/oven beep, power-on chime, shop-door bell | Not standardized | Fixed per unit; measure on install. |

### 2e. Interval / tempo generators — matchRule: interval (NOT directly harmonizable)

Dependable *relationships*, not fixed pitches. Usable as rhythmic or relative material, or as a "the room is doing a minor third right now" cue — but they can't be tested against a scale as a pitch object.

| Source | What's dependable | Note |
|---|---|---|
| [Black-capped chickadee "fee-bee"](https://www.americanscientist.org/article/relative-pitch-and-the-song-of-black-capped-chickadees) | Interval ratio ≈1.134 (≈whole tone); absolute root drifts ~800 Hz | Reliable interval, variable root. |
| [Common cuckoo](https://birdwatchingalentejo.com/cuckoo-koekoek-kuckuck-cuco-canoro-cuco-comun/) | Descending minor 3rd early season, widens later | Seasonal drift. |
| [Crickets — Dolbear's Law](https://en.wikipedia.org/wiki/Dolbear's_law) | Chirp *rate* ∝ temperature | Tempo cue, unpitched timbre. |

---

## Tier 3 — PLAYABLE / ADAPTIVE voices (conform to the room; never block a scale)

**This is the third role the schema should add.** These sources have no fixed pitch to test against a scale — instead the performer tunes them, in real time, to whatever the host broadcasts. They are the perfect partners for anchors: the anchor declares the room's pitch; the adaptive voice instantly matches it. They should always "fit" (they contribute a voice at whatever pc is requested), so they never appear greyed-out.

| Source | How it's tuned | Role |
|---|---|---|
| [Glass harp / singing wine glass](https://protonsforbreakfast.wordpress.com/tag/wine-glasses/) | Fill level (770–2,400 Hz empty, filled = 49–65% of that) | Adaptive — pre-fill to target scale degrees. |
| [Human whistling / humming](https://en.wikipedia.org/wiki/Whistling) | Voluntary, instant | The most flexible found voice — always matches the host. |
| [Tuning fork A440](https://en.wikipedia.org/wiki/Tuning_fork) | Fixed 440 Hz — the reference itself | Gold-standard fixed pitch; the calibration source, not a voice. |
| Slide whistle / trombone / bottle-blow | Continuous glide | Adaptive glissando voice. |

**Schema proposal:** add role `adaptive` (or `playable`) with `matchRule: any`. It contributes `min(copies, requestedVoices)` and is never filtered. In the UI it renders as an always-available node that "snaps" to the current scale — visually the inverse of an anchor (an anchor constrains the room; an adaptive voice is constrained *by* it).

---

## Explicitly NOT harmonizable (flag as noise/texture, keep out of the pitch model)

Include only as texture layers, never as scale-tested voices:

- [Car engine / RPM pitch](https://www.roadandtrack.com/new-cars/car-technology/a24655/the-science-behind-car-engine-sound-signatures/) — glissando with throttle.
- [EV pedestrian warning (AVAS)](https://en.wikipedia.org/wiki/Electric_vehicle_warning_sounds) — composed but pitch-bends with speed.
- Lawn mowers / leaf blowers / power tools — RPM-tracking drones.
- [Cicadas](https://gainwalkers.com/field-recording/recording-cicadas-tips-and-tricks/) — broad 3–17 kHz noise band.
- [Humpback whale song](https://www.nationalgeographic.com/animals/article/151207-humpback-whales-sounds-noises-oceans-animals) — structured but non-standardized (inspirational, not fixed).
- [Cat purr](https://en.wikipedia.org/wiki/Purr) ~25 Hz — sub-bass texture; too low/buzzy for a clean pitch (though it could be a felt sub-anchor in a very quiet room).

---

## Site-specific "muster" scenarios

The feedback loop Nathan described — *instruments lying around motivate a scale network, which then marshals those instruments in real time* — becomes concrete once you know a room's fixed sound inventory. To "muster a room" is to inventory its dependable pitches and let them shape the available harmony.

- **Muster a laundromat.** Anchor: 50/60 Hz mains + dozens of duty-cycled compressor/motor hums. Events: [Samsung *Die Forelle*](https://www.hunker.com/13771126/samsung-laundry-song/) and [LG](https://www.lg.com/us/support/help-library/how-to-turn-onoff-the-washer-chime--20154464592039) end-of-cycle melodies fire as loads finish — a self-scheduling generative score. Performers *start loads* to cue voices. Adaptive layer: whistlers fill the gaps.

- **Muster a kitchen.** Anchors: fridge/HVAC hum (quasi-anchor). Events: [kettle whistle](https://makersportal.com/blog/2017/9/24/acoustic-signature-of-a-tea-kettle) (measured per-kettle), microwave/oven "done" beeps (measured per-unit), timer chimes. Adaptive: wine glasses at the table, pre-filled to scale degrees. A dinner-party Muster where the appliances are the ensemble.

- **Muster a machine shop / factory floor.** Anchor: dense mains-hum bed + transformer/ballast hum. Events: tool/motor RPM = texture only (flag as noise). This is a Russolo *intonarumori* room — the anchor holds a single grid pitch while the machines glissando around it (the [Russolo](https://en.wikipedia.org/wiki/The_Art_of_Noises) → [La Monte Young](https://musicmavericks.publicradio.org/features/interview_young.html) axis made literal).

- **Muster a rail platform / transit station.** The richest chord environment. Anchors: station mains + HVAC. Events: [train horns](https://en.wikipedia.org/wiki/Nathan_Manufacturing) (fixed chords — B6, D♯m6, A7), [platform departure/door chimes](https://www.trha.ca/rhythms-on-the-railway-notating-commonly-heard-sounds-on-railways-in-toronto-the-gta-and-southern-ontario/) (per-line tuned arpeggios), [Westminster-style](https://www.steebar.com/westminster-chimes-notes/) station clock. The host broadcasts a scale that *the passing trains already fit*; performers time entries to arrivals.

- **Muster a phone booth / call center (period piece).** Events: [dial tone](https://www.edn.com/comparing-dial-tone-signals/) 350+440, [busy](https://en.wikipedia.org/wiki/Busy_signal) 480+620, [DTMF keypad](https://w4zt.com/freqs/dtmf.html) as a 16-tone instrument. A whole harmonic vocabulary from one telephone.

- **Muster a garden / porch.** Anchors: none reliable. Events: [wind chimes](https://www.bloomingexpert.com/garden/wind-chimes-meditation/) (pre-tuned pentatonic fixed-set, randomly struck — an "ambient random chord" the host can guarantee fits). Interval layer: [chickadees](https://www.americanscientist.org/article/relative-pitch-and-the-song-of-black-capped-chickadees)/[cuckoos](https://birdwatchingalentejo.com/cuckoo-koekoek-kuckuck-cuco-canoro-cuco-comun/) as relative-pitch commentary; [crickets](https://en.wikipedia.org/wiki/Dolbear's_law) as a temperature-driven clock.

---

## Artistic & academic lineage (why this is a real tradition, not a gimmick)

The core move — treating found/mechanical tones as pitched material to harmonize *with* — sits in a well-documented 20th-century lineage:

- **[Luigi Russolo, *The Art of Noises* (1913)](https://en.wikipedia.org/wiki/The_Art_of_Noises)** — the founding argument that machine noise is legitimate musical material; his *intonarumori* are the ancestors of the "machine shop" Muster.
- **[John Cage, *4′33″* (1952)](https://www.musicworks.ca/reviews/books/kyle-gann-no-such-thing-silence-john-cage%E2%80%99s-433)** — "there is no such thing as silence"; the room's ambient sound *is* the content. The conceptual root of treating found sound as the music.
- **[La Monte Young — *Dream House* / 60 Hz drone](https://musicmavericks.publicradio.org/features/interview_young.html)** — the most direct precedent: tunes his US electronics to the 60 Hz mains hum and *retunes to 50 Hz in Europe*. This is exactly Muster's anchor mechanic, decades early: "If you create music that is in tune with this hum, then there can never be an interference."
- **[R. Murray Schafer — *The Soundscape* (1977), "keynote sound"](https://musicstudios.calarts.edu/wp-content/uploads/2016/02/Shafer-Introduction.pdf)** — the ambient background tone of a place functions "like the tonal center of a piece of music... the anchor or fundamental tone." Schafer literally names the anchor concept, and calls to "find the secret of that tuning again."
- **[Pauline Oliveros — Deep Listening](https://www.hhv-mag.com/feature/pauline-oliveros-und-die-leise-subtile-revolution-des-hoerens/?lang=en)** — attentive listening to all incidental sound as compositional discipline; the listening practice Muster asks of its performers.

**Framing for Nathan:** Muster operationalizes Schafer's "keynote sound" and Young's 60 Hz drone as a live software mechanic. Where Young hand-tuned one installation to one grid, Muster reads the room's anchor and reshapes the *entire* available scale network around it in real time — and where Cage/Oliveros asked listeners to *notice* the sounding environment, Muster invites an ensemble to *harmonize with* it.

---

## Recommendations for the Muster schema

1. **Keep anchors single-pc + an `active`/`always-on` flag.** Mains hum is always-on; fridge/HVAC is duty-cycled. The host UI greys out any scale missing an active anchor's pc. (Bangkok = a native "G-room" at 50 Hz.)
2. **Model the great found chords as multi-pc `coverage` objects, not single pitches.** Train horns, transit chimes, telephony dyads, NBC/Westminster melodies — their identity IS the chord. This is strong external evidence for adding the `coverage` (k-of-n) rule you already needed for kalimbas/handpans/dulcimers.
3. **Add a third role: `adaptive` / `playable` with `matchRule: any`.** Wine glasses, whistling, slide sources conform to the room and should never be filtered — the inverse of an anchor. Together, anchor + adaptive is a complete feedback loop: the environment sets the key, the human instantly matches it.
4. **Use `fundamental` literally for bells.** Carillon strike note = virtual pitch from upper partials; the fundamental rule was practically invented for this.
5. **Keep RPM/engine/cicada/whale material out of the pitch model** — texture layers only, never scale-tested voices.
6. **"Muster a room" as a product ritual:** inventory a space's dependable pitches (anchors first, then measurable per-unit events), let them constrain the host's scale menu, then marshal performers/found-events against that scale in real time. That is the feedback loop, made literal.
