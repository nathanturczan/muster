// Found-instrument model: anything with dependable pitch the ensemble has
// lying around, described as one or more playable states (sets of concert
// pitch classes). The harmonica is the special case that this generalizes.
// Schema kept in sync with lalork-website issue #52.
//
// Roles (instrument.role, default "voice"):
//   "voice"     — counts toward the simultaneous-voices threshold
//   "anchor"    — always sounding (fridge hum, mains hum); doesn't add a
//                 voice, instead FILTERS the network: every shown scale
//                 must fit every anchor
//   "chameleon" — tunable by construction (wine glass, slide whistle,
//                 Ensemble Jammer); fits every scale, and each copy is its
//                 own voice since each can take a different pitch
//
// Match rules (instrument.matchRule, default "all"):
//   "all"         — every pc of a state must be in the scale (harmonica)
//   "fundamental" — first pc must fit; the rest are tolerated overtones
//   "coverage"    — at least instrument.minCoverage of a state's pcs must
//                   fit (kalimba, tongue drum, handpan, Orff bars — the
//                   instrument plays the intersection)

export const NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

// Richter tuning intervals, relative to the harmonica root
const BLOW_INTERVALS = [0, 4, 7];
const DRAW_INTERVALS = [2, 5, 7, 9, 11];

// Default ensemble inventory: C×3, Eb, F, A harmonicas, no found instruments
export const DEFAULT_INVENTORY = {
  harmonicas: [3, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
  found: [],
};

// --- Templates ---
// Templates author states in whatever terms are convenient (root + intervals
// for harmonicas), but instruments always store absolute concert pcs.

export function makeHarmonica(root) {
  const transpose = (intervals) => intervals.map((i) => (root + i) % 12);
  return {
    label: NOTE_NAMES[root],
    states: [
      { label: "OUT", pcs: transpose(BLOW_INTERVALS) },
      { label: "IN", pcs: transpose(DRAW_INTERVALS) },
    ],
    matchRule: "all",
  };
}

export function makePitched(label, pc) {
  return {
    label,
    states: [{ label: NOTE_NAMES[pc], pcs: [pc] }],
    matchRule: "all",
  };
}

export function makeDyad(label, pcA, pcB) {
  return {
    label,
    states: [
      { label: `${NOTE_NAMES[pcA]}+${NOTE_NAMES[pcB]}`, pcs: [pcA, pcB] },
    ],
    matchRule: "all",
  };
}

// A distributed array of single pitches (desk bells, boomwhackers, kalimba
// keys, Orff bars). One state holding the whole set; coverage matching means
// it fits when at least minCoverage of its pcs are in the scale.
// RESEARCH-PENDING: default minCoverage (majority) and whether a set counts
// as one voice or as many players are open questions.
export function makeTunedSet(label, pcs, minCoverage) {
  return {
    label,
    states: [{ label: pcs.map((pc) => NOTE_NAMES[pc]).join(" "), pcs: [...pcs] }],
    matchRule: "coverage",
    minCoverage: minCoverage ?? Math.ceil(pcs.length / 2),
  };
}

// Tunable by construction: no fixed pcs, conforms to whatever scale is
// current (wine glass by fill level, slide whistle, Ensemble Jammer).
export function makeChameleon(label) {
  return { label, states: [], matchRule: "all", role: "chameleon" };
}

// Flatten the inventory into a list of instrument descriptions (one entry
// per physical instrument; identical ones are collapsed again by grouping).
export function inventoryToInstruments(inventory) {
  const instruments = [];
  inventory.harmonicas.forEach((count, root) => {
    for (let i = 0; i < count; i++) {
      instruments.push(makeHarmonica(root));
    }
  });
  return instruments.concat(inventory.found);
}

// --- Matching ---

function stateFits(state, instrument, pcSet) {
  const rule = instrument.matchRule || "all";
  if (rule === "fundamental") {
    // Fundamental must fit; remaining pcs are tolerated overtones
    return pcSet.has(state.pcs[0]);
  }
  if (rule === "coverage") {
    const inScale = state.pcs.filter((pc) => pcSet.has(pc)).length;
    return inScale >= (instrument.minCoverage ?? state.pcs.length);
  }
  return state.pcs.every((pc) => pcSet.has(pc));
}

// Identity ignores the label: two bells tuned to the same pitch are the
// same voice, whatever they're written on. Chameleons are the exception —
// they have no pitch identity (each copy can take a different pitch), so
// they group by label instead: two wine glasses collapse, but a wine glass
// and an Ensemble Jammer stay distinct in the detail list.
function identityKey(instrument) {
  if ((instrument.role || "voice") === "chameleon") {
    return `chameleon:${instrument.label}`;
  }
  const states = instrument.states
    .map((s) => [...s.pcs].sort((a, b) => a - b).join("."))
    .sort()
    .join("|");
  return `${instrument.role || "voice"}:${instrument.matchRule || "all"}:${
    instrument.minCoverage ?? ""
  }:${states}`;
}

function groupInstruments(instruments) {
  const groups = new Map();
  for (const instrument of instruments) {
    const key = identityKey(instrument);
    const group = groups.get(key);
    if (group) {
      group.count += 1;
    } else {
      groups.set(key, { instrument, count: 1 });
    }
  }
  return [...groups.values()];
}

// --- Anchors ---
// True when every anchor instrument has at least one fitting state. Scales
// failing this are hidden entirely: the anchor is always sounding, so a
// scale it doesn't fit puts the room out of tune with itself.

export function anchorsFit(instruments, pcSet) {
  return instruments.every(
    (inst) =>
      (inst.role || "voice") !== "anchor" ||
      inst.states.some((s) => stateFits(s, inst, pcSet))
  );
}

// --- Voice counting ---
// A group of n identical instruments with k fitting states contributes
// min(k, n) distinct simultaneous voices: three C harps playing OUT and IN
// are two voices; one A harp is one voice no matter how many states fit.
// Anchors contribute nothing (they filter instead); chameleons contribute
// one voice per copy on every scale, since each can tune independently.

export function countVoices(instruments, pcSet) {
  let voices = 0;
  for (const { instrument, count } of groupInstruments(instruments)) {
    const role = instrument.role || "voice";
    if (role === "anchor") continue;
    if (role === "chameleon") {
      voices += count;
      continue;
    }
    const fitting = instrument.states.filter((s) =>
      stateFits(s, instrument, pcSet)
    ).length;
    voices += Math.min(fitting, count);
  }
  return voices;
}

// One entry per instrument group with at least one fitting state:
// { label, states: [fitting state labels] }. Anchors are included (they are
// sounding in any scale that passed the filter); chameleons show "tunable";
// coverage instruments show how much of the set fits ("6/7").
export function detailList(instruments, pcSet) {
  const details = [];
  for (const { instrument } of groupInstruments(instruments)) {
    const role = instrument.role || "voice";
    if (role === "chameleon") {
      details.push({ label: instrument.label, states: ["tunable"] });
      continue;
    }
    const fitting = instrument.states
      .filter((s) => stateFits(s, instrument, pcSet))
      .map((s) =>
        (instrument.matchRule || "all") === "coverage"
          ? `${s.pcs.filter((pc) => pcSet.has(pc)).length}/${s.pcs.length}`
          : s.label
      );
    if (fitting.length > 0) {
      details.push({ label: instrument.label, states: fitting });
    }
  }
  return details;
}
