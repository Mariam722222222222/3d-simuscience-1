import React from "react";
import materialsData from "../Data/knowledge_visual.json";

/* =========================
   HELPERS
========================= */
const getStateBorderColor = (state) => {
  switch (state) {
    case "solid":
      return "#333333";
    case "liquid":
      return "#2196F3";
    case "gas":
      return "#4CAF50";
    default:
      return "#999999";
  }
};

const getStateTextColor = (state) => {
  switch (state) {
    case "solid":
      return "#333333";
    case "liquid":
      return "#1976D2";
    case "gas":
      return "#2E7D32";
    default:
      return "#666666";
  }
};

const getStateName = (state) => {
  switch (state) {
    case "solid":
      return "صلب";
    case "liquid":
      return "سائل";
    case "gas":
      return "غاز";
    default:
      return state;
  }
};

const getToxicIcon = (toxicity) => {
  return toxicity === "high" ? "☠️" : "🧪";
};

/* =========================
   COMPONENT
========================= */
const LeftSidebar = () => {
  const onDragStart = (event, key, data) => {
    const dragData = {
      name: key,
      state: data.state,
      color: data.color,
      toxicity: data.toxicity,
    };

    event.dataTransfer.setData(
      "application/json",
      JSON.stringify(dragData)
    );

    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      className="left-sidebar"
      style={{
        width: "220px",
        backgroundColor: "#f5f5f5",
        padding: "15px",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
        height: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <h3
        style={{
          color: "#333",
          marginBottom: "15px",
          fontSize: "18px",
          borderBottom: "2px solid #ddd",
          paddingBottom: "8px",
        }}
      >
        🔬 المواد الكيميائية
      </h3>

      <div className="materials-list">
        {Object.entries(materialsData).map(([key, data]) => {
          const state = data.state;
          const toxicity = data.toxicity;

          return (
            <div
              key={key}
              draggable
              onDragStart={(e) => onDragStart(e, key, data)}
              style={{
                backgroundColor: data.color || "#e0e0e0",
                border: `2px solid ${getStateBorderColor(state)}`,
                borderRadius: "8px",
                padding: "8px 12px",
                marginBottom: "8px",
                cursor: "grab",
                transition: "all 0.2s ease",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              {/* اسم المادة + emoji السمية */}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#000",
                }}
              >
                {key} {getToxicIcon(toxicity)}
              </span>

              {/* الحالة */}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: getStateTextColor(state),
                  backgroundColor: "rgba(255,255,255,0.7)",
                  padding: "2px 6px",
                  borderRadius: "12px",
                }}
              >
                {getStateName(state)}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#e8e8e8",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#555",
          textAlign: "center",
        }}
      >
        💡 اسحب المادة إلى البيكر
      </div>
    </div>
  );
};

export default LeftSidebar;