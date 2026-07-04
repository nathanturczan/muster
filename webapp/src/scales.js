// Scale network data + radial layout.
// Ported from harmonica_network.py (same algorithm, same colors, same labels).
// Instrument matching (voice counting, per-node details) lives in instruments.js.

import { countVoices, detailList, anchorsFit } from "./instruments";

// All 57 scales with their pitch classes and adjacencies (from ScaleData.js)
const SCALES = {
  "A Acoustic": { pcs: [1, 3, 4, 6, 7, 9, 11], adj: ["E Diatonic", "E Harmonic Minor", "Octatonic 2", "D Diatonic", "B Harmonic Major", "Whole Tone 2"] },
  "A Diatonic": { pcs: [1, 2, 4, 6, 8, 9, 11], adj: ["E Diatonic", "F# Harmonic Minor", "D Acoustic", "D Diatonic", "A Harmonic Major", "E Acoustic"] },
  "A Harmonic Major": { pcs: [1, 2, 4, 5, 8, 9, 11], adj: ["A Diatonic", "F# Harmonic Minor", "G Acoustic", "Octatonic 2", "A Harmonic Minor", "Hexatonic 1"] },
  "A Harmonic Minor": { pcs: [0, 2, 4, 5, 8, 9, 11], adj: ["C Diatonic", "A Harmonic Major", "D Acoustic", "Octatonic 3", "C Harmonic Major", "Hexatonic 1"] },
  "Bb Acoustic": { pcs: [0, 2, 4, 5, 7, 8, 10], adj: ["F Diatonic", "F Harmonic Minor", "Octatonic 2", "Eb Diatonic", "C Harmonic Major", "Whole Tone 1"] },
  "Bb Diatonic": { pcs: [0, 2, 3, 5, 7, 9, 10], adj: ["F Diatonic", "G Harmonic Minor", "Eb Acoustic", "Eb Diatonic", "Bb Harmonic Major", "F Acoustic"] },
  "Bb Harmonic Major": { pcs: [0, 2, 3, 5, 6, 9, 10], adj: ["Bb Diatonic", "G Harmonic Minor", "Ab Acoustic", "Octatonic 3", "Bb Harmonic Minor", "Hexatonic 2"] },
  "Bb Harmonic Minor": { pcs: [0, 1, 3, 5, 6, 9, 10], adj: ["Db Diatonic", "Bb Harmonic Major", "Eb Acoustic", "Octatonic 1", "Db Harmonic Major", "Hexatonic 2"] },
  "B Acoustic": { pcs: [1, 3, 5, 6, 8, 9, 11], adj: ["F# Diatonic", "F# Harmonic Minor", "Octatonic 3", "E Diatonic", "Db Harmonic Major", "Whole Tone 2"] },
  "B Diatonic": { pcs: [1, 3, 4, 6, 8, 10, 11], adj: ["F# Diatonic", "Ab Harmonic Minor", "E Acoustic", "E Diatonic", "B Harmonic Major", "F# Acoustic"] },
  "B Harmonic Major": { pcs: [1, 3, 4, 6, 7, 10, 11], adj: ["B Diatonic", "Ab Harmonic Minor", "A Acoustic", "Octatonic 1", "B Harmonic Minor", "Hexatonic 3"] },
  "B Harmonic Minor": { pcs: [1, 2, 4, 6, 7, 10, 11], adj: ["D Diatonic", "B Harmonic Major", "E Acoustic", "Octatonic 2", "D Harmonic Major", "Hexatonic 3"] },
  "C Acoustic": { pcs: [0, 2, 4, 6, 7, 9, 10], adj: ["G Diatonic", "G Harmonic Minor", "Octatonic 1", "F Diatonic", "D Harmonic Major", "Whole Tone 1"] },
  "C Diatonic": { pcs: [0, 2, 4, 5, 7, 9, 11], adj: ["G Diatonic", "A Harmonic Minor", "F Acoustic", "F Diatonic", "C Harmonic Major", "G Acoustic"] },
  "C Harmonic Major": { pcs: [0, 2, 4, 5, 7, 8, 11], adj: ["C Diatonic", "A Harmonic Minor", "Bb Acoustic", "Octatonic 2", "C Harmonic Minor", "Hexatonic 4"] },
  "C Harmonic Minor": { pcs: [0, 2, 3, 5, 7, 8, 11], adj: ["Eb Diatonic", "C Harmonic Major", "F Acoustic", "Octatonic 3", "Eb Harmonic Major", "Hexatonic 4"] },
  "Db Acoustic": { pcs: [1, 3, 5, 7, 8, 10, 11], adj: ["Ab Diatonic", "Ab Harmonic Minor", "Octatonic 2", "F# Diatonic", "Eb Harmonic Major", "Whole Tone 2"] },
  "Db Diatonic": { pcs: [0, 1, 3, 5, 6, 8, 10], adj: ["Ab Diatonic", "Bb Harmonic Minor", "F# Acoustic", "F# Diatonic", "Db Harmonic Major", "Ab Acoustic"] },
  "Db Harmonic Major": { pcs: [0, 1, 3, 5, 6, 8, 9], adj: ["Db Diatonic", "Bb Harmonic Minor", "B Acoustic", "Octatonic 3", "Db Harmonic Minor", "Hexatonic 1"] },
  "Db Harmonic Minor": { pcs: [0, 1, 3, 4, 6, 8, 9], adj: ["E Diatonic", "Db Harmonic Major", "F# Acoustic", "Octatonic 1", "E Harmonic Major", "Hexatonic 1"] },
  "D Acoustic": { pcs: [0, 2, 4, 6, 8, 9, 11], adj: ["A Diatonic", "A Harmonic Minor", "Octatonic 3", "G Diatonic", "E Harmonic Major", "Whole Tone 1"] },
  "D Diatonic": { pcs: [1, 2, 4, 6, 7, 9, 11], adj: ["A Diatonic", "B Harmonic Minor", "G Acoustic", "G Diatonic", "D Harmonic Major", "A Acoustic"] },
  "D Harmonic Major": { pcs: [1, 2, 4, 6, 7, 9, 10], adj: ["D Diatonic", "B Harmonic Minor", "C Acoustic", "Octatonic 1", "D Harmonic Minor", "Hexatonic 2"] },
  "D Harmonic Minor": { pcs: [1, 2, 4, 5, 7, 9, 10], adj: ["F Diatonic", "D Harmonic Major", "G Acoustic", "Octatonic 2", "F Harmonic Major", "Hexatonic 2"] },
  "Eb Acoustic": { pcs: [0, 1, 3, 5, 7, 9, 10], adj: ["Bb Diatonic", "Bb Harmonic Minor", "Octatonic 1", "Ab Diatonic", "F Harmonic Major", "Whole Tone 2"] },
  "Eb Diatonic": { pcs: [0, 2, 3, 5, 7, 8, 10], adj: ["Bb Diatonic", "C Harmonic Minor", "Ab Acoustic", "Ab Diatonic", "Eb Harmonic Major", "Bb Acoustic"] },
  "Eb Harmonic Major": { pcs: [2, 3, 5, 7, 8, 10, 11], adj: ["Eb Diatonic", "C Harmonic Minor", "Db Acoustic", "Octatonic 2", "Eb Harmonic Minor", "Hexatonic 3"] },
  "Eb Harmonic Minor": { pcs: [2, 3, 5, 6, 8, 10, 11], adj: ["F# Diatonic", "Eb Harmonic Major", "Ab Acoustic", "Octatonic 3", "F# Harmonic Major", "Hexatonic 3"] },
  "E Acoustic": { pcs: [1, 2, 4, 6, 8, 10, 11], adj: ["B Diatonic", "B Harmonic Minor", "Octatonic 2", "A Diatonic", "F# Harmonic Major", "Whole Tone 1"] },
  "E Diatonic": { pcs: [1, 3, 4, 6, 8, 9, 11], adj: ["B Diatonic", "Db Harmonic Minor", "A Acoustic", "A Diatonic", "E Harmonic Major", "B Acoustic"] },
  "E Harmonic Major": { pcs: [0, 3, 4, 6, 8, 9, 11], adj: ["E Diatonic", "Db Harmonic Minor", "D Acoustic", "Octatonic 3", "E Harmonic Minor", "Hexatonic 4"] },
  "E Harmonic Minor": { pcs: [0, 3, 4, 6, 7, 9, 11], adj: ["G Diatonic", "E Harmonic Major", "A Acoustic", "Octatonic 1", "G Harmonic Major", "Hexatonic 4"] },
  "F Acoustic": { pcs: [0, 2, 3, 5, 7, 9, 11], adj: ["C Diatonic", "C Harmonic Minor", "Octatonic 3", "Bb Diatonic", "G Harmonic Major", "Whole Tone 2"] },
  "F Diatonic": { pcs: [0, 2, 4, 5, 7, 9, 10], adj: ["C Diatonic", "D Harmonic Minor", "Bb Acoustic", "Bb Diatonic", "F Harmonic Major", "C Acoustic"] },
  "F Harmonic Major": { pcs: [0, 1, 4, 5, 7, 9, 10], adj: ["F Diatonic", "D Harmonic Minor", "Eb Acoustic", "Octatonic 1", "F Harmonic Minor", "Hexatonic 1"] },
  "F Harmonic Minor": { pcs: [0, 1, 4, 5, 7, 8, 10], adj: ["Ab Diatonic", "F Harmonic Major", "Bb Acoustic", "Octatonic 2", "Ab Harmonic Major", "Hexatonic 1"] },
  "F# Acoustic": { pcs: [0, 1, 3, 4, 6, 8, 10], adj: ["Db Diatonic", "Db Harmonic Minor", "Octatonic 1", "B Diatonic", "Ab Harmonic Major", "Whole Tone 1"] },
  "F# Diatonic": { pcs: [1, 3, 5, 6, 8, 10, 11], adj: ["Db Diatonic", "Eb Harmonic Minor", "B Acoustic", "B Diatonic", "F# Harmonic Major", "Db Acoustic"] },
  "F# Harmonic Major": { pcs: [1, 2, 5, 6, 8, 10, 11], adj: ["F# Diatonic", "Eb Harmonic Minor", "E Acoustic", "Octatonic 2", "F# Harmonic Minor", "Hexatonic 2"] },
  "F# Harmonic Minor": { pcs: [1, 2, 5, 6, 8, 9, 11], adj: ["A Diatonic", "F# Harmonic Major", "B Acoustic", "Octatonic 3", "A Harmonic Major", "Hexatonic 2"] },
  "G Acoustic": { pcs: [1, 2, 4, 5, 7, 9, 11], adj: ["D Diatonic", "D Harmonic Minor", "Octatonic 2", "C Diatonic", "A Harmonic Major", "Whole Tone 2"] },
  "G Diatonic": { pcs: [0, 2, 4, 6, 7, 9, 11], adj: ["D Diatonic", "E Harmonic Minor", "C Acoustic", "C Diatonic", "G Harmonic Major", "D Acoustic"] },
  "G Harmonic Major": { pcs: [0, 2, 3, 6, 7, 9, 11], adj: ["G Diatonic", "E Harmonic Minor", "F Acoustic", "Octatonic 3", "G Harmonic Minor", "Hexatonic 3"] },
  "G Harmonic Minor": { pcs: [0, 2, 3, 6, 7, 9, 10], adj: ["Bb Diatonic", "G Harmonic Major", "C Acoustic", "Octatonic 1", "Bb Harmonic Major", "Hexatonic 3"] },
  "Ab Acoustic": { pcs: [0, 2, 3, 5, 6, 8, 10], adj: ["Eb Diatonic", "Eb Harmonic Minor", "Octatonic 3", "Db Diatonic", "Bb Harmonic Major", "Whole Tone 1"] },
  "Ab Diatonic": { pcs: [0, 1, 3, 5, 7, 8, 10], adj: ["Eb Diatonic", "F Harmonic Minor", "Db Acoustic", "Db Diatonic", "Ab Harmonic Major", "Eb Acoustic"] },
  "Ab Harmonic Major": { pcs: [0, 1, 3, 4, 7, 8, 10], adj: ["Ab Diatonic", "F Harmonic Minor", "F# Acoustic", "Octatonic 1", "Ab Harmonic Minor", "Hexatonic 4"] },
  "Ab Harmonic Minor": { pcs: [1, 3, 4, 7, 8, 10, 11], adj: ["B Diatonic", "Ab Harmonic Major", "Db Acoustic", "Octatonic 2", "B Harmonic Major", "Hexatonic 4"] },
  "Octatonic 1": { pcs: [0, 1, 3, 4, 6, 7, 9, 10], adj: ["C Acoustic", "Eb Acoustic", "F# Acoustic", "A Acoustic", "D Harmonic Major", "F Harmonic Major", "Ab Harmonic Major", "B Harmonic Major", "Db Harmonic Minor", "E Harmonic Minor", "G Harmonic Minor", "Bb Harmonic Minor"] },
  "Octatonic 2": { pcs: [1, 2, 4, 5, 7, 8, 10, 11], adj: ["Db Acoustic", "E Acoustic", "G Acoustic", "Bb Acoustic", "C Harmonic Major", "Eb Harmonic Major", "F# Harmonic Major", "A Harmonic Major", "D Harmonic Minor", "F Harmonic Minor", "Ab Harmonic Minor", "B Harmonic Minor"] },
  "Octatonic 3": { pcs: [0, 2, 3, 5, 6, 8, 9, 11], adj: ["D Acoustic", "F Acoustic", "Ab Acoustic", "B Acoustic", "Db Harmonic Major", "E Harmonic Major", "G Harmonic Major", "Bb Harmonic Major", "C Harmonic Minor", "Eb Harmonic Minor", "F# Harmonic Minor", "A Harmonic Minor"] },
  "Hexatonic 1": { pcs: [0, 1, 4, 5, 8, 9], adj: ["Db Harmonic Minor", "F Harmonic Minor", "A Harmonic Minor", "Db Harmonic Major", "F Harmonic Major", "A Harmonic Major"] },
  "Hexatonic 2": { pcs: [1, 2, 5, 6, 9, 10], adj: ["D Harmonic Minor", "F# Harmonic Minor", "Bb Harmonic Minor", "D Harmonic Major", "F# Harmonic Major", "Bb Harmonic Major"] },
  "Hexatonic 3": { pcs: [2, 3, 6, 7, 10, 11], adj: ["Eb Harmonic Minor", "G Harmonic Minor", "B Harmonic Minor", "Eb Harmonic Major", "G Harmonic Major", "B Harmonic Major"] },
  "Hexatonic 4": { pcs: [0, 3, 4, 7, 8, 11], adj: ["C Harmonic Minor", "E Harmonic Minor", "Ab Harmonic Minor", "C Harmonic Major", "E Harmonic Major", "Ab Harmonic Major"] },
  "Whole Tone 1": { pcs: [0, 2, 4, 6, 8, 10], adj: ["C Acoustic", "D Acoustic", "E Acoustic", "F# Acoustic", "Ab Acoustic", "Bb Acoustic"] },
  "Whole Tone 2": { pcs: [1, 3, 5, 7, 9, 11], adj: ["Db Acoustic", "Eb Acoustic", "F Acoustic", "G Acoustic", "A Acoustic", "B Acoustic"] },
};

