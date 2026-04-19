import React, { useEffect, useState } from "react";

/**
 * PageLoader — يُستخدم في كل صفحة
 * يظهر شاشة دخول أنيميشن قبل المحتوى
 *
 * Usage:
 *   import PageLoader from "../Components/PageLoader";
 *   // في أول الكمبوننت:
 *   return <PageLoader>  <...your page content...> </PageLoader>
 */
export default function PageLoader({ children, accent = "#00d4ff", label = "" }) {
  const [stage, setStage] = useState("enter"); // enter → show → done

  useEffect(() => {
    // المرحلة 1: الـ loader يظهر (600ms)
    const t1 = setTimeout(() => setStage("show"),  600);
    // المرحلة 2: الـ loader يختفي (1400ms total)
    const t2 = setTimeout(() => setStage("done"), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {/* ── Page content (always mounted, revealed after loader) ── */}
      <div
        style={{
          opacity:    stage === "done" ? 1 : 0,
          transform:  stage === "done" ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s",
          minHeight:  "100%",
        }}
      >
        {children}
      </div>

      {/* ── Loader overlay ── */}
      {stage !== "done" && (
        <div
          style={{
            position:   "fixed",
            inset:      0,
            zIndex:     9999,
            display:    "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap:        20,
            background: "#060818",
            opacity:    stage === "show" ? 0 : 1,
            transition: "opacity 0.5s ease",
            pointerEvents: stage === "show" ? "none" : "auto",
          }}
        >
          {/* Animated beaker / atom */}
          <div style={{ position: "relative", width: 72, height: 72 }}>
            {/* Outer ring */}
            <div style={{
              position: "absolute", inset: 0,
              border:   `2px solid ${accent}33`,
              borderTop: `2px solid ${accent}`,
              borderRadius: "50%",
              animation: "loaderSpin 1s linear infinite",
            }} />
            {/* Inner ring */}
            <div style={{
              position: "absolute", inset: 12,
              border:   `2px solid ${accent}22`,
              borderBottom: `2px solid ${accent}88`,
              borderRadius: "50%",
              animation: "loaderSpin 0.7s linear infinite reverse",
            }} />
            {/* Center dot */}
            <div style={{
              position: "absolute", inset: "50%",
              width: 10, height: 10,
              transform: "translate(-50%,-50%)",
              background: accent,
              borderRadius: "50%",
              boxShadow: `0 0 14px ${accent}`,
              animation: "loaderPulse 1s ease-in-out infinite",
            }} />
          </div>

          {/* Logo / label */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 22, fontWeight: 800, letterSpacing: "0.06em",
              background: `linear-gradient(135deg, #fff, ${accent})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontFamily: "'Segoe UI', system-ui, sans-serif",
            }}>
              ⚗️ Simuscience
            </div>
            {label && (
              <div style={{ fontSize: 12, color: "#88aacc", marginTop: 4, letterSpacing: "0.08em" }}>
                {label}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div style={{
            width: 160, height: 3,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 3,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              animation: "loaderBar 1.2s ease-in-out infinite",
            }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes loaderSpin   { to { transform: rotate(360deg); } }
        @keyframes loaderPulse  { 0%,100% { opacity:1; transform:translate(-50%,-50%) scale(1); } 50% { opacity:0.5; transform:translate(-50%,-50%) scale(1.3); } }
        @keyframes loaderBar    { 0% { transform:translateX(-100%); } 100% { transform:translateX(250%); } }
      `}</style>
    </>
  );
}
