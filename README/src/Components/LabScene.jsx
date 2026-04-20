import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Beaker from "./Beaker";
import reactionsData from "../Data/csvjson (1).json";
import materialsData from "../Data/knowledge_visual.json";

/* ================================================================ HELPERS */
function getMaterialInfo(name) { return materialsData[name] || null; }
const normalize = (x) => (x || "").toLowerCase().replace(/\s/g, "");

function getReactionColor(reaction) {
  if (!reaction) return "#88ccff";
  const c = reaction.product_color;
  if (!c) return "#88ccff";
  if (/^#[0-9a-fA-F]{6}$/.test(c.trim())) return c.trim();
  if (c.trim().toLowerCase() === "colorless") return "#c8e8ff";
  const m = c.match(/#[0-9a-fA-F]{6}/);
  return m ? m[0] : "#88ccff";
}

function getState(str) {
  const s = (str || "").toLowerCase();
  if (s.includes("gas")) return "gas";
  if (s.includes("liquid") || s.includes("aq")) return "liquid";
  return "solid";
}

/* ================================================================ LIQUID */
function buildLiquidPoints(bounds, fillFraction) {
  const { totalH, sliceRadii } = bounds;
  const SLICES = sliceRadii.length;
  const fillSlices = Math.max(2, Math.round(SLICES * fillFraction));
  const points = [new THREE.Vector2(0, 0)];
  for (let i = 0; i < fillSlices; i++) {
    const y = (i / (SLICES - 1)) * totalH;
    const r = sliceRadii[i] * 0.82;
    points.push(new THREE.Vector2(r, y));
  }
  const topY = ((fillSlices - 1) / (SLICES - 1)) * totalH;
  points.push(new THREE.Vector2(0, topY));
  return points;
}

function LiquidResult({ color, bounds, progress }) {
  const surfRef = useRef();
  const [geom, setGeom] = useState(null);
  useEffect(() => {
    if (!bounds.sliceRadii) return;
    const pts = buildLiquidPoints(bounds, 0.48 * progress);
    const g   = new THREE.LatheGeometry(pts, 48);
    g.translate(0, bounds.bottomY, 0);
    setGeom(g);
  }, [progress, bounds]);

  const surfaceY = useMemo(() => {
    if (!bounds.sliceRadii) return bounds.bottomY;
    const SLICES = bounds.sliceRadii.length;
    const idx = Math.round(SLICES * 0.48 * progress);
    return bounds.bottomY + (Math.min(idx, SLICES-1) / (SLICES-1)) * bounds.totalH;
  }, [progress, bounds]);

  const surfRadius = useMemo(() => {
    if (!bounds.sliceRadii) return 0.1;
    const SLICES = bounds.sliceRadii.length;
    const idx = Math.round(SLICES * 0.48 * progress);
    return (bounds.sliceRadii[Math.min(idx, SLICES-1)] ?? 0.1) * 0.80;
  }, [progress, bounds]);

  useFrame(({ clock }) => {
    if (!surfRef.current) return;
    const t = clock.getElapsedTime();
    const pos = surfRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, Math.sin(pos.getX(i)*16+t*4)*0.012 + Math.cos(pos.getY(i)*14+t*3)*0.012);
    }
    pos.needsUpdate = true;
    surfRef.current.geometry.computeVertexNormals();
  });

  if (!geom) return null;
  return (
    <group>
      <mesh geometry={geom} renderOrder={2}>
        <meshPhysicalMaterial color={color} transparent opacity={0.70} transmission={0.18} roughness={0.02} depthWrite={false} side={THREE.FrontSide} />
      </mesh>
      <mesh ref={surfRef} rotation={[-Math.PI/2, 0, 0]} position={[0, surfaceY, 0]} renderOrder={3}>
        <planeGeometry args={[surfRadius*2, surfRadius*2, 48, 48]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.92} roughness={0.01} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, surfaceY+0.004, 0]} renderOrder={4}>
        <circleGeometry args={[surfRadius*0.65, 40]} />
        <meshStandardMaterial color="white" transparent opacity={0.22} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ================================================================ GAS */
