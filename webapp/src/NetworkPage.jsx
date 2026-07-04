// src/NetworkPage.jsx
// Interactive harmonica scale network + Ensemble Broadcast panel
// (panel UI copied from noteschordsscales SkeletonPlayer.jsx).
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  createEnsembleRoom,
  getUserHostedRooms,
  updateEnsembleState,
} from "./firebase";
import { buildNetwork, colorFor } from "./scales";
import {
  DEFAULT_INVENTORY,
  NOTE_NAMES,
  inventoryToInstruments,
  makePitched,
  makeDyad,
  makeChameleon,
} from "./instruments";
import { TEMPLATES } from "./templates";

const INVENTORY_KEY = "harmonica-network-inventory-v2";
const LEGACY_INVENTORY_KEY = "harmonica-network-inventory";

function isHarmonicaCounts(value) {
  return (
    Array.isArray(value) &&
    value.length === 12 &&
    value.every((n) => Number.isInteger(n) && n >= 0)
  );
}

function loadInventory() {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && isHarmonicaCounts(parsed.harmonicas) && Array.isArray(parsed.found)) {
        return parsed;
      }
    }
    // Migrate v1: a bare 12-count harmonica array
    const legacy = localStorage.getItem(LEGACY_INVENTORY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (isHarmonicaCounts(parsed)) {
        return { harmonicas: parsed, found: [] };
      }
    }
  } catch {
    // fall through
  }
  return DEFAULT_INVENTORY;
}

function saveInventory(inventory) {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  } catch {
    // localStorage unavailable
  }
}

