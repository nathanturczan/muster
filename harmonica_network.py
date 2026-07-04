#!/usr/bin/env python3
"""
Harmonica Scale Network Graph

Visualizes the adjacency network of scales where your harmonicas work,
with node size proportional to how many harmonicas can play.
"""

import networkx as nx
import matplotlib.pyplot as plt
from collections import Counter

# Harmonica pitch class patterns (Richter tuning)
BLOW_PCS = frozenset([0, 4, 7])
DRAW_PCS = frozenset([2, 5, 7, 9, 11])

NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

# All 57 scales with their pitch classes and adjacencies
# Adjacencies from ScaleData.js
SCALES = {
    "A Acoustic": {
        "pcs": [1, 3, 4, 6, 7, 9, 11],
        "adj": ["E Diatonic", "E Harmonic Minor", "Octatonic 2", "D Diatonic", "B Harmonic Major", "Whole Tone 2"]
    },
    "A Diatonic": {
        "pcs": [1, 2, 4, 6, 8, 9, 11],
        "adj": ["E Diatonic", "F# Harmonic Minor", "D Acoustic", "D Diatonic", "A Harmonic Major", "E Acoustic"]
    },
    "A Harmonic Major": {
        "pcs": [1, 2, 4, 5, 8, 9, 11],
        "adj": ["A Diatonic", "F# Harmonic Minor", "G Acoustic", "Octatonic 2", "A Harmonic Minor", "Hexatonic 1"]
    },
    "A Harmonic Minor": {
        "pcs": [0, 2, 4, 5, 8, 9, 11],
        "adj": ["C Diatonic", "A Harmonic Major", "D Acoustic", "Octatonic 3", "C Harmonic Major", "Hexatonic 1"]
    },
    "Bb Acoustic": {
        "pcs": [0, 2, 4, 5, 7, 8, 10],
        "adj": ["F Diatonic", "F Harmonic Minor", "Octatonic 2", "Eb Diatonic", "C Harmonic Major", "Whole Tone 1"]
    },
    "Bb Diatonic": {
        "pcs": [0, 2, 3, 5, 7, 9, 10],
        "adj": ["F Diatonic", "G Harmonic Minor", "Eb Acoustic", "Eb Diatonic", "Bb Harmonic Major", "F Acoustic"]
    },
    "Bb Harmonic Major": {
        "pcs": [0, 2, 3, 5, 6, 9, 10],
        "adj": ["Bb Diatonic", "G Harmonic Minor", "Ab Acoustic", "Octatonic 3", "Bb Harmonic Minor", "Hexatonic 2"]
    },
    "Bb Harmonic Minor": {
        "pcs": [0, 1, 3, 5, 6, 9, 10],
        "adj": ["Db Diatonic", "Bb Harmonic Major", "Eb Acoustic", "Octatonic 1", "Db Harmonic Major", "Hexatonic 2"]
    },
    "B Acoustic": {
        "pcs": [1, 3, 5, 6, 8, 9, 11],
        "adj": ["F# Diatonic", "F# Harmonic Minor", "Octatonic 3", "E Diatonic", "Db Harmonic Major", "Whole Tone 2"]
    },
    "B Diatonic": {
        "pcs": [1, 3, 4, 6, 8, 10, 11],
        "adj": ["F# Diatonic", "Ab Harmonic Minor", "E Acoustic", "E Diatonic", "B Harmonic Major", "F# Acoustic"]
    },
    "B Harmonic Major": {
        "pcs": [1, 3, 4, 6, 7, 10, 11],
        "adj": ["B Diatonic", "Ab Harmonic Minor", "A Acoustic", "Octatonic 1", "B Harmonic Minor", "Hexatonic 3"]
    },
    "B Harmonic Minor": {
        "pcs": [1, 2, 4, 6, 7, 10, 11],
        "adj": ["D Diatonic", "B Harmonic Major", "E Acoustic", "Octatonic 2", "D Harmonic Major", "Hexatonic 3"]
    },
    "C Acoustic": {
        "pcs": [0, 2, 4, 6, 7, 9, 10],
        "adj": ["G Diatonic", "G Harmonic Minor", "Octatonic 1", "F Diatonic", "D Harmonic Major", "Whole Tone 1"]
    },
    "C Diatonic": {
        "pcs": [0, 2, 4, 5, 7, 9, 11],
        "adj": ["G Diatonic", "A Harmonic Minor", "F Acoustic", "F Diatonic", "C Harmonic Major", "G Acoustic"]
    },
    "C Harmonic Major": {
        "pcs": [0, 2, 4, 5, 7, 8, 11],
        "adj": ["C Diatonic", "A Harmonic Minor", "Bb Acoustic", "Octatonic 2", "C Harmonic Minor", "Hexatonic 4"]
    },
    "C Harmonic Minor": {
        "pcs": [0, 2, 3, 5, 7, 8, 11],
        "adj": ["Eb Diatonic", "C Harmonic Major", "F Acoustic", "Octatonic 3", "Eb Harmonic Major", "Hexatonic 4"]
    },
    "Db Acoustic": {
        "pcs": [1, 3, 5, 7, 8, 10, 11],
        "adj": ["Ab Diatonic", "Ab Harmonic Minor", "Octatonic 2", "F# Diatonic", "Eb Harmonic Major", "Whole Tone 2"]
    },
    "Db Diatonic": {
        "pcs": [0, 1, 3, 5, 6, 8, 10],
        "adj": ["Ab Diatonic", "Bb Harmonic Minor", "F# Acoustic", "F# Diatonic", "Db Harmonic Major", "Ab Acoustic"]
    },
    "Db Harmonic Major": {
        "pcs": [0, 1, 3, 5, 6, 8, 9],
        "adj": ["Db Diatonic", "Bb Harmonic Minor", "B Acoustic", "Octatonic 3", "Db Harmonic Minor", "Hexatonic 1"]
    },
    "Db Harmonic Minor": {
        "pcs": [0, 1, 3, 4, 6, 8, 9],
        "adj": ["E Diatonic", "Db Harmonic Major", "F# Acoustic", "Octatonic 1", "E Harmonic Major", "Hexatonic 1"]
    },
    "D Acoustic": {
        "pcs": [0, 2, 4, 6, 8, 9, 11],
        "adj": ["A Diatonic", "A Harmonic Minor", "Octatonic 3", "G Diatonic", "E Harmonic Major", "Whole Tone 1"]
    },
    "D Diatonic": {
        "pcs": [1, 2, 4, 6, 7, 9, 11],
        "adj": ["A Diatonic", "B Harmonic Minor", "G Acoustic", "G Diatonic", "D Harmonic Major", "A Acoustic"]
    },
    "D Harmonic Major": {
        "pcs": [1, 2, 4, 6, 7, 9, 10],
        "adj": ["D Diatonic", "B Harmonic Minor", "C Acoustic", "Octatonic 1", "D Harmonic Minor", "Hexatonic 2"]
    },
    "D Harmonic Minor": {
        "pcs": [1, 2, 4, 5, 7, 9, 10],
        "adj": ["F Diatonic", "D Harmonic Major", "G Acoustic", "Octatonic 2", "F Harmonic Major", "Hexatonic 2"]
    },
    "Eb Acoustic": {
        "pcs": [0, 1, 3, 5, 7, 9, 10],
        "adj": ["Bb Diatonic", "Bb Harmonic Minor", "Octatonic 1", "Ab Diatonic", "F Harmonic Major", "Whole Tone 2"]
    },
    "Eb Diatonic": {
        "pcs": [0, 2, 3, 5, 7, 8, 10],
        "adj": ["Bb Diatonic", "C Harmonic Minor", "Ab Acoustic", "Ab Diatonic", "Eb Harmonic Major", "Bb Acoustic"]
    },
    "Eb Harmonic Major": {
        "pcs": [2, 3, 5, 7, 8, 10, 11],
        "adj": ["Eb Diatonic", "C Harmonic Minor", "Db Acoustic", "Octatonic 2", "Eb Harmonic Minor", "Hexatonic 3"]
    },
    "Eb Harmonic Minor": {
        "pcs": [2, 3, 5, 6, 8, 10, 11],
        "adj": ["F# Diatonic", "Eb Harmonic Major", "Ab Acoustic", "Octatonic 3", "F# Harmonic Major", "Hexatonic 3"]
    },
    "E Acoustic": {
        "pcs": [1, 2, 4, 6, 8, 10, 11],
        "adj": ["B Diatonic", "B Harmonic Minor", "Octatonic 2", "A Diatonic", "F# Harmonic Major", "Whole Tone 1"]
    },
    "E Diatonic": {
        "pcs": [1, 3, 4, 6, 8, 9, 11],
        "adj": ["B Diatonic", "Db Harmonic Minor", "A Acoustic", "A Diatonic", "E Harmonic Major", "B Acoustic"]
    },
    "E Harmonic Major": {
        "pcs": [0, 3, 4, 6, 8, 9, 11],
        "adj": ["E Diatonic", "Db Harmonic Minor", "D Acoustic", "Octatonic 3", "E Harmonic Minor", "Hexatonic 4"]
    },
    "E Harmonic Minor": {
        "pcs": [0, 3, 4, 6, 7, 9, 11],
        "adj": ["G Diatonic", "E Harmonic Major", "A Acoustic", "Octatonic 1", "G Harmonic Major", "Hexatonic 4"]
    },
    "F Acoustic": {
        "pcs": [0, 2, 3, 5, 7, 9, 11],
        "adj": ["C Diatonic", "C Harmonic Minor", "Octatonic 3", "Bb Diatonic", "G Harmonic Major", "Whole Tone 2"]
    },
    "F Diatonic": {
        "pcs": [0, 2, 4, 5, 7, 9, 10],
        "adj": ["C Diatonic", "D Harmonic Minor", "Bb Acoustic", "Bb Diatonic", "F Harmonic Major", "C Acoustic"]
    },
    "F Harmonic Major": {
        "pcs": [0, 1, 4, 5, 7, 9, 10],
        "adj": ["F Diatonic", "D Harmonic Minor", "Eb Acoustic", "Octatonic 1", "F Harmonic Minor", "Hexatonic 1"]
    },
    "F Harmonic Minor": {
        "pcs": [0, 1, 4, 5, 7, 8, 10],
        "adj": ["Ab Diatonic", "F Harmonic Major", "Bb Acoustic", "Octatonic 2", "Ab Harmonic Major", "Hexatonic 1"]
    },
    "F# Acoustic": {
        "pcs": [0, 1, 3, 4, 6, 8, 10],
        "adj": ["Db Diatonic", "Db Harmonic Minor", "Octatonic 1", "B Diatonic", "Ab Harmonic Major", "Whole Tone 1"]
    },
    "F# Diatonic": {
        "pcs": [1, 3, 5, 6, 8, 10, 11],
        "adj": ["Db Diatonic", "Eb Harmonic Minor", "B Acoustic", "B Diatonic", "F# Harmonic Major", "Db Acoustic"]
    },
    "F# Harmonic Major": {
        "pcs": [1, 2, 5, 6, 8, 10, 11],
        "adj": ["F# Diatonic", "Eb Harmonic Minor", "E Acoustic", "Octatonic 2", "F# Harmonic Minor", "Hexatonic 2"]
    },
    "F# Harmonic Minor": {
        "pcs": [1, 2, 5, 6, 8, 9, 11],
        "adj": ["A Diatonic", "F# Harmonic Major", "B Acoustic", "Octatonic 3", "A Harmonic Major", "Hexatonic 2"]
    },
    "G Acoustic": {
        "pcs": [1, 2, 4, 5, 7, 9, 11],
        "adj": ["D Diatonic", "D Harmonic Minor", "Octatonic 2", "C Diatonic", "A Harmonic Major", "Whole Tone 2"]
    },
    "G Diatonic": {
        "pcs": [0, 2, 4, 6, 7, 9, 11],
        "adj": ["D Diatonic", "E Harmonic Minor", "C Acoustic", "C Diatonic", "G Harmonic Major", "D Acoustic"]
    },
    "G Harmonic Major": {
        "pcs": [0, 2, 3, 6, 7, 9, 11],
        "adj": ["G Diatonic", "E Harmonic Minor", "F Acoustic", "Octatonic 3", "G Harmonic Minor", "Hexatonic 3"]
    },
    "G Harmonic Minor": {
        "pcs": [0, 2, 3, 6, 7, 9, 10],
        "adj": ["Bb Diatonic", "G Harmonic Major", "C Acoustic", "Octatonic 1", "Bb Harmonic Major", "Hexatonic 3"]
    },
    "Ab Acoustic": {
        "pcs": [0, 2, 3, 5, 6, 8, 10],
        "adj": ["Eb Diatonic", "Eb Harmonic Minor", "Octatonic 3", "Db Diatonic", "Bb Harmonic Major", "Whole Tone 1"]
    },
    "Ab Diatonic": {
        "pcs": [0, 1, 3, 5, 7, 8, 10],
        "adj": ["Eb Diatonic", "F Harmonic Minor", "Db Acoustic", "Db Diatonic", "Ab Harmonic Major", "Eb Acoustic"]
    },
    "Ab Harmonic Major": {
        "pcs": [0, 1, 3, 4, 7, 8, 10],
        "adj": ["Ab Diatonic", "F Harmonic Minor", "F# Acoustic", "Octatonic 1", "Ab Harmonic Minor", "Hexatonic 4"]
    },
    "Ab Harmonic Minor": {
        "pcs": [1, 3, 4, 7, 8, 10, 11],
        "adj": ["B Diatonic", "Ab Harmonic Major", "Db Acoustic", "Octatonic 2", "B Harmonic Major", "Hexatonic 4"]
    },
    "Octatonic 1": {
        "pcs": [0, 1, 3, 4, 6, 7, 9, 10],
        "adj": ["C Acoustic", "Eb Acoustic", "F# Acoustic", "A Acoustic", "D Harmonic Major", "F Harmonic Major", "Ab Harmonic Major", "B Harmonic Major", "Db Harmonic Minor", "E Harmonic Minor", "G Harmonic Minor", "Bb Harmonic Minor"]
    },
    "Octatonic 2": {
        "pcs": [1, 2, 4, 5, 7, 8, 10, 11],
        "adj": ["Db Acoustic", "E Acoustic", "G Acoustic", "Bb Acoustic", "C Harmonic Major", "Eb Harmonic Major", "F# Harmonic Major", "A Harmonic Major", "D Harmonic Minor", "F Harmonic Minor", "Ab Harmonic Minor", "B Harmonic Minor"]
    },
    "Octatonic 3": {
        "pcs": [0, 2, 3, 5, 6, 8, 9, 11],
        "adj": ["D Acoustic", "F Acoustic", "Ab Acoustic", "B Acoustic", "Db Harmonic Major", "E Harmonic Major", "G Harmonic Major", "Bb Harmonic Major", "C Harmonic Minor", "Eb Harmonic Minor", "F# Harmonic Minor", "A Harmonic Minor"]
    },
    "Hexatonic 1": {
        "pcs": [0, 1, 4, 5, 8, 9],
        "adj": ["Db Harmonic Minor", "F Harmonic Minor", "A Harmonic Minor", "Db Harmonic Major", "F Harmonic Major", "A Harmonic Major"]
    },
    "Hexatonic 2": {
        "pcs": [1, 2, 5, 6, 9, 10],
        "adj": ["D Harmonic Minor", "F# Harmonic Minor", "Bb Harmonic Minor", "D Harmonic Major", "F# Harmonic Major", "Bb Harmonic Major"]
    },
    "Hexatonic 3": {
        "pcs": [2, 3, 6, 7, 10, 11],
        "adj": ["Eb Harmonic Minor", "G Harmonic Minor", "B Harmonic Minor", "Eb Harmonic Major", "G Harmonic Major", "B Harmonic Major"]
    },
    "Hexatonic 4": {
        "pcs": [0, 3, 4, 7, 8, 11],
        "adj": ["C Harmonic Minor", "E Harmonic Minor", "Ab Harmonic Minor", "C Harmonic Major", "E Harmonic Major", "Ab Harmonic Major"]
    },
    "Whole Tone 1": {
        "pcs": [0, 2, 4, 6, 8, 10],
        "adj": ["C Acoustic", "D Acoustic", "E Acoustic", "F# Acoustic", "Ab Acoustic", "Bb Acoustic"]
    },
    "Whole Tone 2": {
        "pcs": [1, 3, 5, 7, 9, 11],
        "adj": ["Db Acoustic", "Eb Acoustic", "F Acoustic", "G Acoustic", "A Acoustic", "B Acoustic"]
    },
}