// Discrete colors per simultaneous-voice level (palette from
// harmonica_network.py); levels above the palette clamp to red.
export const DISCRETE_COLORS = {
  5: "#d62728", // red
  4: "#ff7f0e", // orange
  3: "#ffbb33", // yellow-orange
  2: "#2ca02c", // green
  1: "#1f77b4", // blue
};

export function colorFor(count) {
  return DISCRETE_COLORS[Math.min(count, 5)] || "#999999";
}

// --- Display name -> ScaleData key (what gets written to Firebase scaleData) ---

const ROOT_KEYS = {
  C: "c", "C#": "cs", Db: "cs", D: "d", Eb: "ds", E: "e", F: "f",
  "F#": "fs", G: "g", Ab: "gs", A: "a", Bb: "as", B: "b",
};

export function scaleKeyFor(displayName) {
  const m = displayName.match(/^(Octatonic|Hexatonic|Whole Tone) (\d)$/);
  if (m) {
    return `${m[1].toLowerCase().replace(" ", "_")}_${m[2]}`;
  }
  const parts = displayName.split(" ");
  const root = ROOT_KEYS[parts[0]];
  const cls = parts.slice(1).join("_").toLowerCase();
  return `${root}_${cls}`;
}

// --- Network + radial layout (same algorithm as harmonica_network.py) ---

