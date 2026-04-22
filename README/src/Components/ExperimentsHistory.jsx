// import React from "react";
// import { useNavigate } from "react-router-dom";

// const ExperimentsHistory = () => {
//   const navigate = useNavigate();

//   const mockExperiments = [
//     {
//       id: 1,
//       title: "تفاعل الصوديوم مع الكلور",
//       equation: "Na + Cl₂ → NaCl",
//       reactants: "Na , Cl₂",
//       product: "NaCl (ملح الطعام)",
//       safety: "gas evolved",
//       type: "Combination",
//       date: "20 أبريل 2026",
//       time: "1:13 صباحاً",
//       result: "NaCl صلب",
//       status: "success",
//     },
//     {
//       id: 2,
//       title: "تفاعل أكسدة الماغنيسيوم",
//       equation: "2Mg + O₂ → 2MgO",
//       reactants: "Mg , O₂",
//       product: "MgO",
//       safety: "bright flame",
//       type: "Combustion",
//       date: "19 أبريل 2026",
//       time: "11:45 مساءً",
//       result: "MgO أبيض",
//       status: "success",
//     },
//     {
//       id: 3,
//       title: "تفاعل الحديد مع الأكسجين",
//       equation: "4Fe + 3O₂ → 2Fe₂O₃",
//       reactants: "Fe , O₂",
//       product: "Fe₂O₃",
//       safety: "slow reaction",
//       type: "Oxidation",
//       date: "19 أبريل 2026",
//       time: "10:20 مساءً",
//       result: "Fe₂O₃ أحمر",
//       status: "success",
//     },
//     {
//       id: 4,
//       title: "تحليل الماء كهربائياً",
//       equation: "2H₂O → 2H₂ + O₂",
//       reactants: "H₂O",
//       product: "H₂ , O₂",
//       safety: "flammable gas",
//       type: "Electrolysis",
//       date: "18 أبريل 2026",
//       time: "9:00 مساءً",
//       result: "H₂ + O₂ غاز",
//       status: "warn",
//     },
//   ];

//   return (
//     <div style={containerStyle}>
//       <style>{`
//         .hist-card {
//           background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(0,212,255,0.2);
//           border-radius: 15px;
//           padding: 20px;
//           margin-bottom: 15px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           transition: 0.3s;
//         }
//         .hist-card:hover {
//           background: rgba(0,212,255,0.05);
//           border-color: #00d4ff;
//           transform: translateY(-3px);
//         }
//         .badge {
//           display: inline-block;
//           padding: 3px 10px;
//           border-radius: 20px;
//           font-size: 11px;
//           font-weight: bold;
//           margin-top: 6px;
//         }
//         .badge-success { background: rgba(0,255,136,0.15); color: #00ff88; }
//         .badge-warn    { background: rgba(255,200,0,0.15);  color: #ffc800; }
//       `}</style>

//       {/* Header */}
//       <div style={headerStyle}>
//         <h2 style={{ color: "#00d4ff", margin: 0, fontSize: "22px" }}>
//           🧪 سجل التجارب المعملية
//         </h2>
//         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//           <div style={userBadgeStyle}>👤 Ahmed Mohamed</div>
//           <button onClick={() => navigate("/")} style={btnSecondary}>
//             العودة للمختبر
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div style={statsGrid}>
//         <div style={statCard("#00d4ff")}>
//           <div style={statNum("#00d4ff")}>4</div>
//           <div style={statLabel}>إجمالي التجارب</div>
//         </div>
//         <div style={statCard("#00ff88")}>
//           <div style={statNum("#00ff88")}>3</div>
//           <div style={statLabel}>تجارب ناجحة</div>
//         </div>
//         <div style={statCard("#7b61ff")}>
//           <div style={statNum("#7b61ff")}>2</div>
//           <div style={statLabel}>أنواع التفاعلات</div>
//         </div>
//         <div style={statCard("#ffc800")}>
//           <div style={statNum("#ffc800")}>20/4</div>
//           <div style={statLabel}>آخر جلسة</div>
//         </div>
//       </div>