def transpose_pcs(pcs: frozenset, semitones: int) -> frozenset:
    return frozenset((pc + semitones) % 12 for pc in pcs)


def harmonica_works(scale_pcs: set, harmonica_root: int) -> bool:
    blow_transposed = transpose_pcs(BLOW_PCS, harmonica_root)
    draw_transposed = transpose_pcs(DRAW_PCS, harmonica_root)
    return blow_transposed.issubset(scale_pcs) or draw_transposed.issubset(scale_pcs)


def count_working_harmonicas(scale_pcs: set, inventory: list[int]) -> int:
    count = 0
    for root in inventory:
        if harmonica_works(scale_pcs, root):
            count += 1
    return count


def build_network(inventory: list[int]):
    """Build networkx graph of scales where harmonicas work."""
    G = nx.Graph()

    # First pass: identify scales where at least one harmonica works
    working_scales = {}
    for scale_name, data in SCALES.items():
        scale_pcs = set(data["pcs"])
        count = count_working_harmonicas(scale_pcs, inventory)
        if count > 0:
            working_scales[scale_name] = count

    # Add nodes
    for scale_name, count in working_scales.items():
        G.add_node(scale_name, count=count)

    # Add edges (only between scales that both work)
    for scale_name in working_scales:
        for adj_name in SCALES[scale_name]["adj"]:
            if adj_name in working_scales:
                G.add_edge(scale_name, adj_name)

    return G