function GasBubble({ color, bounds, x, z, delay, size, progress }) {
  const ref = useRef();
  const { bottomY, topY } = bounds;
  const halfH = (topY - bottomY) * 0.48;
  const dur = 1.6 + Math.random() * 1.2;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() + delay) % dur;
    const prog = t / dur;
    ref.current.position.y = bottomY + 0.03 + prog * halfH * progress;
    ref.current.position.x = x + Math.sin(t*5+delay)*0.02;
    const fade = prog < 0.08 ? prog/0.08 : prog > 0.85 ? 1-(prog-0.85)/0.15 : 1;
    ref.current.material.opacity = fade * 0.70 * progress;
    ref.current.scale.setScalar((0.4 + prog*0.65) * progress);
  });
  return (
    <mesh ref={ref} position={[x, bounds.bottomY, z]} renderOrder={3}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshPhysicalMaterial color={color} transparent opacity={0.65} roughness={0.04} depthWrite={false} />
    </mesh>
  );
}

function GasResult({ color, bounds, progress }) {
  const { bottomY, topY, innerRadius } = bounds;
  const halfH = (topY - bottomY) * 0.48;
  const R = innerRadius * 0.85;
  const bubbles = useMemo(() =>
    Array.from({ length: 45 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * R * 0.88;
      return { x: Math.cos(angle)*r, z: Math.sin(angle)*r, delay: (i/45)*3.5, size: 0.016+Math.random()*0.026 };
    }), [R]
  );
  return (
    <group>
      <mesh position={[0, bottomY+halfH/2, 0]} renderOrder={2}>
        <cylinderGeometry args={[R, R, halfH*progress, 48]} />
        <meshStandardMaterial color={color} transparent opacity={0.08*progress} depthWrite={false} />
      </mesh>
      {bubbles.map((b, i) => <GasBubble key={i} color={color} bounds={bounds} x={b.x} z={b.z} delay={b.delay} size={b.size} progress={progress} />)}
    </group>
  );
}

/* ================================================================ SOLID */
function SolidCrystal({ color, position, speed, scale, progress, delay }) {
  const ref = useRef();
  const prog = useRef(0);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    prog.current = Math.min(1, Math.max(0, (progress - delay) / 0.3));
    ref.current.rotation.y = clock.getElapsedTime() * speed;
    ref.current.scale.setScalar(scale * prog.current);
    ref.current.material.opacity = 0.95 * prog.current;
  });
  return (
    <mesh ref={ref} position={position} renderOrder={3}>
      <dodecahedronGeometry args={[0.055]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.3} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function SolidResult({ color, bounds, progress }) {
  const { bottomY, topY, innerRadius } = bounds;
  const halfH = (topY - bottomY) * 0.48;
  const midY  = bottomY + halfH / 2;
  const R     = innerRadius * 0.80;
  const crystals = useMemo(() => {
    const items = [{ position: [0, midY, 0], speed: 0.7, scale: 2.6, delay: 0 }];
    for (let ring = 0; ring < 3; ring++) {
      const count = (ring + 1) * 5;
      const r = R * (0.2 + ring * 0.32);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const y = bottomY + 0.04 + Math.random() * halfH * 0.88;
        items.push({ position: [Math.cos(angle)*r, y, Math.sin(angle)*r], speed: 0.4+Math.random()*0.6, scale: 0.8+Math.random()*1.2, delay: ring*0.2+(i/count)*0.3 });
      }
    }
    return items;
  }, [midY, bottomY, halfH, R]);
  return <group>{crystals.map((c, i) => <SolidCrystal key={i} color={color} progress={progress} {...c} />)}</group>;
}

