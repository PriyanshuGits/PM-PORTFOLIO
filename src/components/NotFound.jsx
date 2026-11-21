
import { useState } from "react";

const trollMessages = [
  "BRO... EVEN GOOGLE CAN'T FIND THIS PAGE 💀",
  "You really thought this page existed?",
  "404: Your imagination went too far.",
  "We searched everywhere. Even under the keyboard.",
  "Plot twist: This page was never real."
];

export default function NotFound() {
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(false);

  const retry = () => {
    if (loading) return;

    setLoading(true);

    window.setTimeout(() => {
      setAttempt((prev) => (prev + 1) % trollMessages.length);
      setLoading(false);
    }, 1200);
  };

  return (
    <main className="troll-404">
      <div className="troll-scanline" />

      <div className="troll-content">
        <p className="troll-label">
          PM SYSTEM // ERROR DETECTED
        </p>

        <h1 className="troll-number">404</h1>

        <div className="troll-terminal">
          <p className="terminal-green">
            &gt; SYSTEM SCANNING...
          </p>
          <p>&gt; LOCATION: UNKNOWN</p>
          <p>&gt; PAGE STATUS: NOT FOUND</p>

          <p className="terminal-error">
            &gt; ERROR: PAGE.exe NOT RESPONDING
          </p>

          <div className="troll-message" key={attempt}>
            {loading
              ? "TRYING TO FIND YOUR PAGE..."
              : trollMessages[attempt]}
          </div>

          <div className="fake-progress">
            <div className="fake-progress-fill" />
          </div>

          <p className="terminal-small">
            {loading ? "SEARCHING..." : "SCAN COMPLETE: 99%"}
          </p>
        </div>

        <div className="troll-actions">
          <button onClick={retry} disabled={loading}>
            {loading ? "SCANNING..." : "TRY AGAIN ↻"}
          </button>

          <button
            className="troll-home"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            OKAY, TAKE ME HOME →
          </button>
        </div>

        <p className="troll-footer">
          POWERED BY PM SYSTEMS. NO PAGE WAS FOUND IN THIS PROCESS.
        </p>
      </div>
    </main>
  );
}