//       {/* Cards */}
//       <div style={{ marginTop: "10px" }}>
//         {mockExperiments.map((exp) => (
//           <div key={exp.id} className="hist-card">
//             <div style={{ flex: 1 }}>
//               <h3 style={{ color: "#fff", margin: "0 0 4px 0", fontSize: "1.1rem" }}>
//                 {exp.title}
//               </h3>
//               <code style={{ color: "#7b61ff", fontSize: "0.85rem" }}>
//                 {exp.equation}
//               </code>
//               <div style={{ marginTop: "8px", fontSize: "12px", color: "#88aacc" }}>
//                 المواد المتفاعلة: {exp.reactants} &nbsp;|&nbsp; الناتج: {exp.product}
//               </div>
//               <div style={{ marginTop: "4px", fontSize: "12px", color: "#88aacc" }}>
//                 السلامة: {exp.safety} &nbsp;|&nbsp; نوع التفاعل: {exp.type}
//               </div>
//               <span className={`badge badge-${exp.status}`}>
//                 {exp.status === "success" ? "ناجحة ✓" : "غير مكتملة ⚠"}
//               </span>
//             </div>
//             <div style={{ textAlign: "left", minWidth: "120px" }}>
//               <div style={{ color: "#88aacc", fontSize: "11px" }}>{exp.date}</div>
//               <div style={{ color: "#88aacc", fontSize: "11px" }}>{exp.time}</div>
//               <div style={{
//                 color: exp.status === "success" ? "#00ff88" : "#ffc800",
//                 fontWeight: "bold",
//                 marginTop: "8px",
//                 fontSize: "13px",
//               }}>
//                 {exp.result}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const containerStyle = {
//   minHeight: "100vh",
//   background: "#060818",
//   padding: "40px 8%",
//   color: "#e0f4ff",
//   direction: "rtl",
//   fontFamily: "sans-serif",
// };

// const headerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   borderBottom: "1px solid rgba(255,255,255,0.1)",
//   paddingBottom: "20px",
//   marginBottom: "10px",
// };

// const userBadgeStyle = {
//   background: "rgba(0,212,255,0.1)",
//   border: "1px solid rgba(0,212,255,0.3)",
//   borderRadius: "20px",
//   padding: "6px 16px",
//   fontSize: "13px",
//   color: "#00d4ff",
// };

// const statsGrid = {
//   display: "flex",
//   gap: "16px",
//   margin: "24px 0",
// };

// const statCard = (color) => ({
//   background: `rgba(${hexToRgb(color)},0.08)`,
//   border: `1px solid rgba(${hexToRgb(color)},0.2)`,
//   borderRadius: "12px",
//   padding: "16px 24px",
//   textAlign: "center",
//   flex: 1,
// });

// const statNum = (color) => ({
//   fontSize: "28px",
//   fontWeight: "bold",
//   color,
// });

// const statLabel = {
//   fontSize: "12px",
//   color: "#88aacc",
//   marginTop: "4px",
// };

// const btnSecondary = {
//   padding: "10px 20px",
//   borderRadius: "10px",
//   border: "1px solid #00d4ff",
//   background: "transparent",
//   color: "#00d4ff",
//   cursor: "pointer",
//   fontWeight: "bold",
// };

// function hexToRgb(hex) {
//   const r = parseInt(hex.slice(1, 3), 16);
//   const g = parseInt(hex.slice(3, 5), 16);
//   const b = parseInt(hex.slice(5, 7), 16);
//   return `${r},${g},${b}`;
// }

// export default ExperimentsHistory;

import React from "react";
import { useNavigate } from "react-router-dom";

