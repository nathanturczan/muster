# Found Instruments: Conductor-Side Design

Product thinking behind generalizing the harmonica conductor interface
(`webapp/`, now named **Muster**) to arbitrary "found instruments," aligned
with lalork-website issue #52 (Generalized "found instruments" interface).

Naming: the interface is **Muster**; the inventory is the
**instrumentarium**; the output concept is **found harmony**. See
`webapp/README.md`.

## Core insight

The conductor is the easy half of the abstraction. The performer side owns
the hard problems (spatial rendering, anticipation animation, per-instrument
geometry). The conductor only needs match math: given the ensemble's pooled
instruments, how many distinct simultaneous voices does each scale support?
Filtering, node sizing, layout, and detail lists all survive the
generalization structurally unchanged — the harmonica stops being hardcoded
and becomes one template among several.

The Firebase broadcast contract needs zero changes. `scaleData` is already
instrument-agnostic (a scale key); each performer's renderer decides what
that scale means for their instrument.

**Anticipation is entirely client-side.** The transition preview (which
notes leave, which arrive) is computed by each performer's renderer as a
diff between the scale it was previously showing and the one that just
arrived. No lookahead / `nextScaleData` field is needed in the broadcast;
current-scale-only stays the whole contract. The novelty lives in
per-instrument client-side rendering of harmonic transitions, not in the
transport.

## Instrument model (shared schema with lalork-website)

```js
{
  id: "...",
  label: "C harmonica",           // or "brass bell on desk"
  states: [                        // playable states
    { label: "OUT", pcs: [0, 4, 7] },
    { label: "IN",  pcs: [2, 5, 7, 9, 11] },
  ],
  matchRule: "all",                // "all" | "fundamental"
}
```

Decisions:

- **Absolute concert pitch classes per state**, not root + intervals. The
  root/interval formulation is an authoring convenience that lives only in
  the template constructors (`harmonica(root)` transposes Richter intervals
  at creation time). Storing absolute pcs keeps matching trivial and the
  schema uniform across instrument types.
- **Match rules**: `"all"` (every pc of the state must be in the scale — the
  harmonica rule) and `"fundamental"` (first pc must fit; remaining pcs are
  tolerated overtones, for bells/gongs). `"all"` is implemented first;
  the field exists in the schema from day one so documents never migrate.
- **Coverage matching (needed, not yet built)**: partial-set instruments —
  kalimba, steel tongue drum, handpan, Orff bars with removable bars,
  hammered dulcimer — are the most suitable real-world instruments per the
  practical research, and neither existing rule describes them. A 17-key
  kalimba in C almost never has *all* its pcs in a scale, but it can still
  play the intersection. Proposed rule: `matchRule: "coverage"` with a
  `minCoverage` (count or fraction) — the instrument fits when ≥ k of its n
  pitch classes are in the scale, and its voice contribution / detail line
  reflects the playable subset. This is the third rule the final form
  requires.
- Templates: harmonica (key), single pitch (bell, drum, whistle, recorder
  note), dyad (two-note chime). Two more identified by the research:
  - **Tuned set** — an array of single pitches distributed across players
    (boomwhackers, desk bells, handbells). One schema entry, but voices vs.
    players is ambiguous: eight desk bells can be one player or eight.
  - **Pre-filled trusted templates** from the pitch-reliability research:
    "8-note desk bell set (C major)", "C-major boomwhacker octave",
    "17-key kalimba in C", "9-note tongue drum in D minor", "handpan D
    kurd", "Orff diatonic bar set". Quick-adds matching what the $10–30
    market actually sells beat a free multi-state builder.
- Kalimba / sansula / hang get dedicated **performer** interfaces (per the
  issue), but conductor-side they are just another pcs-per-state description
  and can participate in voice counting with no special casing.

## Voice counting (generalizes the harmonica rule exactly)

**Group identical instruments; a group of n copies with k fitting states
contributes min(k, n) voices.**

