import React from "react";
import { useNavigate } from "react-router-dom";
import materialsData from "../Data/knowledge_visual.json";

/* ── Helpers (كما هي في كودك الأصلي) ── */
const getStateBorderColor = (state) => {
  switch (state) {
    case "solid": return "#333333";
    case "liquid": return "#2196F3";
    case "gas": return "#4CAF50";
    default: return "#999999";
  }
};

const getStateTextColor = (state) => {
  switch (state) {
    case "solid": return "#333333";
    case "liquid": return "#1976D2";
    case "gas": return "#2E7D32";
    default: return "#666666";
  }
};

const getStateName = (state) => {
  switch (state) {
    case "solid": return "صلب";
    case "liquid": return "سائل";
    case "gas": return "غاز";
    default: return state;
  }
};

const getToxicIcon = (toxicity) => toxicity === "high" ? "☠️" : "🧪";

/* ── Component المعدل ── */
const LeftSidebar = ({ aiResult }) => { // تأكدي من تمرير aiResult كـ prop من صفحة LabScene
  const navigate = useNavigate();

  const onDragStart = (event, key, data) => {
    const dragData = {
      name: key,
      state: data.state,
      color: data.color,
      toxicity: data.toxicity,
    };
    event.dataTransfer.setData("application/json", JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="left-sidebar" style={{
      width: "280px",
      height: "100%",
      backgroundColor: "#f5f5f5",
      borderRight: "2px solid #ddd",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      overflowY: "auto",
    }}>
      
      {/* تغيير العنوان بناءً على وجود نتيجة */}
      <h3 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        {aiResult ? "ملخص التجربة" : "المواد المتاحة"}
      </h3>

      {aiResult ? (
        /* ── هذا الجزء سيظهر فقط عند وجود ناتج تفاعل ── */
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          padding: "15px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          border: "1px solid #00d4ff",
          boxShadow: "0 4px 12px rgba(0,212,255,0.1)"
        }}>
          <div style={{ textAlign: "center", fontSize: "40px" }}>📝</div>
          <p style={{ textAlign: "center", fontSize: "14px", color: "#555", fontWeight: "500" }}>
            تم تسجيل التجربة في السجل الخاص بك بنجاح.
          </p>
          
          <button
            onClick={() => navigate("/experiment-history")}
            style={{
              padding: "12px",
              backgroundColor: "#00d4ff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
              boxShadow: "0 4px 10px rgba(0,212,255,0.2)"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#00b8e6"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#00d4ff"}
          >
            📋 فتح سجل التجارب
          </button>
        </div>
      ) : (
        /* ── هذا الجزء يظهر في الحالة العادية (قائمة المواد) ── */
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}>
          {Object.keys(materialsData).map((key) => {
            const data = materialsData[key];
            const state = data.state;
            const toxicity = data.toxicity;

            return (
              <div
                key={key}
                draggable
                onDragStart={(e) => onDragStart(e, key, data)}
                style={{
                  padding: "12px",
                  backgroundColor: "#fff",
                  border: `2px solid ${getStateBorderColor(state)}`,
                  borderRadius: "10px",
                  cursor: "grab",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "14px", color: "#000" }}>
                  {key} {getToxicIcon(toxicity)}
                </span>
                <span style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  color: getStateTextColor(state),
                  backgroundColor: "rgba(0,0,0,0.05)",
                  padding: "2px 6px",
                  borderRadius: "12px",
                }}>
                  {getStateName(state)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* تنبيه بسيط يختفي أيضاً عند ظهور النتيجة */}
      {!aiResult && (
        <div style={{
          marginTop: "auto",
          padding: "10px",
          fontSize: "12px",
          color: "#888",
          textAlign: "center"
        }}>
          💡 اسحب المواد للبدء
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;