def get_short_harmonica_details(scale_pcs: set, inventory: list[int]) -> str:
    """Get short label like 'C:OUT Eb:IN F:IN' for graph labels."""
    counts = Counter(inventory)
    details = []
    for root in sorted(set(inventory)):
        blow = transpose_pcs(BLOW_PCS, root).issubset(scale_pcs)
        draw = transpose_pcs(DRAW_PCS, root).issubset(scale_pcs)
        if blow or draw:
            mode = []
            if blow:
                mode.append("OUT")
            if draw:
                mode.append("IN")
            details.append(f"{NOTE_NAMES[root]}:{'+'.join(mode)}")
    return "  ".join(details)


def get_harmonica_details(scale_pcs: set, inventory: list[int]) -> str:
    """Get details of which harmonicas work in a scale."""
    counts = Counter(inventory)
    details = []
    for root, num in sorted(counts.items()):
        blow = transpose_pcs(BLOW_PCS, root).issubset(scale_pcs)
        draw = transpose_pcs(DRAW_PCS, root).issubset(scale_pcs)
        if blow or draw:
            mode = []
            if blow:
                mode.append("OUT")
            if draw:
                mode.append("IN")
            details.append(f"{NOTE_NAMES[root]}×{num} ({'+'.join(mode)})")
    return ", ".join(details)


