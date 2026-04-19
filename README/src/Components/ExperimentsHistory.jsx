import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ExperimentsHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  // 1. قراءة البيانات من المتصفح عند تحميل الصفحة
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("experimentHistory")) || [];
    setHistory(savedHistory);
  }, []);

  // دالة لمسح السجل لو الطالب حب يبدأ من جديد
  const clearHistory = () => {
    if (window.confirm("هل تريد مسح سجل التجارب بالكامل؟")) {
      localStorage.removeItem("experimentHistory");
      setHistory([]);
    }
  };

  return (
    <div style={containerStyle}>
      <style>{`
        .history-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: 0.3s;
        }
        .history-card:hover {
          background: rgba(0, 212, 255, 0.05);
          border-color: #00d4ff;
          transform: translateY(-3px);
        }
      `}</style>

      <div style={headerStyle}>
        <h2 style={{ color: "#00d4ff", margin: 0 }}>🧪 سجل التجارب المعملية</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/")} style={btnSecondary}>
            العودة للمختبر
          </button>
          {history.length > 0 && (
            <button onClick={clearHistory} style={btnDanger}>
              مسح السجل
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        {history.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>لا توجد تجارب مسجلة حتى الآن. ابدأ بإجراء تجربة في المختبر!</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-card">
              <div>
                <h3 style={{ color: "#fff", margin: "0 0 5px 0", fontSize: "1.2rem" }}>
                  {item.title}
                </h3>
                <code style={{ color: "#7b61ff", fontSize: "0.9rem" }}>
                  {item.equation}
                </code>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#88aacc", fontSize: "12px" }}>{item.date}</div>
                <div style={{ color: "#00ff88", fontWeight: "bold", marginTop: "5px" }}>
                  النتيجة: {item.result}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── التنسيقات (Styles) ──
const containerStyle = {
  minHeight: "100vh",
  background: "#060818",
  padding: "40px 10%",
  color: "#e0f4ff",
  direction: "rtl", // عشان العناوين عربي
  fontFamily: "sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  paddingBottom: "20px",
};

const btnSecondary = {
  padding: "10px 20px",
  borderRadius: "10px",
  border: "1px solid #00d4ff",
  background: "transparent",
  color: "#00d4ff",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnDanger = {
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#ff4b2b",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "100px 0",
  color: "#88aacc",
  background: "rgba(255,255,255,0.02)",
  borderRadius: "20px",
  border: "1px dashed rgba(255,255,255,0.1)",
};

export default ExperimentsHistory;