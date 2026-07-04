# Muster

*Found harmony from the instrumentarium on hand.*

Muster is a conductor interface for live networked ensembles built from
whatever the room contains: harmonicas, desk bells, kalimbas, wine glasses,
the refrigerator's B♭ hum. You describe the inventory, and Muster builds a
network of the scales that inventory can actually play together, drawn from
Tymoczko's 57 maximally even scales and connected by single-note voice
leading. Clicking a scale broadcasts it (plus BPM) to a Firebase room, where
each performer's client renders what that scale means for their particular
instrument.

The loop that makes it interesting: the instruments you happen to have
motivate a scale network, and the scale network then tells you how to
marshal those same instruments in realtime. Constraint becomes the score.

## The three words

- **Muster**: the interface, and the act of assembling what's on hand and
  directing it live.
- **Instrumentarium**: the inventory you feed it.
- **Found harmony**: what comes out, harmony discovered inside the
  constraints of found instruments rather than imposed on them.

"Instrument" means anything with dependable pitch, including the sounding
environment itself. Instruments carry one of three roles:

- **voice**: counts toward the simultaneous-voices threshold (harmonicas,
  bells, tuned sets)
- **anchor**: always sounding and can't be silenced (mains hum, HVAC
  drone); instead of adding a voice it filters the network, since every
  shown scale must fit every anchor
- **chameleon**: tunable by construction (wine glass by fill level, slide
  whistle, Ensemble Jammer); fits every scale and contributes a voice
  everywhere

## Running the webapp

```bash
cd webapp
npm install
npm run dev     # http://localhost:5173
```

Requires a `webapp/.env.local` with Firebase web credentials:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

See `webapp/README.md` for how the interface works (voice counting, the
threshold slider, templates, broadcast contract).

## Repository layout

- `webapp/`: **Muster**, the conductor interface (React + Vite + Firebase)
- `FOUND-INSTRUMENTS.md`: design doc for the found-instruments
  generalization: instrument schema, match rules (`all` / `fundamental` /
  `coverage`), the three roles, the promiscuity problem, phasing, and the
  cross-repo contract with the performer side (lalork-website issue #52)
- `sounding_environment_taxonomy.md`: research pass on the sounding
  environment: anchors (electrical hum), events (train horn chords,
  telephony dyads, appliance jingles), playable and biological sources,
  with citable frequencies
- `instrument_research_academic.md`, `instrument_research_practical.md`:
  research on which real-world instruments have reliable pitch and what
  the $10–30 market actually sells
- `harmonica_scale_finder.py`, `harmonica_network.py`: the origin scripts;
  rank all 57 scales by harmonica compatibility and render the radial
  network as a static image (`harmonica_network.png`)
- `overblow-diagram.png`: full chromatic range of a Richter-tuned diatonic
  harmonica with overblows/overdraws

## Origin

The project started as a concrete question: given six harmonicas (C ×3, A,
E♭, F), which scales let the most of them play together? A Richter diatonic
contributes two chords, blow {0,4,7} and draw {2,5,7,9,11} relative to its
key, and ranking the 57 scales by how many harmonicas fit produced the
first network. Muster generalizes that math so the harmonica is one
instrument template among many:

```bash
python3 harmonica_scale_finder.py   # rank scales for a harmonica inventory
python3 harmonica_network.py        # render the static network image
```

Lineage: Cage's environmental sound, La Monte Young's Dream House tuned to
the mains hum, Schafer's "keynote sound," Oliveros's Deep Listening, and
Orff pedagogy run in reverse: instead of removing bars so students can't
play a wrong note, Muster chooses scales to fit the bars, bells, and reeds
you already have.