- Three C harmonicas, scale fits OUT+IN → min(2, 3) = 2 voices
- One A harmonica, scale fits OUT+IN → min(2, 1) = 1 voice
- One bell whose pitch fits → 1 voice

This is the same rule that produced the "three C harps ≈ one" behavior and
the C-diatonic exception; the harmonica case falls out as a special case
rather than being the definition. Identity = states + matchRule (label
ignored), so two bells tuned to the same pitch also collapse into one voice.

A node is shown when its scale supports **≥ N simultaneous voices**
(threshold, default 2). Node size/color/ring = voice count.

## The promiscuity problem

Single-pitch instruments are promiscuous: a lone C bell fits every scale
containing pc 0 — roughly 30 of the 57. Pool a handful of bells and drums
and nearly every scale crosses the ≥2 threshold, so the network balloons
back toward 40+ nodes and the filter stops doing its job. The map's value
is its tightness.

Mitigations (both adopted):

1. **Threshold slider** — "show scales playable by ≥ N voices." With rich
   inventories you conduct at N=4 or 5 and the map stays tight. Falls out
   of the existing `byCount` grouping for free. Live testing confirmed the
   slider is the *primary interaction* for mixed inventories, not a
   mitigation: one added C bell took the default network from 12 to 28
   nodes; sliding to ≥3 brought it back to 11.
2. **Detail overflow handling** — node subtitles cap at 4 lines with
   "+N more"; the selected scale shows its full instrument list in a panel.
3. **Adaptive threshold (future)** — auto-suggest N from the pool: as
   single-pitch density and inventory size grow, default the slider higher
   (e.g., aim for a target node count in the 10–20 range) instead of always
   starting at 2.

## The three roles

Every instrument has a `role` (default `"voice"`):

- **voice** — counts toward the simultaneous-voices threshold. The normal
  case: harmonicas, bells, tuned sets.
- **anchor** — always sounding, can't be silenced (fridge hum, mains hum,
  HVAC drone). Contributes no voice; instead it *filters* the network:
  every shown scale must fit every anchor.
- **chameleon** — tunable by construction (wine glass by fill level, slide
  whistle, musical saw, and **Ensemble Jammer**, the software chameleon).
  Fits every scale, and each copy is its own voice — pitch-based identity
  grouping doesn't apply (two wine glasses can take two different pitches),
  so chameleons group by label instead: copies of the same chameleon
  collapse into one detail line with a preserved count, while differently
  named chameleons stay distinct. The tune-to-the-room gesture lives here:
  a chameleon conforms to whatever the anchors demand.

Roles and match rules are orthogonal: role says *when/whether it sounds and
what that means for the network*; matchRule says *how its pitches compare to
a scale*.

## The sounding environment (anchors)

The schema already covers non-instruments that make dependable pitch: the
refrigerator's B♭ hum is `makePitched("refrigerator", 10)`, a door squeak is
a single pitch, a washing-machine end-of-cycle melody (Samsung's plays
Schubert's "Die Forelle") is a fixed pc collection with `matchRule: "all"`.
If it reliably sounds a pitch or a set of pitches, it can be entered and
harmonized with.

What's new about these is control, not description: nobody chooses when the
fridge sounds. It is *always* sounding. That inverts its role in the
network — instead of contributing an optional voice, it imposes a hard
constraint: any scale that omits pc 10 puts the room out of tune with
itself. Proposed: an **anchor** flag on an instrument. Anchored instruments
don't add to the voice count; they *filter* the network absolutely (every
shown scale must fit them). The event-like ones (washing machine jingle,
door squeak) stay ordinary instruments — voices you wait for rather than
cue. Lineage worth citing: Cage's environmental sound, La Monte Young's
Dream House tuned to the 60 Hz mains hum (≈ B♭ in North America, ≈ G on
50 Hz grids), Oliveros's Deep Listening.

## Environmental taxonomy