const ExperimentsHistory = () => {
  const navigate = useNavigate();

  const mockExperiments = [
    {
      id: 1,
      title: "Sodium + Chlorine Reaction",
      equation: "Na + Cl₂ → NaCl",
      reactants: "Na + Cl₂",
      product: "NaCl (Table Salt) - Solid",
      safety: "Gas Evolved",
      type: "Combination",
      date: "April 20, 2026",
      time: "1:13 AM",
      result: "NaCl Solid ✓",
      status: "success",
    },
  ];

  return (
    <div style={containerStyle}>
      <style>{`
        .hist-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 15px;
          padding: 24px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: 0.3s;
        }
        .hist-card:hover {
          background: rgba(0,212,255,0.05);
          border-color: #00d4ff;
          transform: translateY(-3px);
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-top: 8px;
        }
        .badge-success {
          background: rgba(0,255,136,0.15);
          color: #00ff88;
        }
      `}</style>

      {/* Header */}
      <div style={headerStyle}>
        <h2 style={{ color: "#00d4ff", margin: 0, fontSize: "22px" }}>
          🧪 Experiment History
        </h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={userBadgeStyle}>👤 Rahma gamal</div>
          <button onClick={() => navigate("/LabScene")} style={btnSecondary}>
            Back to Lab
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={statsGrid}>
        <div style={statCard("#00d4ff")}>
          <div style={statNum("#00d4ff")}>1</div>
          <div style={statLabel}>Total Experiments</div>
        </div>
        <div style={statCard("#00ff88")}>
          <div style={statNum("#00ff88")}>1</div>
          <div style={statLabel}>Successful</div>
        </div>
        <div style={statCard("#7b61ff")}>
          <div style={statNum("#7b61ff")}>1</div>
          <div style={statLabel}>Reaction Types</div>
        </div>
        <div style={statCard("#ffc800")}>
          <div style={statNum("#ffc800")}>20/4</div>
          <div style={statLabel}>Last Session</div>
        </div>
      </div>

      {/* Experiment Card */}
      <div style={{ marginTop: "10px" }}>
        {mockExperiments.map((exp) => (
          <div key={exp.id} className="hist-card">
            <div style={{ flex: 1 }}>

              <h3 style={{ color: "#fff", margin: "0 0 8px 0", fontSize: "1.2rem" }}>
                {exp.title}
              </h3>

              {/* Equation Box */}
              <div style={equationBox}>
                <span style={{ color: "#88aacc", fontSize: "13px" }}>Equation: </span>
                <code style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "1px" }}>
                  {exp.equation}
                </code>
              </div>

              <div style={infoGrid}>
                <div style={infoItem}>
                  <span style={infoLabel}>Reactants</span>
                  <span style={infoValue}>{exp.reactants}</span>
                </div>
                <div style={infoItem}>
                  <span style={infoLabel}>Product</span>
                  <span style={infoValue}>{exp.product}</span>
                </div>
                <div style={infoItem}>
                  <span style={infoLabel}>Reaction Type</span>
                  <span style={infoValue}>{exp.type}</span>
                </div>
                <div style={infoItem}>
                  <span style={infoLabel}>Safety Note</span>
                  <span style={{ ...infoValue, color: "#ffc800" }}>{exp.safety}</span>
                </div>
              </div>

              <span className="badge badge-success">
                Successful ✓
              </span>
            </div>

            <div style={{ textAlign: "right", minWidth: "130px", paddingLeft: "20px" }}>
              <div style={{ color: "#88aacc", fontSize: "12px" }}>📅 {exp.date}</div>
              <div style={{ color: "#88aacc", fontSize: "12px", marginTop: "4px" }}>🕐 {exp.time}</div>
              <div style={{
                color: "#00ff88",
                fontWeight: "bold",
                marginTop: "12px",
                fontSize: "14px",
                background: "rgba(0,255,136,0.08)",
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(0,255,136,0.2)"
              }}>
                Result: {exp.result}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: "100vh",
  background: "#060818",
  padding: "40px 8%",
  color: "#e0f4ff",
  fontFamily: "sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  paddingBottom: "20px",
  marginBottom: "10px",
};

const userBadgeStyle = {
  background: "rgba(0,212,255,0.1)",
  border: "1px solid rgba(0,212,255,0.3)",
  borderRadius: "20px",
  padding: "6px 16px",
  fontSize: "13px",
  color: "#00d4ff",
};

const statsGrid = {
  display: "flex",
  gap: "16px",
  margin: "24px 0",
};

const statCard = (color) => ({
  background: `rgba(${hexToRgb(color)},0.08)`,
  border: `1px solid rgba(${hexToRgb(color)},0.2)`,
  borderRadius: "12px",
  padding: "16px 24px",
  textAlign: "center",
  flex: 1,
});

const statNum = (color) => ({
  fontSize: "28px",
  fontWeight: "bold",
  color,
});

const statLabel = {
  fontSize: "12px",
  color: "#88aacc",
  marginTop: "4px",
};

const equationBox = {
  background: "rgba(123,97,255,0.1)",
  border: "1px solid rgba(123,97,255,0.3)",
  borderRadius: "10px",
  padding: "10px 16px",
  marginBottom: "14px",
  display: "inline-block",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginBottom: "8px",
};

const infoItem = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const infoLabel = {
  fontSize: "11px",
  color: "#88aacc",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const infoValue = {
  fontSize: "14px",
  color: "#e0f4ff",
  fontWeight: "500",
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

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default ExperimentsHistory;