export default function NetworkPage({ currentUser }) {
  // What the ensemble has on hand: harmonica counts per key + found instruments
  const [inventory, setInventory] = useState(loadInventory);
  const [inventoryTab, setInventoryTab] = useState("harmonicas");

  // Show scales playable by at least this many instruments at once
  const [minVoices, setMinVoices] = useState(2);

  // Network (rebuilt whenever the inventory or threshold changes)
  const instruments = useMemo(() => inventoryToInstruments(inventory), [inventory]);
  const network = useMemo(
    () => buildNetwork(instruments, minVoices),
    [instruments, minVoices]
  );
  const { nodes, edges, byCount, extent, maxCount } = network;

  // Threshold slider range follows the richest scale; relax the threshold
  // if the inventory shrinks below it.
  const sliderMax = Math.max(2, maxCount);
  useEffect(() => {
    if (minVoices > sliderMax) setMinVoices(sliderMax);
  }, [minVoices, sliderMax]);

  // Selected scale (display name)
  const [selectedScale, setSelectedScale] = useState(null);

  const adjustInventory = useCallback((root, delta) => {
    setInventory((prev) => {
      const harmonicas = [...prev.harmonicas];
      harmonicas[root] = Math.max(0, harmonicas[root] + delta);
      const next = { ...prev, harmonicas };
      saveInventory(next);
      return next;
    });
  }, []);

  // Found-instrument quick-add form
  const [foundName, setFoundName] = useState("");
  const [foundPc, setFoundPc] = useState(0);
  const [foundPc2, setFoundPc2] = useState(""); // "" = single pitch
  const [foundRole, setFoundRole] = useState("voice"); // voice | anchor | chameleon

  const addFoundInstrument = useCallback((instrument) => {
    setInventory((prev) => {
      const next = { ...prev, found: [...prev.found, instrument] };
      saveInventory(next);
      return next;
    });
  }, []);

  const handleAddFound = useCallback(() => {
    const label = foundName.trim();
    if (!label) return;
    let instrument;
    if (foundRole === "chameleon") {
      instrument = makeChameleon(label);
    } else {
      instrument =
        foundPc2 === ""
          ? makePitched(label, foundPc)
          : makeDyad(label, foundPc, Number(foundPc2));
      if (foundRole === "anchor") instrument.role = "anchor";
    }
    addFoundInstrument(instrument);
    setFoundName("");
    setFoundPc2("");
    setFoundRole("voice");
  }, [foundName, foundPc, foundPc2, foundRole, addFoundInstrument]);

  const handleAddTemplate = useCallback(
    (templateId) => {
      const template = TEMPLATES.find((t) => t.id === templateId);
      if (template) addFoundInstrument(template.make());
    },
    [addFoundInstrument]
  );

  const handleRemoveFound = useCallback((index) => {
    setInventory((prev) => {
      const next = { ...prev, found: prev.found.filter((_, i) => i !== index) };
      saveInventory(next);
      return next;
    });
  }, []);

  // Deselect if the inventory change removed the selected scale
  useEffect(() => {
    if (selectedScale && !nodes[selectedScale]) {
      setSelectedScale(null);
    }
  }, [nodes, selectedScale]);

  // Ensemble state
  const [ensembleRoomId, setEnsembleRoomId] = useState(null);
  const [ensembleRoomName, setEnsembleRoomName] = useState("");
  const [ensembleBpm, setEnsembleBpm] = useState(60);
  const [isCreatingEnsemble, setIsCreatingEnsemble] = useState(false);
  const [ensembleError, setEnsembleError] = useState("");
  const [existingRooms, setExistingRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const selectedScaleKey =
    selectedScale && nodes[selectedScale] ? nodes[selectedScale].scaleKey : null;

  // Load rooms this user already hosts
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    setLoadingRooms(true);
    getUserHostedRooms(currentUser.uid)
      .then((rooms) => {
        if (!cancelled) setExistingRooms(rooms);
      })
      .catch((err) => {
        console.error("[ensemble] failed to load rooms", err);
      })
      .finally(() => {
        if (!cancelled) setLoadingRooms(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const handleCreateEnsemble = useCallback(async () => {
    if (!currentUser) return;
    const trimmed = ensembleRoomName.trim();
    if (!trimmed) return;

    setIsCreatingEnsemble(true);
    setEnsembleError("");

    try {
      const { roomId } = await createEnsembleRoom({
        roomName: trimmed,
        hostUser: currentUser,
      });
      setEnsembleRoomId(roomId);

      // Refresh existing rooms list
      const rooms = await getUserHostedRooms(currentUser.uid);
      setExistingRooms(rooms);

      // Broadcast initial state immediately
      await updateEnsembleState({
        roomId,
        bpm: ensembleBpm,
        scaleKey: selectedScaleKey || null,
      });
    } catch (err) {
      console.error("[ensemble] failed to create room", err);
      setEnsembleError("Could not create ensemble.");
    } finally {
      setIsCreatingEnsemble(false);
    }
  }, [currentUser, ensembleRoomName, ensembleBpm, selectedScaleKey]);

  const handleSelectExistingRoom = useCallback(
    (roomId) => {
      const room = existingRooms.find((r) => r.id === roomId);
      if (!room) return;

      setEnsembleRoomId(roomId);
      setEnsembleRoomName(room.roomName);
      setEnsembleBpm(room.bpm || 60);

      // Broadcast current state immediately
      updateEnsembleState({
        roomId,
        bpm: room.bpm || 60,
        scaleKey: selectedScaleKey || null,
      }).catch((err) => {
        console.error("[ensemble] failed to update existing room", err);
      });
    },
    [existingRooms, selectedScaleKey]
  );

  // Debounced broadcast of scale + bpm (same 100ms pattern as noteschordsscales)
  const broadcastTimerRef = useRef(null);
  useEffect(() => {
    if (!ensembleRoomId) return;

    if (broadcastTimerRef.current) {
      clearTimeout(broadcastTimerRef.current);
    }
    broadcastTimerRef.current = setTimeout(() => {
      updateEnsembleState({
        roomId: ensembleRoomId,
        bpm: ensembleBpm,
        scaleKey: selectedScaleKey || null,
      }).catch((err) => {
        console.error("[ensemble] broadcast failed", err);
      });
    }, 100);

    return () => {
      if (broadcastTimerRef.current) {
        clearTimeout(broadcastTimerRef.current);
      }
    };
  }, [ensembleRoomId, ensembleBpm, selectedScaleKey]);

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#fafafa",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#111",
        padding: "8px 12px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto 8px", flexShrink: 0 }}>
        <h1 style={{ fontSize: 18, margin: "0 0 8px", textAlign: "center" }}>
          Muster
        </h1>

        {/* Panels sit side by side when there's room, stack on narrow screens */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "stretch",
          }}
        >

        {/* Ensemble Controls — copied from noteschordsscales */}
        {currentUser && (
          <div
            style={{
              flex: "1 1 320px",
              minWidth: 0,
              boxSizing: "border-box",
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              padding: "10px 12px",
            }}
          >
            <div style={{ fontWeight: 500, marginBottom: "12px", fontSize: "13px" }}>
              Ensemble Broadcast:
            </div>

            {!ensembleRoomId ? (
              <>
                {/* Select existing ensemble */}
                {existingRooms && existingRooms.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#666" }}>
                      Control existing ensemble:
                    </label>
                    <select
                      onChange={(e) => {
                        const roomId = e.target.value;
                        if (roomId) handleSelectExistingRoom(roomId);
                      }}
                      disabled={loadingRooms}
                      style={{
                        width: "100%",
                        fontSize: "13px",
                        padding: "6px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">
                        {loadingRooms ? "Loading..." : "Select existing ensemble"}
                      </option>
                      {existingRooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.roomName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Create new ensemble */}
                <div style={{ marginBottom: "4px", fontSize: "12px", color: "#666" }}>
                  Create new ensemble:
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Name your ensemble"
                    value={ensembleRoomName || ""}
                    onChange={(e) => setEnsembleRoomName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateEnsemble();
                      }
                    }}
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      padding: "6px 8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateEnsemble}
                    disabled={isCreatingEnsemble || !(ensembleRoomName && ensembleRoomName.trim())}
                    style={{
                      fontSize: "13px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      border: "1px solid #222",
                      background: "#222",
                      color: "#fff",
                      cursor: isCreatingEnsemble ? "default" : "pointer",
                    }}
                  >
                    {isCreatingEnsemble ? "Creating..." : "Create"}
                  </button>
                </div>
                {ensembleError && (
                  <div style={{ marginTop: "6px", color: "#b00020", fontSize: "12px" }}>
                    {ensembleError}
                  </div>
                )}
              </>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#4caf50",
                    }}
                  />
                  <span style={{ fontSize: "13px" }}>
                    Broadcasting to <strong>{ensembleRoomName}</strong>
                  </span>
                </div>
                {selectedScale && (
                  <div style={{ fontSize: "13px", marginBottom: "8px" }}>
                    Current scale: <strong>{selectedScale}</strong>
                  </div>
                )}
                <div style={{ marginTop: "8px" }}>
                  <div style={{ fontSize: "12px", marginBottom: "4px", color: "#666" }}>
                    Tempo: {ensembleBpm} BPM
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="240"
                    step="1"
                    value={ensembleBpm || 60}
                    onChange={(e) => setEnsembleBpm(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inventory: what the ensemble has on hand */}
        <div
          style={{
            flex: "1 1 320px",
            minWidth: 0,
            boxSizing: "border-box",
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            padding: "8px 12px",
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            {[
              ["harmonicas", "Harmonicas"],
              ["found", "Found instruments"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setInventoryTab(key)}
                style={{
                  fontSize: "13px",
                  fontWeight: inventoryTab === key ? 600 : 400,
                  padding: "4px 10px",
                  borderRadius: "4px",
                  border: inventoryTab === key ? "1px solid #222" : "1px solid #ddd",
                  background: inventoryTab === key ? "#f0f7ff" : "#fafafa",
                  color: "#111",
                  cursor: "pointer",
                }}
              >
                {label}
                {key === "found" && inventory.found.length > 0
                  ? ` (${inventory.found.length})`
                  : ""}
              </button>
            ))}
          </div>

          {inventoryTab === "harmonicas" ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              justifyContent: "center",
            }}
          >
            {NOTE_NAMES.map((name, root) => {
              const count = inventory.harmonicas[root];
              return (
                <div
                  key={root}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 6px",
                    borderRadius: "4px",
                    border: count ? "1px solid #222" : "1px solid #ddd",
                    background: count ? "#f0f7ff" : "#fafafa",
                    opacity: count ? 1 : 0.55,
                    fontSize: "13px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => adjustInventory(root, -1)}
                    disabled={count === 0}
                    aria-label={`Remove a ${name} harmonica`}
                    style={{
                      width: 20,
                      height: 20,
                      lineHeight: 1,
                      border: "none",
                      borderRadius: "3px",
                      background: "transparent",
                      cursor: count === 0 ? "default" : "pointer",
                      color: count === 0 ? "#bbb" : "#333",
                    }}
                  >
                    −
                  </button>
                  <span style={{ minWidth: "3ch", textAlign: "center", fontWeight: 600 }}>
                    {name}
                    {count > 1 ? `×${count}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustInventory(root, 1)}
                    aria-label={`Add a ${name} harmonica`}
                    style={{
                      width: 20,
                      height: 20,
                      lineHeight: 1,
                      border: "none",
                      borderRadius: "3px",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#333",
                    }}
                  >
                    +
                  </button>
                </div>
              );
            })}
          </div>
          ) : (
            <div>
              {/* Quick-add: name + pitch (+ optional second pitch) */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="e.g. brass bell"
                  value={foundName}
                  onChange={(e) => setFoundName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFound();
                    }
                  }}
                  style={{
                    flex: 1,
                    minWidth: 120,
                    fontSize: "13px",
                    padding: "5px 8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                {foundRole !== "chameleon" && (
                  <>
                    <select
                      value={foundPc}
                      onChange={(e) => setFoundPc(Number(e.target.value))}
                      aria-label="Pitch"
                      style={{ fontSize: "13px", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                      {NOTE_NAMES.map((n, pc) => (
                        <option key={pc} value={pc}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <select
                      value={foundPc2}
                      onChange={(e) => setFoundPc2(e.target.value)}
                      aria-label="Second pitch (optional)"
                      style={{ fontSize: "13px", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                      <option value="">+ pitch</option>
                      {NOTE_NAMES.map((n, pc) => (
                        <option key={pc} value={pc}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <select
                  value={foundRole}
                  onChange={(e) => setFoundRole(e.target.value)}
                  aria-label="Role"
                  title="voice: counts toward the threshold · anchor: always sounding, filters the network · chameleon: tunes to any scale"
                  style={{ fontSize: "13px", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="voice">voice</option>
                  <option value="anchor">anchor</option>
                  <option value="chameleon">chameleon</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddFound}
                  disabled={!foundName.trim()}
                  style={{
                    fontSize: "13px",
                    padding: "5px 12px",
                    borderRadius: "4px",
                    border: "1px solid #222",
                    background: foundName.trim() ? "#222" : "#999",
                    color: "#fff",
                    cursor: foundName.trim() ? "pointer" : "default",
                  }}
                >
                  Add
                </button>
              </div>

              {/* Template quick-add: pre-filled instruments from research */}
              <div style={{ marginTop: "6px" }}>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) handleAddTemplate(e.target.value);
                  }}
                  aria-label="Add from template"
                  style={{
                    width: "100%",
                    fontSize: "13px",
                    padding: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    color: "#666",
                  }}
                >
                  <option value="">Add from template… (bells, kalimba, handpan, hums)</option>
                  {[...new Set(TEMPLATES.map((t) => t.group))].map((group) => (
                    <optgroup key={group} label={group}>
                      {TEMPLATES.filter((t) => t.group === group).map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Found instrument list */}
              {inventory.found.length === 0 ? (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#999", textAlign: "center" }}>
                  No found instruments yet — bells, tuned drums, whistles, chimes…
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "8px",
                    justifyContent: "center",
                  }}
                >
                  {inventory.found.map((inst, i) => (
                    <span
                      key={`${inst.label}-${i}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "3px 4px 3px 8px",
                        borderRadius: "4px",
                        border: "1px solid #222",
                        background: "#f0f7ff",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{inst.label}</span>
                      <span style={{ color: "#666" }}>
                        {(inst.role || "voice") === "chameleon"
                          ? "tunable"
                          : inst.states.map((s) => s.label).join(", ")}
                      </span>
                      {(inst.role || "voice") !== "voice" && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            padding: "1px 4px",
                            borderRadius: "3px",
                            background: inst.role === "anchor" ? "#5d4037" : "#00695c",
                            color: "#fff",
                          }}
                        >
                          {inst.role}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFound(i)}
                        aria-label={`Remove ${inst.label}`}
                        style={{
                          width: 18,
                          height: 18,
                          lineHeight: 1,
                          border: "none",
                          borderRadius: "3px",
                          background: "transparent",
                          cursor: "pointer",
                          color: "#666",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Threshold: show scales playable by at least N instruments at once */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              Show scales playable by ≥ <strong style={{ color: "#111" }}>{minVoices}</strong> at once
            </span>
            <input
              type="range"
              min={2}
              max={sliderMax}
              step={1}
              value={Math.min(minVoices, sliderMax)}
              onChange={(e) => setMinVoices(Number(e.target.value))}
              disabled={sliderMax <= 2}
              aria-label="Minimum simultaneous instruments"
              style={{ flex: 1 }}
            />
          </div>
        </div>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap",
          fontSize: "12px",
          marginBottom: "4px",
          flexShrink: 0,
        }}
      >
        {Object.keys(byCount)
          .map(Number)
          .sort((a, b) => b - a)
          .map((count) => (
            <span key={count} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: colorFor(count),
                  border: "1px solid #000",
                  display: "inline-block",
                }}
              />
              {count} instruments at once ({byCount[count].length} scales)
            </span>
          ))}
      </div>

      {/* Selected scale: full instrument list (node subtitles cap at 4 lines) */}
      {selectedScale && nodes[selectedScale] && (
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            marginBottom: "4px",
            flexShrink: 0,
            color: "#333",
          }}
        >
          <strong>{selectedScale}</strong>
          {" — "}
          {nodes[selectedScale].details
            .map((d) => `${d.label}: ${d.states.join("+")}`)
            .join("  ·  ")}
        </div>
      )}

      {/* Network */}
      {Object.keys(nodes).length === 0 && (
        <div style={{ textAlign: "center", color: "#999", fontSize: "14px", padding: "32px 0" }}>
          No scale supports {minVoices} instruments at once with this inventory —
          add more instruments above or lower the threshold.
          {inventory.found.some((inst) => inst.role === "anchor") &&
            " Anchors also hide every scale they don't fit."}
        </div>
      )}
      {/* The SVG fills whatever vertical space remains, letterboxing the
          network inside it so the whole page always fits one screen. */}
      <svg
        viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "block",
        }}
      >
        {/* Edges */}
        {edges.map(([a, b]) => (
          <line
            key={`${a}|${b}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="gray"
            strokeWidth={1.5}
            opacity={0.2}
          />
        ))}

        {/* Nodes */}
        {Object.values(nodes).map((node) => {
          const isSelected = node.name === selectedScale;
          // Subtitles cap at 4 lines; overflow collapses into "+N more"
          // (the selected scale shows its full list in the strip above).
          const MAX_LINES = 4;
          const overflowing = node.details.length > MAX_LINES;
          const shownDetails = overflowing
            ? node.details.slice(0, MAX_LINES - 1)
            : node.details;
          const hiddenCount = node.details.length - shownDetails.length;
          return (
            <g
              key={node.name}
              onClick={() => setSelectedScale(node.name)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={colorFor(node.count)}
                fillOpacity={0.9}
                stroke="black"
                strokeWidth={isSelected ? 5 : 1.5}
              />
              {/* Scale name above node */}
              <text
                x={node.x}
                y={node.y - node.r - 10}
                textAnchor="middle"
                fontSize={15}
                fontWeight="bold"
                fill="#111"
                stroke="#fafafa"
                strokeWidth={4}
                paintOrder="stroke"
              >
                {node.name}
              </text>
              {/* Instrument details below node: one line per instrument group,
                  states color-coded (OUT/IN match the performer interface) */}
              {shownDetails.map((d, i) => (
                <text
                  key={`${d.label}-${i}`}
                  x={node.x}
                  y={node.y + node.r + 16 + i * 15}
                  textAnchor="middle"
                  fontSize={12}
                  stroke="#fafafa"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  <tspan fill="#888">•</tspan>
                  <tspan fill="#111" fontWeight={700}>
                    {"\u00A0"}{d.label}
                  </tspan>
                  {d.states.map((s, j) => (
                    <tspan
                      key={`${s}-${j}`}
                      fill={s === "OUT" ? "#4caf50" : s === "IN" ? "#2196f3" : "#555"}
                      fontWeight={600}
                    >
                      {"\u00A0"}{s}
                    </tspan>
                  ))}
                </text>
              ))}
              {overflowing && (
                <text
                  x={node.x}
                  y={node.y + node.r + 16 + shownDetails.length * 15}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#888"
                  fontStyle="italic"
                  stroke="#fafafa"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  +{hiddenCount} more
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
