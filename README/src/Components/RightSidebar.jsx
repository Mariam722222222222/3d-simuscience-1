import React from "react";
import { useNavigate } from "react-router-dom";

const RightSidebar = ({
  reactions,
  selectedReaction,
  reactionStarted,
  aiResult,
  onReactionChange,
  onStartReaction,
  onReset,
}) => {
  const navigate = useNavigate();
  const canStart = selectedReaction && !reactionStarted;

  return (
    <div className="rs-root">

      {/* ── Header ── */}
      <div className="rs-header">
        <h2 className="rs-title">⚗️ Reaction Lab</h2>
        <p className="rs-subtitle">Configure & run your experiment</p>
      </div>

      {/* ── Conditions ── */}
      <div className="rs-section">
        <label className="rs-label">Reaction Conditions</label>
        {reactions.length === 0 ? (
          <div className="rs-empty-box">Add ≥ 2 reactants to the beaker first</div>
        ) : (
          <select
            className="rs-select"
            value={selectedReaction ? reactions.indexOf(selectedReaction) : ""}
            onChange={(e) => {
              const idx = parseInt(e.target.value);
              if (!isNaN(idx)) onReactionChange(reactions[idx]);
            }}
          >
            <option value="">— Select condition —</option>
            {reactions.map((r, i) => (
              <option key={i} value={i}>{r.conditions?.trim()}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── Preview (before reaction) ── */}
      {selectedReaction && !reactionStarted && (
        <div className="rs-reaction-preview">
          <div className="rs-equation">{selectedReaction.equation}</div>
          <div className="rs-meta">
            <span className="rs-meta-item">🧪 {selectedReaction.reaction_type}</span>
            <span className="rs-meta-item">⚙️ {selectedReaction.conditions}</span>
          </div>
        </div>
      )}

      {/* ── Result (after reaction) ── */}
      {reactionStarted && aiResult && (
        <div className="rs-result">
          <div className="rs-result-header">✅ Reaction Complete</div>
          <div className="rs-result-row">
            <span className="rs-result-label">Reactants</span>
            <span className="rs-result-value">{selectedReaction?.reactants}</span>
          </div>
          <div className="rs-result-row">
            <span className="rs-result-label">Products</span>
            <span className="rs-result-value highlight">{aiResult?.products}</span>
          </div>
          {(aiResult?.observation || selectedReaction?.observation) && (
            <div className="rs-result-row">
              <span className="rs-result-label">Observation</span>
              <span className="rs-result-value">
                {aiResult?.observation || selectedReaction?.observation}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Safety ── */}
      {selectedReaction?.safety && (
        <div className="rs-safety">
          <span className="rs-safety-icon">⚠️</span>
          <span>{selectedReaction.safety}</span>
        </div>
      )}

      {/* ── Actions — ALWAYS VISIBLE ── */}
      <div className="rs-actions">
        <button
          className={`rs-btn rs-btn-primary ${!canStart ? "disabled" : ""}`}
          onClick={onStartReaction}
          disabled={!canStart}
        >
          {reactionStarted ? "⚗️ Reaction Running" : "▶ Start Reaction"}
        </button>

        <button className="rs-btn rs-btn-secondary" onClick={onReset}>
          ↺ Reset Lab
        </button>

        <div className="rs-divider" />

        {/* ↓ هذي الأزرار دايما ظاهرة مش بتختفي */}
        <button
          className="rs-btn rs-btn-ghost"
          onClick={() => navigate("/ExperimentsHistory")}
        >
          📋 Experiment History
        </button>

        <button
          className="rs-btn rs-btn-ghost"
          onClick={() => navigate("/catalog")}
        >
          📚 Reaction Catalog
        </button>
      </div>

    </div>
  );
};

export default RightSidebar;
