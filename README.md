# Harmonica Performance Materials

## My Inventory
- **C** × 3
- **A** × 1
- **E♭** × 1
- **F** × 1

Total: 6 harmonicas (4 unique keys)

---

## Richter Tuning Pitch Classes

Standard 10-hole diatonic harmonica (relative to root):

| Direction | Pitch Classes | Notes (in C) |
|-----------|---------------|--------------|
| **Blow (OUT)** | {0, 4, 7} | C, E, G (major triad) |
| **Draw (IN)** | {2, 5, 7, 9, 11} | D, F, G, A, B |

Combined: 7 pitch classes = the full diatonic scale (missing none).

---

## Best Scales for My 6 Harmonicas

### 5 Harmonicas Can Play

| Scale | Harmonicas |
|-------|------------|
| **B♭ Acoustic** | C:OUT, E♭:IN, F:IN |
| **F Harmonic Major** | C:OUT, F:OUT, A:OUT |
| **Octatonic 1 (C)** | C:OUT, E♭:OUT, A:OUT |

### 4 Harmonicas Can Play

| Scale | Harmonicas |
|-------|------------|
| **C Diatonic** | C:OUT+IN, F:OUT |
| **F Diatonic** | C:OUT, F:OUT+IN |
| **C Acoustic** | C:OUT, F:IN |
| **F Acoustic** | C:IN, F:OUT |
| **G Acoustic** | C:IN, A:OUT |
| **A♭ Harmonic Major** | C:OUT, E♭:OUT |

### Composition Strategy

No single scale accommodates all 4 unique keys (C, A, E♭, F). For a piece using all 6 harmonicas:

1. **Section A**: Octatonic 1 → C, A, E♭ (all blowing)
2. **Section B**: F Harmonic Major → C, A, F (all blowing)
3. **Section C**: B♭ Acoustic → C (out), E♭ (in), F (in)

The three 5-harmonica scales cover different combinations, allowing all 6 harmonicas across the full piece.

---

## Overblowing / Overdrawing

See `overblow-diagram.png` — shows the full chromatic range available on a C harmonica:

- **Holes 1–6**: Overblows available (bent blow notes)
- **Holes 7–10**: Overdraws available (bent draw notes)

With overblow/overdraw technique, each harmonica becomes **fully chromatic**, expanding beyond the 7 diatonic pitch classes to all 12.

### Overblow Pitch Classes (C harmonica)

| Hole | Standard Blow | Overblow |
|------|---------------|----------|
| 1 | C (0) | D♭/E♭ (1, 3) |
| 2 | E (4) | F (5) |
| 3 | G (7) | A♭ (8) |
| 4 | C (0) | D♭ (1) |
| 5 | E (4) | F (5) |
| 6 | G (7) | A♭ (8) |

### Overdraw Pitch Classes (C harmonica)

| Hole | Standard Draw | Overdraw |
|------|---------------|----------|
| 7 | B (11) | C (0) |
| 8 | D (2) | E♭ (3) |
| 9 | F (5) | F♯ (6) |
| 10 | A (9) | B♭ (10) |

---

## Files in This Directory

- `harmonica_scale_finder.py` — Ranks all 57 scales by harmonica compatibility
- `harmonica_network.py` — Generates radial network graph
- `harmonica_network.png` — Visual map of scale adjacencies (center = most harmonicas)
- `overblow-diagram.png` — Full chromatic range with overblows/overdraws
- `webapp/` — **Muster**, the conductor interface: describe your instrumentarium (harmonicas + found instruments), get a scale network filtered to what can play together, click to broadcast to a Firebase ensemble. See `webapp/README.md`.

---

## Running the Scripts

```bash
# Find best scales for your inventory
python3 harmonica_scale_finder.py

# Generate network visualization
python3 harmonica_network.py
```

Edit the `user_harmonicas` list in each script to analyze different collections.
