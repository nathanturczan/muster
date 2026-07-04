# Muster

*Found harmony from the instrumentarium on hand.*

Muster is the conductor interface for a live networked ensemble. You tell it
what instruments are lying around: harmonicas, desk bells, wood blocks,
two-note chimes, whatever the room contains. It builds a network of the
scales that inventory can actually play together, sized and centered by how
many instruments can sound at once. Clicking a scale broadcasts it (plus BPM)
to a Firebase room, where each performer's interface renders what that scale
means for their particular instrument.

The loop that makes it interesting: the instruments you happen to have
motivate a scale network, and the scale network then tells you how to marshal
those same instruments in realtime. Constraint becomes the score. Where Orff
pedagogy removes bars from a xylophone so students can't play a wrong note,
Muster runs the same idea in reverse: it chooses scales to fit the bars,
bells, and reeds you already have.

## The three words

- **Muster**: this interface, the act of assembling what's on hand and
  directing it live.
- **Instrumentarium**: the inventory you feed it, entered in the panel or
  (eventually) aggregated from performers' own descriptions.
- **Found harmony**: what comes out, harmony discovered inside the
  constraints of found instruments rather than imposed on them.

"Instrument" is anything with dependable pitch: the refrigerator's B♭ hum,
a door squeak, the washing machine's end-of-cycle jingle all qualify. Sounds
you can't cue but can't silence (the fridge) act as *anchors*: rather than
adding a voice, they constrain which scales the room can be in at all. See
`../FOUND-INSTRUMENTS.md` for the design thinking.

## How it works

1. **Describe the instrumentarium.** Two tabs:
   - *Harmonicas*: a 12-key stepper grid (Richter tuning assumed; each harp
     contributes a BLOW chord and a DRAW chord).
   - *Found instruments*: quick-add by name and pitch, with an optional
     second pitch for dyads (chimes, two-tone blocks).
2. **Read the network.** Each node is one of Tymoczko's 57 maximally even
   scales. A node appears only if the pooled inventory can put **≥ N
   instruments on it simultaneously** (default N = 2); bigger, more central,
   warmer-colored nodes support more simultaneous voices. Edges connect
   scales that differ by a single pitch class, so neighboring nodes are
   smooth voice-leading moves.
3. **Tune the threshold.** Single-pitch instruments are promiscuous (a lone
   C bell fits about 30 of the 57 scales), so mixed inventories balloon the
   map. The "playable by ≥ N at once" slider is the primary control for
   keeping the network tight enough to conduct from.
4. **Conduct.** Click a node to broadcast that scale to the room. The strip
   below the map lists exactly which instruments fit the selected scale and
   in which states. Performers' clients handle transition rendering
   themselves: the broadcast carries only the current scale, and each
   renderer diffs it against what it was previously showing.

## Voice counting

Identical instruments are grouped (identity = match rule + state pitch
classes, label ignored); a group of *n* copies with *k* states fitting the
scale contributes min(*k*, *n*) voices. Three C harmonicas on a scale that
fits both BLOW and DRAW give 2 voices, one A harmonica on the same scale
gives 1, and one bell whose pitch fits gives 1. The old harmonica-specific
rule falls out of this as a special case.

## Code map

- `src/instruments.js`: instrument schema, templates (`makeHarmonica`,
  `makePitched`, `makeDyad`), identity grouping, `countVoices`, `detailList`.
- `src/scales.js`: the 57-scale data, adjacency edges, radial layout,
  `buildNetwork(instruments, minVoices)`.
- `src/NetworkPage.jsx`: inventory panel (tabs, slider), SVG network,
  selected-scale strip, broadcast wiring.
- `src/App.jsx`: auth gate (Google sign-in) and room setup.

Inventory persists to localStorage under `harmonica-network-inventory-v2`
(`{ harmonicas: [12 counts], found: [instruments] }`), with automatic
migration from the older bare 12-count array.

Design history and cross-repo contract: see `../FOUND-INSTRUMENTS.md` and
lalork-website issue #52 (the performer-side generalization, which shares
the instrument schema).

## Running

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

Sign in with a Scale Navigator (Google) account; the host view is the
network, and broadcasts write scale key + BPM to the Firestore room document.