/* ================================================================ CHEMICAL BG */
function AtomOrbit({ position, speed, color, scale }) {
  const groupRef = useRef();
  const el1 = useRef(), el2 = useRef(), el3 = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (groupRef.current) { groupRef.current.rotation.y = t*0.7; groupRef.current.rotation.x = Math.sin(t*0.4)*0.5; groupRef.current.position.y = position[1] + Math.sin(t*0.3)*1.0; }
    if (el1.current) el1.current.rotation.z = t*2.2;
    if (el2.current) el2.current.rotation.z = t*1.8+2;
    if (el3.current) el3.current.rotation.z = t*1.5+4;
  });
  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh><sphereGeometry args={[0.3, 16, 16]} /><meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.3} /></mesh>
      {[el1, el2, el3].map((elRef, idx) => (
        <group key={idx} rotation={[idx*Math.PI/3, idx*Math.PI/4, 0]}>
          <group ref={elRef}>
            <mesh rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.65, 0.018, 8, 48]} /><meshStandardMaterial color={color} transparent opacity={0.20} /></mesh>
            <mesh position={[0.65, 0, 0]}><sphereGeometry args={[0.09, 12, 12]} /><meshStandardMaterial color={color} transparent opacity={0.7} emissive={color} emissiveIntensity={0.5} /></mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

function BenzeneRing({ position, speed, color, scale }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (ref.current) { ref.current.rotation.z = t; ref.current.rotation.x = Math.sin(t*0.5)*0.6; ref.current.position.y = position[1]+Math.sin(t*0.35)*1.2; }
  });
  const pts = useMemo(() => Array.from({ length: 6 }, (_, i) => { const a=(i/6)*Math.PI*2; return [Math.cos(a)*0.55, Math.sin(a)*0.55]; }), []);
  return (
    <group ref={ref} position={position} scale={scale}>
      {pts.map((p, i) => (
        <group key={i}>
          <mesh position={[p[0], p[1], 0]}><sphereGeometry args={[0.10, 10, 10]} /><meshStandardMaterial color={color} transparent opacity={0.40} emissive={color} emissiveIntensity={0.2} /></mesh>
          <mesh position={[(p[0]+pts[(i+1)%6][0])/2, (p[1]+pts[(i+1)%6][1])/2, 0]} rotation={[0,0,(Math.PI/3)*i+Math.PI/6]}><cylinderGeometry args={[0.022, 0.022, 0.55, 6]} /><meshStandardMaterial color={color} transparent opacity={0.22} /></mesh>
        </group>
      ))}
      <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[0.28, 0.022, 6, 30]} /><meshStandardMaterial color={color} transparent opacity={0.25} /></mesh>
    </group>
  );
}

function ChemicalBackground() {
  const atoms = useMemo(() => [
    { position: [-5.5, 1.0, -6],  speed: 1.4, scale: 0.55, color: "#00d4ff" },
    { position: [-4.5,-1.5, -8],  speed: 1.8, scale: 0.45, color: "#7b61ff" },
    { position: [-6.0, 3.0, -7],  speed: 1.2, scale: 0.60, color: "#00ffaa" },
    { position: [ 5.5, 1.0, -6],  speed: 1.6, scale: 0.55, color: "#f72585" },
    { position: [ 4.5,-1.5, -8],  speed: 1.3, scale: 0.48, color: "#48cae4" },
    { position: [ 6.5, 3.0, -7],  speed: 1.9, scale: 0.52, color: "#7b61ff" },
    { position: [-1.5, 5.0, -8],  speed: 1.5, scale: 0.50, color: "#ffaa44" },
    { position: [ 1.5, 5.5, -9],  speed: 1.7, scale: 0.44, color: "#00ffaa" },
    { position: [-2.0,-4.5, -7],  speed: 1.6, scale: 0.46, color: "#7b61ff" },
    { position: [ 2.0,-4.0, -8],  speed: 1.4, scale: 0.50, color: "#ff6b35" },
  ], []);
  const rings = useMemo(() => [
    { position: [-4.0, 2.5, -7],  speed: 0.9, scale: 0.60, color: "#ff6b9d" },
    { position: [-6.5,-2.0, -8],  speed: 1.2, scale: 0.52, color: "#44ffaa" },
    { position: [ 4.0, 2.5, -7],  speed: 1.0, scale: 0.58, color: "#f4d35e" },
    { position: [ 6.0,-2.0, -8],  speed: 0.8, scale: 0.55, color: "#ef476f" },
    { position: [ 0.0,-5.0, -8],  speed: 0.9, scale: 0.55, color: "#ffdd44" },
  ], []);
  return (
    <group>
      <Sparkles count={80} position={[-7,0,-10]} scale={[6,12,4]} size={2.5} speed={3}   opacity={0.18} color="#00d4ff" />
      <Sparkles count={80} position={[ 7,0,-10]} scale={[6,12,4]} size={2.5} speed={3}   opacity={0.18} color="#7b61ff" />
      <Sparkles count={50} position={[ 0,6,-10]} scale={[14,4,4]} size={2}   speed={3.5} opacity={0.14} color="#00ffaa" />
      {atoms.map((a, i) => <AtomOrbit   key={`a${i}`} {...a} />)}
      {rings.map((r, i) => <BenzeneRing key={`r${i}`} {...r} />)}
    </group>
  );
}

