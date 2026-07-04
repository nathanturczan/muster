// src/App.jsx — login flow copied from noteschordsscales
import React from "react";
import NetworkPage from "./NetworkPage";
import { useAuth, signInWithGoogle } from "./firebase";

export default function App() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          background: "#ffffff",
          color: "#111111",
        }}
      >
        <div>Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          background: "#ffffff",
          color: "#111111",
        }}
      >
        <div
          style={{
            padding: "32px 40px",
            borderRadius: 8,
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            minWidth: 320,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 22,
              marginBottom: 8,
            }}
          >
            Muster
          </h1>
          <p
            style={{
              fontSize: 14,
              marginBottom: 16,
              color: "#555",
            }}
          >
            Sign in with your Scale Navigator account to continue.
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await signInWithGoogle();
              } catch (e) {
                // For now, it just stays on this screen.
              }
            }}
            style={{
              padding: "8px 16px",
              fontSize: 14,
              borderRadius: 4,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return <NetworkPage currentUser={user} />;
}
