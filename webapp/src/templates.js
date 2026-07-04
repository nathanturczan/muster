// Pre-filled instrument templates for the Found-instruments quick-add.
// Data-driven so incoming research (pitch-reliability tables, citable
// frequencies for environmental sounds) drops straight into this file.
//
// Entry shape: { id, label, group, make: () => instrument }
// Entries marked RESEARCH-PENDING have provisional pitch data awaiting
// verification against the research taxonomy (anchor/event/playable ×
// single/fixed-set/coverage).

import { makeTunedSet, makeChameleon, makePitched, makeDyad } from "./instruments";

// Pitch classes: C=0 Db=1 D=2 Eb=3 E=4 F=5 F#=6 G=7 Ab=8 A=9 Bb=10 B=11
const C_MAJOR = [0, 2, 4, 5, 7, 9, 11];

export const TEMPLATES = [
  // --- Tuned sets (coverage matching; distributed single pitches) ---
  // RESEARCH-PENDING: verify pitch sets against what the $10–30 market
  // actually sells; resolve voices-vs-players for distributed sets.
  {
    id: "desk-bells-c",
    label: "8-note desk bells (C major)",
    group: "Tuned sets",
    make: () => makeTunedSet("desk bells", C_MAJOR),
  },
  {
    id: "boomwhackers-c",
    label: "Boomwhackers (C major octave)",
    group: "Tuned sets",
    make: () => makeTunedSet("boomwhackers", C_MAJOR),
  },
  {
    id: "kalimba-17-c",
    label: "17-key kalimba (C)",
    group: "Tuned sets",
    make: () => makeTunedSet("kalimba", C_MAJOR),
  },
  {
    id: "tongue-drum-d-minor",
    label: "Steel tongue drum (D minor)",
    group: "Tuned sets",
    // RESEARCH-PENDING: common 11-tongue "D minor" tuning ≈ D E F G A C
    make: () => makeTunedSet("tongue drum", [0, 2, 4, 5, 7, 9]),
  },
  {
    id: "handpan-d-kurd",
    label: "Handpan (D Kurd)",
    group: "Tuned sets",
    // RESEARCH-PENDING: D Kurd ≈ D A Bb C D E F G A → pcs {D,A,Bb,C,E,F,G}
    make: () => makeTunedSet("handpan", [0, 2, 4, 5, 7, 9, 10]),
  },
  {
    id: "orff-bars-c",
    label: "Orff bar set (C diatonic)",
    group: "Tuned sets",
    make: () => makeTunedSet("Orff bars", C_MAJOR),
  },

  // --- Chameleons (tunable by construction; one voice each, every scale) ---
  {
    id: "wine-glass",
    label: "Wine glass (tuned by fill)",
    group: "Chameleons",
    make: () => makeChameleon("wine glass"),
  },
  {
    id: "slide-whistle",
    label: "Slide whistle",
    group: "Chameleons",
    make: () => makeChameleon("slide whistle"),
  },
  {
    id: "ensemble-jammer",
    label: "Ensemble Jammer (phone/tablet)",
    group: "Chameleons",
    make: () => makeChameleon("Ensemble Jammer"),
  },

  // --- Anchors & environment (always-sounding → filter the network) ---
  {
    id: "mains-hum-60",
    label: "Mains hum, 60 Hz grid (≈ B♭)",
    group: "Anchors & environment",
    make: () => ({ ...makePitched("mains hum", 10), role: "anchor" }),
  },
  {
    id: "mains-hum-50",
    label: "Mains hum, 50 Hz grid (≈ G)",
    group: "Anchors & environment",
    make: () => ({ ...makePitched("mains hum", 7), role: "anchor" }),
  },
  {
    id: "dial-tone",
    label: "Dial tone (350+440 Hz = F+A)",
    group: "Anchors & environment",
    // Event, not anchor: you cue it by lifting the receiver
    make: () => makeDyad("dial tone", 5, 9),
  },
  {
    id: "nbc-chimes",
    label: "NBC chimes (G–E–C)",
    group: "Anchors & environment",
    make: () => makeTunedSet("NBC chimes", [0, 4, 7], 3),
  },
  {
    id: "train-horn-k5la",
    label: "Train horn, Nathan K5LA (B major 6th)",
    group: "Anchors & environment",
    // D#4 F#4 G#4 B4 D#5 = 311/370/415/494/622 Hz; sounds as one chord
    make: () => makeTunedSet("train horn (K5LA)", [3, 6, 8, 11], 4),
  },
  {
    id: "train-horn-k5h",
    label: "Train horn, Nathan K5H (D# minor 6th)",
    group: "Anchors & environment",
    // D# F# A C D#
    make: () => makeTunedSet("train horn (K5H)", [0, 3, 6, 9], 4),
  },
  {
    id: "train-horn-p5",
    label: "Train horn, Nathan P5 (A dominant 7th)",
    group: "Anchors & environment",
    // C# E G A C#
    make: () => makeTunedSet("train horn (P5)", [1, 4, 7, 9], 4),
  },
  {
    id: "westminster-quarters",
    label: "Westminster Quarters (G–F–E–B)",
    group: "Anchors & environment",
    // Big Ben / mantel clocks; commonly G3-F3-E3-B3 (melody, fixed set)
    make: () => makeTunedSet("Westminster chimes", [4, 5, 7, 11], 4),
  },
  // RESEARCH-PENDING slots (add when citable frequencies land):
  // transit door chimes, appliance jingles (Samsung "Die Forelle" is fixed
  // per model but the key varies — needs per-model data), smoke-alarm chirp.
  //
  // Deliberately EXCLUDED per the taxonomy (not harmonizable):
  // - EV AVAS tones: pitch-bend continuously with vehicle speed
  // - birdsong intervals (chickadee fee-bee, cuckoo): reliable interval,
  //   variable root — would need an "interval" matchRule that doesn't map
  //   to a fixed pc set. Texture, not pitch material.
];