/* ================================================================ PLACED MATERIALS */
function SolidMat({ color }) {
  const ref = useRef();
  useFrame(({ clock }) => { if (ref.current) { ref.current.rotation.y = clock.getElapsedTime()*1.2; ref.current.rotation.x = Math.sin(clock.getElapsedTime()*0.7)*0.3; } });
  return <mesh ref={ref} renderOrder={3}><dodecahedronGeometry args={[0.09]} /><meshStandardMaterial color={color} roughness={0.1} metalness={0.35} transparent opacity={0.95} depthWrite={false} emissive={color} emissiveIntensity={0.08} /></mesh>;
}

function LiquidMat({ color }) {
  const ref = useRef();
  useFrame(({ clock }) => { if (ref.current) ref.current.scale.setScalar(1+Math.sin(clock.getElapsedTime()*2.8)*0.09); });
  return <mesh ref={ref} renderOrder={3}><sphereGeometry args={[0.09, 32, 32]} /><meshPhysicalMaterial color={color} transparent opacity={0.85} transmission={0.45} roughness={0.01} depthWrite={false} /></mesh>;
}

function GasMat({ color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) { const t = clock.getElapsedTime(); ref.current.scale.setScalar(0.78+Math.sin(t*2.0)*0.24); ref.current.material.opacity = 0.12+Math.abs(Math.sin(t*2.0))*0.20; }
  });
  return <mesh ref={ref} renderOrder={3}><sphereGeometry args={[0.11, 24, 24]} /><meshStandardMaterial color={color} transparent opacity={0.22} depthWrite={false} /></mesh>;
}

function PlacedMaterial({ material, index, total, bounds }) {
  const info  = getMaterialInfo(material.name);
  const color = material.color || "#4488ff";
  const state = (material.state || "solid").toLowerCase();
  const py = bounds.bottomY + (bounds.topY - bounds.bottomY) * 0.20;
  const px = total > 1 ? (index - (total-1)/2) * 0.12 : 0;
  return (
    <group position={[px, py, 0]}>
      {state === "solid"  && <SolidMat  color={color} />}
      {state === "liquid" && <LiquidMat color={color} />}
      {state === "gas"    && <GasMat    color={color} />}
      {!["solid","liquid","gas"].includes(state) && <SolidMat color={color} />}
      <Text position={[0,0.18,0]} fontSize={0.065} color="white" outlineWidth={0.006} outlineColor="#1a1a2e" renderOrder={10} anchorX="center">
        {material.name}
      </Text>
    </group>
  );
}

