#!/usr/bin/env python3
"""
Harmonica Scale Finder

Finds which of the 57 scales in the Scale Navigator network best accommodate
a given set of harmonicas, ranking by how many harmonicas can play (blow or draw).

Richter tuning pitch classes (relative to harmonica root):
- Blow (out): {0, 4, 7} - major triad
- Draw (in):  {2, 5, 7, 9, 11}
"""

# Harmonica pitch class patterns (Richter tuning)
BLOW_PCS = frozenset([0, 4, 7])       # Major triad
DRAW_PCS = frozenset([2, 5, 7, 9, 11]) # D, F, G, A, B in key of C

NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

# All 57 scales from the Scale Navigator network
SCALES = {
    "A Acoustic": [1, 3, 4, 6, 7, 9, 11],
    "A Diatonic": [1, 2, 4, 6, 8, 9, 11],
    "A Harmonic Major": [1, 2, 4, 5, 8, 9, 11],
    "A Harmonic Minor": [0, 2, 4, 5, 8, 9, 11],
    "Bb Acoustic": [0, 2, 4, 5, 7, 8, 10],
    "Bb Diatonic": [0, 2, 3, 5, 7, 9, 10],
    "Bb Harmonic Major": [0, 2, 3, 5, 6, 9, 10],
    "Bb Harmonic Minor": [0, 1, 3, 5, 6, 9, 10],
    "B Acoustic": [1, 3, 5, 6, 8, 9, 11],
    "B Diatonic": [1, 3, 4, 6, 8, 10, 11],
    "B Harmonic Major": [1, 3, 4, 6, 7, 10, 11],
    "B Harmonic Minor": [1, 2, 4, 6, 7, 10, 11],
    "C Acoustic": [0, 2, 4, 6, 7, 9, 10],
    "C Diatonic": [0, 2, 4, 5, 7, 9, 11],
    "C Harmonic Major": [0, 2, 4, 5, 7, 8, 11],
    "C Harmonic Minor": [0, 2, 3, 5, 7, 8, 11],
    "Db Acoustic": [1, 3, 5, 7, 8, 10, 11],
    "Db Diatonic": [0, 1, 3, 5, 6, 8, 10],
    "Db Harmonic Major": [0, 1, 3, 5, 6, 8, 9],
    "Db Harmonic Minor": [0, 1, 3, 4, 6, 8, 9],
    "D Acoustic": [0, 2, 4, 6, 8, 9, 11],
    "D Diatonic": [1, 2, 4, 6, 7, 9, 11],
    "D Harmonic Major": [1, 2, 4, 6, 7, 9, 10],
    "D Harmonic Minor": [1, 2, 4, 5, 7, 9, 10],
    "Eb Acoustic": [0, 1, 3, 5, 7, 9, 10],
    "Eb Diatonic": [0, 2, 3, 5, 7, 8, 10],
    "Eb Harmonic Major": [2, 3, 5, 7, 8, 10, 11],
    "Eb Harmonic Minor": [2, 3, 5, 6, 8, 10, 11],
    "E Acoustic": [1, 2, 4, 6, 8, 10, 11],
    "E Diatonic": [1, 3, 4, 6, 8, 9, 11],
    "E Harmonic Major": [0, 3, 4, 6, 8, 9, 11],
    "E Harmonic Minor": [0, 3, 4, 6, 7, 9, 11],
    "F Acoustic": [0, 2, 3, 5, 7, 9, 11],
    "F Diatonic": [0, 2, 4, 5, 7, 9, 10],
    "F Harmonic Major": [0, 1, 4, 5, 7, 9, 10],
    "F Harmonic Minor": [0, 1, 4, 5, 7, 8, 10],
    "F# Acoustic": [0, 1, 3, 4, 6, 8, 10],
    "F# Diatonic": [1, 3, 5, 6, 8, 10, 11],
    "F# Harmonic Major": [1, 2, 5, 6, 8, 10, 11],
    "F# Harmonic Minor": [1, 2, 5, 6, 8, 9, 11],
    "G Acoustic": [1, 2, 4, 5, 7, 9, 11],
    "G Diatonic": [0, 2, 4, 6, 7, 9, 11],
    "G Harmonic Major": [0, 2, 3, 6, 7, 9, 11],
    "G Harmonic Minor": [0, 2, 3, 6, 7, 9, 10],
    "Ab Acoustic": [0, 2, 3, 5, 6, 8, 10],
    "Ab Diatonic": [0, 1, 3, 5, 7, 8, 10],
    "Ab Harmonic Major": [0, 1, 3, 4, 7, 8, 10],
    "Ab Harmonic Minor": [1, 3, 4, 7, 8, 10, 11],
    "Octatonic 1 (C)": [0, 1, 3, 4, 6, 7, 9, 10],
    "Octatonic 2 (Db)": [1, 2, 4, 5, 7, 8, 10, 11],
    "Octatonic 3 (D)": [0, 2, 3, 5, 6, 8, 9, 11],
    "Hexatonic 1": [0, 1, 4, 5, 8, 9],
    "Hexatonic 2": [1, 2, 5, 6, 9, 10],
    "Hexatonic 3": [2, 3, 6, 7, 10, 11],
    "Hexatonic 4": [0, 3, 4, 7, 8, 11],
    "Whole Tone 1": [0, 2, 4, 6, 8, 10],
    "Whole Tone 2": [1, 3, 5, 7, 9, 11],
}