Full research pass: `sounding_environment_taxonomy.md` (this repo). The
sounding environment sorts by role × pitch structure. Confident entries
are in `webapp/src/templates.js`; a few still await citable frequencies:

- **Anchors**: mains hum (60 Hz grid ≈ B♭, 50 Hz ≈ G — the meta-anchor; a
  North American room is already faintly in B♭), HVAC/fan drones,
  fluorescent/transformer buzz, aquarium pumps.
- **Events** (cueable or waitable → ordinary voices): appliance jingles
  (Samsung's washer plays Schubert's "Die Forelle"), kettle whistles,
  smoke-alarm chirps; tuned train horn chords (Nathan K5LA = B major 6th,
  K5H = D♯ minor 6th, P5 = A dominant 7th), car chimes; telephony
  (dial tone = 350+440 Hz = an F+A dyad, DTMF pairs); transit door chimes;
  broadcast mnemonics (NBC chimes = G–E–C, Westminster Quarters = G–F–E–B).
  Note: EV AVAS tones are excluded — the taxonomy found they pitch-bend
  continuously with vehicle speed, so they're texture, not pitch material.
  Birdsong (chickadee fee-bee, cuckoo) is likewise a reliable *interval* on
  a variable root — not representable as a fixed pc set.
- **Playable**: wine glasses/glass harp (chameleon), wind chimes (often
  pentatonic fixed sets), carillons/Westminster Quarters, bottles, pipes,
  saws, tuning forks.
- **Biological**: chickadee "fee-bee" descending interval, cuckoo minor
  third, near-pentatonic thrushes; cricket/cicada bands as fuzzy anchors.

The lineage claim this sharpens: industrial designers already tune the
built environment (train chords, AVAS, dial tones, chime logos). Muster
harvests deliberate design that nobody has pooled into an ensemble before.

## Scope: current scaffold vs. research-pending

Scaffolded now (stable regardless of incoming research):

- `matchRule: "coverage"` with `minCoverage`, plus `makeTunedSet`
- `role: "voice" | "anchor" | "chameleon"` with the semantics above,
  wired through counting, filtering, details, and the quick-add UI
- `templates.js` registry with grouped dropdown (tuned sets, chameleons,
  anchors & environment)

Research-pending slots (structure exists, data/decisions await):

- Exact template pitch sets and which products to trust (entries marked
  RESEARCH-PENDING in `templates.js`)
- Coverage default (`minCoverage` placeholder: majority of the set)
- Voices vs. players for distributed sets (are 8 desk bells 1 voice or 8?)
- Adaptive threshold heuristic (auto-suggest N from pool composition)
- Environmental entries needing citable frequencies (transit chimes,
  appliance jingle keys). Train chords landed (K5LA/K5H/P5 in
  `templates.js`); AVAS and birdsong ruled out as non-harmonizable.
- `active` flag for duty-cycled quasi-anchors (fridge compressor: an
  anchor while running, silent between cycles — the taxonomy recommends
  distinguishing these from true always-on electrical hum)

Out of scope here: performer renderers and instrument priority order
(lalork-website), phase-4 aggregation, weighted matching.

## Phasing

1. `instruments.js` — schema, templates, identity grouping, generic
   `countVoices` / `detailList`; migrate the stored 12-count harmonica
   array into the new inventory blob.
2. Inventory panel v2 — tabs: **Harmonicas** (the existing 12-key stepper
   grid, still the common case and a good UI) and **Found instruments**
   (name + pitch(es) quick-add, list with remove).
3. Threshold slider + detail overflow.
4. **Later, the payoff**: performers already describe their inventory in
   lalork's edit mode — write it to the room doc and the conductor's
   network aggregates the actual ensemble present tonight instead of a
   manually entered pool. The two interfaces become one system.

## Cross-repo alignment

The schema above is the contract to keep in sync with lalork-website
issue #52. If the performer-side form stores the same JSON, phase 4 is a
Firestore write plus an aggregation step, nothing more.