// instruments: flat list of instrument descriptions (see instruments.js).
// minVoices: show scales supporting at least this many simultaneous voices.
// Also returns maxCount (max voices across all 57 scales, unfiltered) so the
// UI can bound its threshold slider.
export function buildNetwork(instruments, minVoices = 2) {
  // Nodes: scales where at least minVoices instruments can play at once.
  // Anchors (always-sounding instruments) filter first: a scale that any
  // anchor doesn't fit is hidden regardless of its voice count.
  const nodes = {};
  let maxCount = 0;
  for (const [name, data] of Object.entries(SCALES)) {
    const pcSet = new Set(data.pcs);
    if (!anchorsFit(instruments, pcSet)) continue;
    const count = countVoices(instruments, pcSet);
    maxCount = Math.max(maxCount, count);
    if (count >= minVoices) {
      nodes[name] = {
        name,
        count,
        details: detailList(instruments, pcSet),
        scaleKey: scaleKeyFor(name),
      };
    }
  }

  // Edges: only between scales that both work (deduplicated)
  const edgeSet = new Set();
  const edges = [];
  for (const name of Object.keys(nodes)) {
    for (const adjName of SCALES[name].adj) {
      if (nodes[adjName]) {
        const key = [name, adjName].sort().join("|");
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push([name, adjName]);
        }
      }
    }
  }

  // Group nodes by count
  const byCount = {};
  for (const node of Object.values(nodes)) {
    (byCount[node.count] ||= []).push(node.name);
  }

  // Radial layout: center = highest count, increasing outward.
  // Ring radii are collision-aware: each ring guarantees a minimum
  // circumferential spacing per node (so nodes + their labels never
  // overlap) and a minimum radial gap between rings (so labels above/
  // below a node clear the neighboring rings).
  const MIN_SPACING = 195; // px of arc per node (node + name label margin)
  const RING_GAP = 165; // px between consecutive rings

  const countLevels = Object.keys(byCount)
    .map(Number)
    .sort((a, b) => b - a);

  // Node radii by count
  const minCount = Math.min(...countLevels);
  for (const node of Object.values(nodes)) {
    node.r = 16 + (node.count - minCount) * 6;
  }

  let prevRadius = 0;
  let maxRadius = 0;
  countLevels.forEach((count, i) => {
    const sorted = [...byCount[count]].sort();
    const n = sorted.length;

    // Radius needed so nodes on this ring are MIN_SPACING apart along
    // the circumference; also keep RING_GAP from the previous ring.
    const radiusFromSpacing = (n * MIN_SPACING) / (2 * Math.PI);
    let radius;
    if (i === 0) {
      radius = n === 1 ? 0 : Math.max(100, radiusFromSpacing);
    } else {
      radius = Math.max(prevRadius + RING_GAP, radiusFromSpacing);
    }

    sorted.forEach((name, j) => {
      const angle = (2 * Math.PI * j) / n + (i > 0 ? Math.PI / n : 0); // stagger outer rings
      nodes[name].x = radius * Math.cos(angle);
      nodes[name].y = radius * Math.sin(angle);
    });

    prevRadius = radius;
    maxRadius = Math.max(maxRadius, radius);
  });

  const extent = maxRadius + 120;

  return { nodes, edges, byCount, extent, maxCount };
}