def transpose_pcs(pcs: frozenset, semitones: int) -> frozenset:
    """Transpose a set of pitch classes by a number of semitones."""
    return frozenset((pc + semitones) % 12 for pc in pcs)


def harmonica_works(scale_pcs: set, harmonica_root: int) -> dict:
    """
    Check if a harmonica can play in a given scale.
    Returns dict with 'blow', 'draw', and 'works' (either).
    """
    blow_transposed = transpose_pcs(BLOW_PCS, harmonica_root)
    draw_transposed = transpose_pcs(DRAW_PCS, harmonica_root)

    blow_works = blow_transposed.issubset(scale_pcs)
    draw_works = draw_transposed.issubset(scale_pcs)

    return {
        'blow': blow_works,
        'draw': draw_works,
        'works': blow_works or draw_works
    }


def analyze_scales(harmonica_roots: list[int]) -> list[dict]:
    """
    Analyze all 57 scales for compatibility with given harmonicas.
    Returns list of results sorted by number of working harmonicas (descending).
    """
    results = []

    for scale_name, scale_pcs_list in SCALES.items():
        scale_pcs = set(scale_pcs_list)

        working_harmonicas = []
        for root in harmonica_roots:
            status = harmonica_works(scale_pcs, root)
            if status['works']:
                mode = []
                if status['blow']:
                    mode.append('OUT')
                if status['draw']:
                    mode.append('IN')
                working_harmonicas.append({
                    'root': root,
                    'name': NOTE_NAMES[root],
                    'mode': ' + '.join(mode)
                })

        if working_harmonicas:  # Only include scales with at least one working harmonica
            results.append({
                'scale': scale_name,
                'count': len(working_harmonicas),
                'harmonicas': working_harmonicas
            })

    # Sort by count (descending), then by scale name
    results.sort(key=lambda x: (-x['count'], x['scale']))

    return results


def print_results(results: list[dict], harmonica_roots: list[int]):
    """Print the analysis results in a readable format."""
    print("=" * 70)
    print("HARMONICA SCALE COMPATIBILITY ANALYSIS")
    print("=" * 70)
    print()
    print(f"Your harmonicas: {', '.join(NOTE_NAMES[r] for r in harmonica_roots)}")
    print(f"Total unique keys: {len(set(harmonica_roots))}")
    print()
    print("-" * 70)

    current_count = None
    for result in results:
        if result['count'] != current_count:
            current_count = result['count']
            print()
            print(f"=== {current_count} HARMONICA{'S' if current_count != 1 else ''} ===")
            print()

        harmonicas_str = ", ".join(
            f"{h['name']} ({h['mode']})" for h in result['harmonicas']
        )
        print(f"  {result['scale']}")
        print(f"    -> {harmonicas_str}")
        print()


def analyze_scales_with_inventory(harmonica_inventory: list[int]) -> list[dict]:
    """
    Analyze scales counting actual harmonicas owned (including duplicates).
    """
    results = []

    for scale_name, scale_pcs_list in SCALES.items():
        scale_pcs = set(scale_pcs_list)

        working_count = 0
        working_details = []

        # Count how many of each key we have
        from collections import Counter
        inventory_counts = Counter(harmonica_inventory)

        for root, count in inventory_counts.items():
            status = harmonica_works(scale_pcs, root)
            if status['works']:
                mode = []
                if status['blow']:
                    mode.append('OUT')
                if status['draw']:
                    mode.append('IN')
                working_count += count
                working_details.append({
                    'root': root,
                    'name': NOTE_NAMES[root],
                    'mode': ' + '.join(mode),
                    'count': count
                })

        if working_count > 0:
            results.append({
                'scale': scale_name,
                'count': working_count,
                'harmonicas': working_details
            })

    results.sort(key=lambda x: (-x['count'], x['scale']))
    return results


def print_inventory_results(results: list[dict], inventory: list[int]):
    """Print results counting actual harmonicas owned."""
    from collections import Counter
    counts = Counter(inventory)

    print("=" * 70)
    print("HARMONICA SCALE COMPATIBILITY (COUNTING YOUR INVENTORY)")
    print("=" * 70)
    print()
    inv_str = ", ".join(f"{NOTE_NAMES[k]} x{v}" for k, v in sorted(counts.items()))
    print(f"Your inventory: {inv_str}")
    print(f"Total harmonicas: {len(inventory)}")
    print()
    print("-" * 70)

    current_count = None
    for result in results:
        if result['count'] != current_count:
            current_count = result['count']
            print()
            print(f"=== {current_count} HARMONICA{'S' if current_count != 1 else ''} CAN PLAY ===")
            print()

        harmonicas_str = ", ".join(
            f"{h['name']} x{h['count']} ({h['mode']})" for h in result['harmonicas']
        )
        print(f"  {result['scale']}")
        print(f"    -> {harmonicas_str}")
        print()


def main():
    # User's harmonicas: C, C, C, A, Eb, F
    # Roots: C=0, A=9, Eb=3, F=5
    user_harmonicas = [0, 0, 0, 9, 3, 5]

    print()
    print("=" * 70)
    print("ANALYSIS WITH YOUR ACTUAL INVENTORY")
    print("=" * 70)

    results = analyze_scales_with_inventory(user_harmonicas)
    print_inventory_results(results, user_harmonicas)

    print("=" * 70)
    print(f"Total scales with at least one working harmonica: {len(results)}")
    print("=" * 70)


if __name__ == "__main__":
    main()