def visualize_network(G, inventory: list[int], output_file: str = "harmonica_network.png"):
    """Create visualization with radial layout - center = most harmonicas."""
    import math

    if len(G.nodes()) == 0:
        print("No scales found where harmonicas work!")
        return

    plt.figure(figsize=(24, 24))

    counts = nx.get_node_attributes(G, 'count')
    max_count = max(counts.values())
    min_count = min(counts.values())

    # Discrete colors for each count level
    discrete_colors = {
        5: '#d62728',  # red
        4: '#ff7f0e',  # orange
        3: '#ffbb33',  # yellow-orange
        2: '#2ca02c',  # green
        1: '#1f77b4',  # blue
    }

    # Group nodes by count
    by_count = {}
    for node, count in counts.items():
        by_count.setdefault(count, []).append(node)

    # Radial layout: center = highest count, outer = lowest
    pos = {}
    ring_radii = {}

    # Calculate ring radii (higher count = smaller radius = closer to center)
    count_levels = sorted(by_count.keys(), reverse=True)
    for i, count in enumerate(count_levels):
        # Ring 0 (center) for highest count, increasing outward
        ring_radii[count] = i * 3.5  # spacing between rings

    # Position nodes in each ring
    for count, nodes_in_ring in by_count.items():
        radius = ring_radii[count]
        n = len(nodes_in_ring)

        if radius == 0:
            # Center ring - small circle or cluster
            if n == 1:
                pos[nodes_in_ring[0]] = (0, 0)
            else:
                for j, node in enumerate(sorted(nodes_in_ring)):
                    angle = 2 * math.pi * j / n
                    pos[node] = (0.5 * math.cos(angle), 0.5 * math.sin(angle))
        else:
            # Outer rings
            for j, node in enumerate(sorted(nodes_in_ring)):
                angle = 2 * math.pi * j / n + (math.pi / n)  # offset to stagger
                pos[node] = (radius * math.cos(angle), radius * math.sin(angle))

    # Node sizes based on count
    node_sizes = []
    for node in G.nodes():
        count = counts[node]
        size = 600 + (count - min_count) * 500  # 600 to 2600
        node_sizes.append(size)

    # Node colors (discrete)
    node_colors = [discrete_colors.get(counts[node], '#999999') for node in G.nodes()]

    # Draw edges
    nx.draw_networkx_edges(G, pos, alpha=0.2, width=1, edge_color='gray')

    # Draw nodes
    nx.draw_networkx_nodes(
        G, pos,
        node_size=node_sizes,
        node_color=node_colors,
        alpha=0.9,
        edgecolors='black',
        linewidths=1.5
    )

    # Draw scale name labels (above node)
    label_pos_above = {node: (x, y + 0.55) for node, (x, y) in pos.items()}
    nx.draw_networkx_labels(G, label_pos_above, font_size=9, font_weight='bold')

    # Draw harmonica detail labels (below node)
    detail_labels = {}
    for node in G.nodes():
        scale_pcs = set(SCALES[node]["pcs"])
        detail_labels[node] = get_short_harmonica_details(scale_pcs, inventory)

    label_pos_below = {node: (x, y - 0.55) for node, (x, y) in pos.items()}
    nx.draw_networkx_labels(G, label_pos_below, labels=detail_labels, font_size=7, font_color='#333333')

    # Legend for discrete colors
    legend_elements = []
    for count in sorted(discrete_colors.keys(), reverse=True):
        if count in by_count:
            color = discrete_colors[count]
            label = f"{count} harmonica{'s' if count != 1 else ''} ({len(by_count[count])} scales)"
            legend_elements.append(plt.scatter([], [], c=color, s=200, label=label, edgecolors='black'))

    plt.legend(handles=legend_elements, loc='upper left', fontsize=10, title="Harmonicas Playable")

    # Title
    inv_counts = Counter(inventory)
    inv_str = ", ".join(f"{NOTE_NAMES[k]}×{v}" for k, v in sorted(inv_counts.items()))
    plt.title(f"Scale Adjacency Network\nHarmonicas: {inv_str}\n(Center = most harmonicas, outer rings = fewer)", fontsize=14)

    plt.axis('off')
    plt.tight_layout()
    plt.savefig(output_file, dpi=150, bbox_inches='tight', facecolor='white')
    print(f"\nSaved to {output_file}")
    plt.close()


