# Muster

*Found harmony from the instruments on hand.*

Muster is a conductor interface for live ensembles built from whatever the
room contains: harmonicas, desk bells, kalimbas, wine glasses, the
refrigerator's hum. You enter the instruments lying around, and Muster
shows a network of the scales those instruments can actually play together,
with bigger and more central nodes marking the scales where more of them
can sound at once. Clicking a scale broadcasts it live to every performer
in the room, and each performer's screen renders what that scale means for
their particular instrument.

The instruments you happen to have motivate a scale network, and the scale
network then tells you how to direct those same instruments in realtime.
Constraint becomes the score. The scale network is based on Dmitri
Tymoczko's research on voice leading between maximally even scales:
neighboring scales in the map differ by a single note, so moving along an
edge is always a smooth harmonic step.

Every instrument plays one of three roles:

- **voice**: counts toward the how-many-can-play-at-once threshold
  (harmonicas, bells, tuned sets)
- **anchor**: always sounding and impossible to silence (mains hum, HVAC
  drone); instead of adding a voice it filters the map, since every shown
  scale must stay in tune with it
- **chameleon**: tunable by construction (a wine glass by fill level, a
  slide whistle, Ensemble Jammer); fits every scale and contributes a
  voice everywhere

## Running

```bash
cd webapp
npm install
npm run dev     # http://localhost:5173
```

See `webapp/README.md` for setup details and how the interface works
(voice counting, match rules, the threshold slider, templates).

## Repository layout

- `webapp/`: **Muster**, the conductor interface
- `FOUND-INSTRUMENTS.md`: design doc for the found-instruments model:
  instrument schema, match rules (`all` / `fundamental` / `coverage`), the
  three roles, the promiscuity problem, phasing, and the contract with the
  performer-side interface (lalork-website issue #52)
- `sounding_environment_taxonomy.md`: research pass on the sounding
  environment: anchors (electrical hum), events (train horn chords,
  telephony dyads, appliance jingles), playable and biological sources,
  with citable frequencies
- `instrument_research_academic.md`, `instrument_research_practical.md`:
  research on which real-world instruments have reliable pitch and what
  the $10–30 market actually sells
- `harmonica_scale_finder.py`, `harmonica_network.py`: the origin scripts;
  rank the scale network by harmonica compatibility and render it as a
  static image (`harmonica_network.png`)
- `overblow-diagram.png`: full chromatic range of a Richter-tuned diatonic
  harmonica with overblows/overdraws

## Origin

The project started as a concrete question: given six harmonicas (C ×3, A,
E♭, F), which scales let the most of them play together? A Richter diatonic
contributes two chords, blow {0,4,7} and draw {2,5,7,9,11} relative to its
key, and ranking the 57 scales of the network by how many harmonicas fit
produced the first map. Muster generalizes that math so the harmonica is
one instrument template among many:

```bash
python3 harmonica_scale_finder.py   # rank scales for a harmonica inventory
python3 harmonica_network.py        # render the static network image
```

Lineage: Cage's environmental sound, La Monte Young's Dream House tuned to
the mains hum, Schafer's "keynote sound," Oliveros's Deep Listening, and
Orff pedagogy run in reverse: instead of removing bars so students can't
play a wrong note, Muster chooses scales to fit the bars, bells, and reeds
you already have.
