import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Beaker from "./Beaker";
import reactionsData from "../Data/csvjson (1).json";

function ChemicalBackground() {
  return (
    <group>
      <Sparkles count={150} scale={15} size={1.5} speed={0.4} color="#00d4ff" opacity={0.2} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-5, 2, -10]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#7b61ff" emissive="#7b61ff" emissiveIntensity={0.5} transparent opacity={0.3} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[6, -3, -8]}>
          <octahedronGeometry args={[1.5]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} transparent opacity={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

export default function LabScene() {
  const [placedMaterials, setPlacedMaterials] = useState([]);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [beakerBounds, setBeakerBounds] = useState(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  // 🔹 إصلاح دالة السحب والإفلات
  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;
      
      const material = JSON.parse(data);
      // إضافة ID فريد لكل مادة يتم سحبها لضمان استقرار العرض
      setPlacedMaterials((prev) => [...prev, { ...material, instanceId: Date.now() }]);
    } catch (err) {
      console.error("Error parsing dropped material:", err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // ضروري جداً للسماح بالإفلات
    e.dataTransfer.dropEffect = "move";
  };

  const matchedReactions = useMemo(() => {
    if (placedMaterials.length < 2) return [];
    const names = placedMaterials.map((m) => (m.name || "").toLowerCase().replace(/\s/g, ""));
    return reactionsData.filter((r) => {
      if (!r.reactants) return false;
      const reactants = r.reactants.split("+").map((x) => x.toLowerCase().replace(/\s/g, ""));
      return reactants.length === names.length && reactants.every((x) => names.includes(x));
    });
  }, [placedMaterials]);

  const startReaction = () => {
    if (!selectedReaction) return;
    setPhase("fade");
    setTimeout(() => { 
      setPlacedMaterials([]); 
      setResult(selectedReaction); 
      setPhase("result"); 
    }, 1600);
  };

  return (
    <div className="lab-scene-root" style={{
      position: "relative", width: "100vw", height: "100vh",
      display: "flex", overflow: "hidden",
      background: "linear-gradient(135deg, #060818 0%, #0d1b3e 50%, #0a1628 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ── Navbar ── */}
      <div className="navbar" style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000,
        height: 56,
        background: "linear-gradient(90deg, rgba(0,212,255,0.08) 0%, rgba(123,97,255,0.08) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,212,255,0.18)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #00d4ff, #7b61ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 0 20px rgba(0,212,255,0.4)",
          }}>⚗️</div>
          <span style={{ color: "#e0f4ff", fontWeight: 700, fontSize: 18 }}>Simuscience</span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setLeftOpen(!leftOpen)} style={{
            padding: "6px 16px", borderRadius: 20, cursor: "pointer",
            background: leftOpen ? "linear-gradient(135deg,#00d4ff,#7b61ff)" : "rgba(0,212,255,0.12)",
            color: "#fff", border: "1px solid rgba(0,212,255,0.3)", transition: "0.3s"
          }}>Materials</button>
          <button onClick={() => setRightOpen(!rightOpen)} style={{
            padding: "6px 16px", borderRadius: 20, cursor: "pointer",
            background: rightOpen ? "linear-gradient(135deg,#00d4ff,#7b61ff)" : "rgba(0,212,255,0.12)",
            color: "#fff", border: "1px solid rgba(0,212,255,0.3)", transition: "0.3s"
          }}>Reactions</button>
        </div>
      </div>

      {/* ── Sidebar اليسار ── */}
      <div className="sidebar-left" style={{
        position: "absolute", left: 0, top: 56, zIndex: 500,
        height: "calc(100% - 56px)", width: 280,
        background: "rgba(6,8,24,0.92)", backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(0,212,255,0.15)",
        transform: leftOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        visibility: leftOpen ? "visible" : "hidden"
      }}>
        <LeftSidebar />
      </div>

      {/* ── Canvas Container (تم تعديل الخصائص لاستقبال الـ Drop) ── */}
      <div 
        style={{ flex: 1, paddingTop: 56, position: "relative" }} 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
      >
        <Canvas camera={{ position: [0, 3, 6], fov: 45 }}>
          <ChemicalBackground />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.4} />
          <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={12} />
          <Environment preset="night" />
          <Beaker reactionStarted={phase !== "idle"} onReady={setBeakerBounds} />
          
          {/* هنا يتم إضافة المنطق الخاص برسم المواد المضافة أو الغازات الناتجة */}
        </Canvas>
      </div>

      {/* ── Sidebar اليمين ── */}
      <div className="sidebar-right" style={{
        position: "absolute", right: 0, top: 56, zIndex: 500,
        height: "calc(100% - 56px)", width: 300,
        background: "rgba(6,8,24,0.92)", backdropFilter: "blur(24px)",
        borderLeft: "1px solid rgba(0,212,255,0.15)",
        transform: rightOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: rightOpen ? "-4px 0 40px rgba(0,212,255,0.12)" : "none",
        visibility: rightOpen ? "visible" : "hidden"
      }}>
        <RightSidebar
          reactions={matchedReactions}
          selectedReaction={selectedReaction}
          reactionStarted={phase !== "idle"}
          aiResult={result}
          onReactionChange={setSelectedReaction}
          onStartReaction={startReaction}
          onReset={() => { setPlacedMaterials([]); setPhase("idle"); setResult(null); setSelectedReaction(null); }}
        />
      </div>
    </div>
  );
}