def print_network_stats(G, inventory: list[int]):
    """Print statistics about the network."""
    counts = nx.get_node_attributes(G, 'count')

    print("\n" + "=" * 60)
    print("NETWORK STATISTICS")
    print("=" * 60)
    print(f"Total scales where harmonicas work: {len(G.nodes())}")
    print(f"Total adjacency connections: {len(G.edges())}")
    print()

    # Group by count
    by_count = {}
    for node, count in counts.items():
        by_count.setdefault(count, []).append(node)

    for count in sorted(by_count.keys(), reverse=True):
        scales = by_count[count]
        print(f"\n{count} harmonicas: {len(scales)} scales")
        for scale in sorted(scales):
            scale_pcs = set(SCALES[scale]["pcs"])
            details = get_harmonica_details(scale_pcs, inventory)
            # Count connections to higher-count scales
            neighbors = list(G.neighbors(scale))
            higher_neighbors = [n for n in neighbors if counts.get(n, 0) >= count]
            print(f"  • {scale}")
            print(f"    {details}")
            print(f"    Adjacent to: {', '.join(sorted(neighbors)[:5])}{'...' if len(neighbors) > 5 else ''}")


def main():
    # User's harmonicas
    inventory = [0, 0, 0, 9, 3, 5]  # C×3, A, Eb, F

    print("Building harmonica scale network...")
    G = build_network(inventory)

    print_network_stats(G, inventory)

    print("\nGenerating visualization...")
    visualize_network(G, inventory)


if __name__ == "__main__":
    main()