/* ================================================================ TRANSITION */
function ReactionEffect({ bounds }) {
  return (
    <group position={[0, bounds.bottomY+0.15, 0]}>
      <Sparkles count={60} scale={0.6} size={5} speed={4} color="#ffcc00" />
      <Sparkles count={30} scale={0.4} size={3} speed={6} color="#ff4488" />
      {Array.from({ length: 20 }, (_, i) => (
        <Float key={i} speed={5} floatIntensity={2.5}>
          <mesh position={[(Math.random()-0.5)*0.28, (Math.random()-0.5)*0.28, (Math.random()-0.5)*0.28]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color={`hsl(${(i*37)%360},90%,65%)`} transparent opacity={0.8} emissive={`hsl(${(i*37)%360},90%,65%)`} emissiveIntensity={0.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ================================================================ PRODUCT */
function ProductResult({ reaction, bounds }) {
  const color = getReactionColor(reaction);
  const state = getState(reaction.products_state);
  const [progress,     setProgress]     = useState(0);
  const [labelOpacity, setLabelOpacity] = useState(0);
  const startTime = useRef(null);
  useFrame(({ clock }) => {
    if (!startTime.current) startTime.current = clock.getElapsedTime();
    const elapsed = clock.getElapsedTime() - startTime.current;
    setProgress(Math.min(1, elapsed / 2.0));
    setLabelOpacity(Math.min(1, Math.max(0, (elapsed - 0.7) / 1.0)));
  });
  return (
    <group>
      {state === "liquid" && <LiquidResult color={color} bounds={bounds} progress={progress} />}
      {state === "gas"    && <GasResult    color={color} bounds={bounds} progress={progress} />}
      {state === "solid"  && <SolidResult  color={color} bounds={bounds} progress={progress} />}
      <group position={[0, bounds.topY+0.30, 0]}>
        <mesh renderOrder={5}><planeGeometry args={[0.80, 0.22]} /><meshStandardMaterial color="#0a0a1a" transparent opacity={0.80*labelOpacity} depthWrite={false} /></mesh>
        <Text position={[0,0,0.01]} fontSize={0.11} color="#00d4ff" anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor="#0a0a1a" renderOrder={10} fillOpacity={labelOpacity}>{reaction.products}</Text>
      </group>
    </group>
  );
}

/* ================================================================
   MAIN — Fully Responsive
================================================================ */
export default function LabScene() {
  const [placedMaterials,  setPlacedMaterials]  = useState([]);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [phase,            setPhase]            = useState("idle");
  const [result,           setResult]           = useState(null);
  const [beakerBounds,     setBeakerBounds]     = useState(null);
  const [leftOpen,         setLeftOpen]         = useState(false);
  const [rightOpen,        setRightOpen]        = useState(false);
  const [isMobile,         setIsMobile]         = useState(window.innerWidth < 768);
  const [entered,          setEntered]          = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(t); window.removeEventListener("resize", onResize); };
  }, []);

  // على الموبايل إغلاق أي sidebar مفتوح عند فتح التاني
  const openLeft  = () => { setLeftOpen(true);  if (isMobile) setRightOpen(false); };
  const openRight = () => { setRightOpen(true); if (isMobile) setLeftOpen(false);  };

  const handleDrop = (e) => {
    e.preventDefault();
    const material = JSON.parse(e.dataTransfer.getData("application/json"));
    setPlacedMaterials((prev) => [...prev, material]);
  };

  const matchedReactions = useMemo(() => {
    if (placedMaterials.length < 2) return [];
    const names = placedMaterials.map((m) => normalize(m.name));
    return reactionsData.filter((r) => {
      if (!r.reactants) return false;
      const reactants = r.reactants.split("+").map((x) => normalize(x));
      return reactants.length === names.length && reactants.every((x) => names.includes(x));
    });
  }, [placedMaterials]);

  const startReaction = () => {
    if (!selectedReaction) return;
    setPhase("fade");
    // على الموبايل اغلق الـ sidebar بعد ما يبدأ التفاعل
    if (isMobile) setRightOpen(false);
    setTimeout(() => { setPlacedMaterials([]); setResult(selectedReaction); setPhase("result"); }, 1600);
  };

  const phaseColor = phase === "result" ? "#00ffaa" : phase === "fade" ? "#ffcc00" : "#00d4ff";
  const phaseLabel = phase === "idle" ? "Ready" : phase === "fade" ? "Reacting…" : "Complete";

  const sidebarW = isMobile ? Math.min(300, window.innerWidth * 0.85) : 280;

  return (
    <div style={{
      position: "relative",
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      background: "linear-gradient(135deg,#060818,#0d1b3e,#0a1628)",
      fontFamily: "'Segoe UI',system-ui,sans-serif",
      opacity: entered ? 1 : 0,
      transform: entered ? "scale(1)" : "scale(0.97)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    }}>

      {/* ══ TOPBAR ══ */}
      <div style={{
        flexShrink: 0,
        height: 52,
        background: "rgba(6,8,24,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,212,255,0.18)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 12px" : "0 20px",
        zIndex: 300,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg,#00d4ff,#7b61ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
            boxShadow: "0 0 16px rgba(0,212,255,0.4)",
          }}>⚗️</div>
          {!isMobile && (
            <span style={{ color: "#e0f4ff", fontWeight: 700, fontSize: 16, letterSpacing: "0.02em" }}>
              Simuscience <span style={{ color: "#00d4ff", fontSize: 12, fontWeight: 400, marginLeft: 6 }}>Virtual Lab</span>
            </span>
          )}
        </div>

        {/* Nav buttons */}
        <div style={{ display: "flex", gap: 6 }}>
          {[["🧪 Materials", 0], ["📋 Reactions", 1]].map(([label, idx]) => {
            const isActive = idx === 0 ? leftOpen : rightOpen;
            return (
              <button key={label}
                onClick={() => idx === 0 ? (leftOpen ? setLeftOpen(false) : openLeft()) : (rightOpen ? setRightOpen(false) : openRight())}
                style={{
                  padding: isMobile ? "5px 10px" : "6px 14px",
                  borderRadius: 20,
                  background: isActive ? "linear-gradient(135deg,#00d4ff,#7b61ff)" : "rgba(0,212,255,0.07)",
                  border: "1px solid rgba(0,212,255,0.22)",
                  color: "#c8eeff",
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.25s",
                  whiteSpace: "nowrap",
                }}
              >{isMobile ? (idx === 0 ? "🧪" : "📋") : label}</button>
            );
          })}
        </div>

        {/* Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: phaseColor,
            boxShadow: `0 0 8px ${phaseColor}`,
            animation: "lsPulse 2s infinite",
          }} />
          {!isMobile && <span style={{ color: "#88aacc", fontSize: 11 }}>{phaseLabel}</span>}
          {phase !== "idle" && (
            <button
              onClick={() => { setPlacedMaterials([]); setPhase("idle"); setResult(null); setSelectedReaction(null); }}
              style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(255,107,53,0.14)", border: "1px solid rgba(255,107,53,0.28)", color: "#ffaa88", fontSize: 11, cursor: "pointer" }}
            >↺</button>
          )}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

        {/* Overlay (mobile) */}
        {(leftOpen || rightOpen) && isMobile && (
          <div
            onClick={() => { setLeftOpen(false); setRightOpen(false); }}
            style={{ position: "absolute", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
          />
        )}

        {/* Left Sidebar */}
        <div style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          width: sidebarW,
          background: "rgba(6,8,24,0.96)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(0,212,255,0.14)",
          transform: leftOpen ? "translateX(0)" : `translateX(-${sidebarW}px)`,
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          zIndex: 200,
          boxShadow: leftOpen ? "4px 0 30px rgba(0,0,0,0.5)" : "none",
          overflowY: "auto",
        }}>
          <button
            onClick={() => setLeftOpen(false)}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 10, width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#88aacc", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >✕</button>
          <LeftSidebar />
        </div>

        {/* Right Sidebar */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0,
          width: sidebarW,
          background: "rgba(6,8,24,0.96)",
          backdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(0,212,255,0.14)",
          transform: rightOpen ? "translateX(0)" : `translateX(${sidebarW}px)`,
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          zIndex: 200,
          boxShadow: rightOpen ? "-4px 0 30px rgba(0,0,0,0.5)" : "none",
          overflowY: "auto",
        }}>
          <button
            onClick={() => setRightOpen(false)}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 10, width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#88aacc", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >✕</button>
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

        {/* Canvas */}
        <div
          style={{ position: "absolute", inset: 0 }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Canvas
            camera={{ position: [0, 3, isMobile ? 8 : 6], fov: isMobile ? 50 : 45 }}
            style={{ background: "transparent" }}
          >
            <ChemicalBackground />
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]}  intensity={1.4} color="#c8e8ff" />
            <directionalLight position={[-5, 8, -5]} intensity={0.5} color="#7b61ff" />
            <pointLight       position={[0, 4, 3]}   intensity={0.8} color="#00d4ff" />
            <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={14} />
            <Environment preset="night" />

            <Beaker reactionStarted={phase !== "idle"} onReady={setBeakerBounds} />

            {beakerBounds && (
              <>
                {phase === "idle" && placedMaterials.map((m, i) => (
                  <PlacedMaterial key={i} material={m} index={i} total={placedMaterials.length} bounds={beakerBounds} />
                ))}
                {phase === "fade"   && <ReactionEffect bounds={beakerBounds} />}
                {phase === "result" && result && <ProductResult reaction={result} bounds={beakerBounds} />}
              </>
            )}
          </Canvas>
        </div>

        {/* Hint */}
        {phase === "idle" && placedMaterials.length === 0 && (
          <div style={{
            position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,212,255,0.07)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,212,255,0.18)",
            borderRadius: 14, padding: "9px 20px",
            color: "#88aacc", fontSize: 12,
            pointerEvents: "none",
            whiteSpace: isMobile ? "normal" : "nowrap",
            textAlign: "center",
            maxWidth: "90%",
            zIndex: 10,
          }}>
            Tap <strong style={{ color: "#00d4ff" }}>🧪 Materials</strong> → drag into the beaker
          </div>
        )}

        {/* Materials chips */}
        {placedMaterials.length > 0 && phase === "idle" && (
          <div style={{
            position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center",
            maxWidth: "80%", zIndex: 10,
          }}>
            {placedMaterials.map((m, i) => (
              <span key={i} style={{
                padding: "3px 10px", borderRadius: 12,
                background: m.color || "#334",
                color: "white", fontSize: 11, fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}>{m.name}</span>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes lsPulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>
    </div>
  );
}
