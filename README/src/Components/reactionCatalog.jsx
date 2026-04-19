import { useState, useMemo } from "react";
import reactionData from "../Data/csvjson (1).json";

const STATE_LABELS = {
  solid: "Solid",
  liquid: "Liquid",
  gas: "Gas",
  aqueous: "Aqueous",
};

const CONDITION_LABELS = {
  "room temperature": "Room Temp",
  "heated gently": "Heated Gently",
  "heated strongly": "Heated Strongly",
  "pressure applied": "Pressure Applied",
  "requires catalyst": "Catalyst Required",
  "spark or heat": "Spark / Heat",
};

const OBSERVATION_LABELS = {
  "no visible change": "No visible change",
  "heat released": "Heat released",
  "gas evolved": "Gas evolved",
  "white solid formed": "White solid formed",
  "color change observed": "Color change observed",
  "heat released, water formed": "Heat released + water formed",
};

function getSafetyInfo(safety) {
  if (
    safety.includes("highly reactive") ||
    safety.includes("toxic") ||
    safety.includes("flammable")
  )
    return { label: "High Risk", color: "#fee2e2", text: "#991b1b", border: "#fca5a5" };
  if (safety.includes("irritant") || safety.includes("reactive with water"))
    return { label: "Caution", color: "#fef3c7", text: "#92400e", border: "#fcd34d" };
  return { label: "Low Hazard", color: "#d1fae5", text: "#065f46", border: "#6ee7b7" };
}

function Pill({ label, bg, text, border }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 99,
        background: bg,
        color: text,
        border: `0.5px solid ${border}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export default function ReactionCatalog() {
  const [query, setQuery] = useState("");
  const [condition, setCondition] = useState("");
  const [productState, setProductState] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return reactionData.filter((d) => {
      const matchQ =
        !q ||
        d.reactants?.toLowerCase().includes(q) ||
        d.products?.toLowerCase().includes(q) ||
        d.equation?.toLowerCase().includes(q);
      const matchC = !condition || d.conditions === condition;
      const matchP = !productState || d.products_state === productState;
      return matchQ && matchC && matchP;
    });
  }, [query, condition, productState]);

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: 960, margin: "0 auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: "1rem", color: "#111" }}>
        Reaction Catalog
      </h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reactant or product..."
          style={{
            flex: 1,
            minWidth: 160,
            padding: "7px 10px",
            borderRadius: 8,
            border: "0.5px solid #d1d5db",
            fontSize: 13,
          }}
        />
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          style={{ padding: "7px 10px", borderRadius: 8, border: "0.5px solid #d1d5db", fontSize: 13 }}
        >
          <option value="">All Conditions</option>
          {Object.keys(CONDITION_LABELS).map((c) => (
            <option key={c} value={c}>{CONDITION_LABELS[c]}</option>
          ))}
        </select>
        <select
          value={productState}
          onChange={(e) => setProductState(e.target.value)}
          style={{ padding: "7px 10px", borderRadius: 8, border: "0.5px solid #d1d5db", fontSize: 13 }}
        >
          <option value="">All Product States</option>
          {Object.keys(STATE_LABELS).map((s) => (
            <option key={s} value={s}>{STATE_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: "0.75rem" }}>
        {filtered.length} reaction{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["Equation", "Product State", "Conditions", "Observation", "Safety"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "8px 10px",
                    fontWeight: 500,
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                  No results found
                </td>
              </tr>
            ) : (
              filtered.map((d, i) => {
                const safety = getSafetyInfo(d.safety || "");
                return (
                  <tr
                    key={i}
                    style={{ borderBottom: "0.5px solid #f3f4f6" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    <td style={{ padding: "9px 10px", fontFamily: "monospace", fontWeight: 500 }}>
                      {d.equation}
                    </td>
                    <td style={{ padding: "9px 10px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: d.product_color || "#ccc",
                          border: "0.5px solid #d1d5db",
                          marginRight: 6,
                          verticalAlign: "middle",
                        }}
                      />
                      <Pill
                        label={STATE_LABELS[d.products_state] || d.products_state}
                        bg="#f3f4f6"
                        text="#374151"
                        border="#e5e7eb"
                      />
                    </td>
                    <td style={{ padding: "9px 10px" }}>
                      <Pill
                        label={CONDITION_LABELS[d.conditions] || d.conditions}
                        bg="#eff6ff"
                        text="#1d4ed8"
                        border="#bfdbfe"
                      />
                    </td>
                    <td style={{ padding: "9px 10px", color: "#6b7280", fontSize: 12 }}>
                      {OBSERVATION_LABELS[d.observation] || d.observation}
                    </td>
                    <td style={{ padding: "9px 10px" }}>
                      <Pill
                        label={safety.label}
                        bg={safety.color}
                        text={safety.text}
                        border={safety.border}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}