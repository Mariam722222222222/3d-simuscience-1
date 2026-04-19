import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Beaker from "./Beaker";
import reactionsData from "../Data/csvjson (1).json";
import materialsData from "../Data/knowledge_visual.json";



/* ================================================================
   HELPERS
================================================================ */

function getMaterialInfo(name) {
  return materialsData[name] || null;
}
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

/* ================================================================
   LIQUID — يتبع شكل القارورة الحقيقي بـ LatheGeometry
================================================================ */
function buildLiquidPoints(bounds, fillFraction) {
  const { bottomY, totalH, sliceRadii } = bounds;
  const SLICES = sliceRadii.length;
  // نملا من القاع لـ fillFraction
  const fillSlices = Math.max(2, Math.round(SLICES * fillFraction));
  const points = [];
  // نقطة المحور في القاع
  points.push(new THREE.Vector2(0, 0));
  for (let i = 0; i < fillSlices; i++) {
    const y = (i / (SLICES - 1)) * totalH;
    const r = sliceRadii[i] * 0.82; // هامش بسيط داخل الجدار
    points.push(new THREE.Vector2(r, y));
  }
  // إغلاق في الأعلى للسطح
  const topY = (( fillSlices - 1) / (SLICES - 1)) * totalH;
  points.push(new THREE.Vector2(0, topY));
  return points;
}

function LiquidResult({ color, bounds, progress }) {
  const surfRef  = useRef();
  const liquidRef = useRef();
  const [geom, setGeom] = useState(null);
  const prevProgress = useRef(0);

  useEffect(() => {
    if (!bounds.sliceRadii) return;
    const fill = 0.48 * progress;
    const pts  = buildLiquidPoints(bounds, fill);
    const g    = new THREE.LatheGeometry(pts, 48);
    g.translate(0, bounds.bottomY, 0);
    setGeom(g);
    prevProgress.current = progress;
  }, [progress, bounds]);

  // سطح متموج
  const surfaceY = useMemo(() => {
    if (!bounds.sliceRadii) return bounds.bottomY;
    const SLICES = bounds.sliceRadii.length;
    const fillIdx = Math.round(SLICES * 0.48 * progress);
    const normY   = (Math.min(fillIdx, SLICES - 1) / (SLICES - 1));
    return bounds.bottomY + normY * bounds.totalH;
  }, [progress, bounds]);

  const surfRadius = useMemo(() => {
    if (!bounds.sliceRadii) return 0.1;
    const SLICES = bounds.sliceRadii.length;
    const fillIdx = Math.round(SLICES * 0.48 * progress);
    return (bounds.sliceRadii[Math.min(fillIdx, SLICES - 1)] ?? 0.1) * 0.80;
  }, [progress, bounds]);

  useFrame(({ clock }) => {
    if (!surfRef.current) return;
    const t   = clock.getElapsedTime();
    const pos = surfRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 16 + t * 4) * 0.012 + Math.cos(y * 14 + t * 3) * 0.012);
    }
    pos.needsUpdate = true;
    surfRef.current.geometry.computeVertexNormals();
  });

  if (!geom) return null;

  return (
    <group>
      {/* جسم السائل بشكل القارورة */}
      <mesh geometry={geom} renderOrder={2}>
        <meshPhysicalMaterial
          color={color}
          transparent opacity={0.70}
          transmission={0.18}
          roughness={0.02}
          metalness={0.0}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* سطح متموج */}
      <mesh ref={surfRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, surfaceY, 0]} renderOrder={3}>
        <planeGeometry args={[surfRadius * 2, surfRadius * 2, 48, 48]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.92} roughness={0.01} depthWrite={false} />
      </mesh>

      {/* بريق سطحي */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, surfaceY + 0.004, 0]} renderOrder={4}>
        <circleGeometry args={[surfRadius * 0.65, 40]} />
        <meshStandardMaterial color="white" transparent opacity={0.22} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ================================================================
   GAS RESULT — فقاعات تتبع شكل القارورة
================================================================ */
function GasBubble({ color, bounds, x, z, delay, size, progress }) {
  const ref = useRef();
  const { bottomY, topY } = bounds;
  const halfH = (topY - bottomY) * 0.48;
  const dur   = 1.6 + Math.random() * 1.2;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t    = (clock.getElapsedTime() + delay) % dur;
    const prog = t / dur;
    ref.current.position.y = bottomY + 0.03 + prog * halfH * progress;
    ref.current.position.x = x + Math.sin(t * 5 + delay) * 0.02;
    const fade = prog < 0.08 ? prog / 0.08 : prog > 0.85 ? 1 - (prog - 0.85) / 0.15 : 1;
    ref.current.material.opacity = fade * 0.70 * progress;
    ref.current.scale.setScalar((0.4 + prog * 0.65) * progress);
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
  const R     = innerRadius * 0.85;

  const bubbles = useMemo(() =>
    Array.from({ length: 45 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * R * 0.88;
      return { x: Math.cos(angle) * r, z: Math.sin(angle) * r, delay: (i / 45) * 3.5, size: 0.016 + Math.random() * 0.026 };
    }), [R]
  );

  return (
    <group>
      <mesh position={[0, bottomY + halfH / 2, 0]} renderOrder={2}>
        <cylinderGeometry args={[R, R, halfH * progress, 48]} />
        <meshStandardMaterial color={color} transparent opacity={0.08 * progress} depthWrite={false} />
      </mesh>
      {bubbles.map((b, i) => (
        <GasBubble key={i} color={color} bounds={bounds} x={b.x} z={b.z} delay={b.delay} size={b.size} progress={progress} />
      ))}
    </group>
  );
}

/* ================================================================
   SOLID RESULT
================================================================ */
function SolidCrystal({ color, position, speed, scale, progress, delay }) {
  const ref  = useRef();
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
        items.push({ position: [Math.cos(angle) * r, y, Math.sin(angle) * r], speed: 0.4 + Math.random() * 0.6, scale: 0.8 + Math.random() * 1.2, delay: ring * 0.2 + (i / count) * 0.3 });
      }
    }
    return items;
  }, [midY, bottomY, halfH, R]);

  return (
    <group>
      {crystals.map((c, i) => <SolidCrystal key={i} color={color} progress={progress} {...c} />)}
    </group>
  );
}

/* ================================================================
   CHEMICAL BACKGROUND — جزيئات كيميائية متحركة
================================================================ */
function AtomOrbit({ position, speed, color, scale }) {
  const groupRef = useRef();
  const el1 = useRef(), el2 = useRef(), el3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (groupRef.current) {
      groupRef.current.rotation.y  = t * 0.7;
      groupRef.current.rotation.x  = Math.sin(t * 0.4) * 0.5;
      groupRef.current.position.y  = position[1] + Math.sin(t * 0.3) * 1.0;
    }
    if (el1.current) el1.current.rotation.z = t * 2.2;
    if (el2.current) el2.current.rotation.z = t * 1.8 + 2;
    if (el3.current) el3.current.rotation.z = t * 1.5 + 4;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* نواة */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* 3 مدارات بزوايا مختلفة */}
      {[el1, el2, el3].map((elRef, idx) => (
        <group key={idx} rotation={[idx * Math.PI / 3, idx * Math.PI / 4, 0]}>
          <group ref={elRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.65, 0.018, 8, 48]} />
              <meshStandardMaterial color={color} transparent opacity={0.20} />
            </mesh>
            <mesh position={[0.65, 0, 0]}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshStandardMaterial color={color} transparent opacity={0.7} emissive={color} emissiveIntensity={0.5} />
            </mesh>
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
    if (ref.current) {
      ref.current.rotation.z = t;
      ref.current.rotation.x = Math.sin(t * 0.5) * 0.6;
      ref.current.position.y = position[1] + Math.sin(t * 0.35) * 1.2;
    }
  });
  const pts = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return [Math.cos(a) * 0.55, Math.sin(a) * 0.55];
    }), []
  );
  return (
    <group ref={ref} position={position} scale={scale}>
      {pts.map((p, i) => (
        <group key={i}>
          <mesh position={[p[0], p[1], 0]}>
            <sphereGeometry args={[0.10, 10, 10]} />
            <meshStandardMaterial color={color} transparent opacity={0.40} emissive={color} emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[(p[0] + pts[(i+1)%6][0])/2, (p[1] + pts[(i+1)%6][1])/2, 0]} rotation={[0,0,(Math.PI/3)*i+Math.PI/6]}>
            <cylinderGeometry args={[0.022, 0.022, 0.55, 6]} />
            <meshStandardMaterial color={color} transparent opacity={0.22} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[Math.PI/2,0,0]}>
        <torusGeometry args={[0.28, 0.022, 6, 30]} />
        <meshStandardMaterial color={color} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function ChemicalBackground() {
  const atoms = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      position: [(Math.random()-0.5)*24, (Math.random()-0.5)*16, -7-Math.random()*10],
      speed:    1.0 + Math.random() * 2.0,
      scale:    0.35 + Math.random() * 0.55,
      color: ["#00d4ff","#7b61ff","#00ffaa","#ff6b35","#f72585"][i%5],
    })), []
  );
  const rings = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => ({
      position: [(Math.random()-0.5)*20, (Math.random()-0.5)*14, -9-Math.random()*8],
      speed:    0.6 + Math.random() * 1.5,
      scale:    0.45 + Math.random() * 0.65,
      color: ["#ff6b9d","#48cae4","#f4d35e","#06d6a0","#ef476f"][i%5],
    })), []
  );

  return (
    <group>
      <Sparkles count={150} scale={28} size={3}   speed={3}   opacity={0.15} color="#00d4ff" />
      <Sparkles count={80}  scale={20} size={1.5} speed={5}   opacity={0.10} color="#7b61ff" />
      <Sparkles count={50}  scale={15} size={2}   speed={4.5} opacity={0.12} color="#00ffaa" />
      {atoms.map((a, i) => <AtomOrbit    key={`a${i}`} {...a} />)}
      {rings.map((r, i) => <BenzeneRing  key={`r${i}`} {...r} />)}
    </group>
  );
}

/* ================================================================
   PLACED MATERIALS
================================================================ */
function SolidMat({ color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 1.2;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.7) * 0.3;
    }
  });
  return (
    <mesh ref={ref} renderOrder={3}>
      <dodecahedronGeometry args={[0.09]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.35} transparent opacity={0.95} depthWrite={false} emissive={color} emissiveIntensity={0.08} />
    </mesh>
  );
}

function LiquidMat({ color }) {
  const ref = useRef();
  const surfRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (ref.current) {
      ref.current.scale.x = 1 + Math.sin(t * 2.0) * 0.04;
      ref.current.scale.z = 1 + Math.cos(t * 2.0) * 0.04;
      ref.current.scale.y = 1 + Math.sin(t * 1.5) * 0.03;
    }

    if (surfRef.current) {
      const pos = surfRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        pos.setZ(i,
          Math.sin(x * 16 + t * 4) * 0.012 +
          Math.cos(y * 14 + t * 3) * 0.012
        );
      }
      pos.needsUpdate = true;
      surfRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <group>
      {/* الجسم الرئيسي — نص كرة مفلطحة تملا قاع الدورق */}
      <mesh ref={ref} position={[0, -0.12, 0]} renderOrder={3}>
        <sphereGeometry args={[0.28, 48, 48]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.88}
          roughness={0.05}
          metalness={0.08}
          depthWrite={false}
          emissive={color}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* طبقة ثانية أفتح لعمق السائل */}
      <mesh position={[0, -0.10, 0]} renderOrder={2}>
        <sphereGeometry args={[0.25, 48, 48]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.40}
          roughness={0.02}
          depthWrite={false}
          emissive={color}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* سطح متموج */}
      <mesh
        ref={surfRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.10, 0]}
        renderOrder={4}
      >
        <planeGeometry args={[0.50, 0.50, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.92}
          roughness={0.01}
          depthWrite={false}
        />
      </mesh>

      {/* بريق سطحي */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.11, 0]}
        renderOrder={5}
      >
        <circleGeometry args={[0.14, 40]} />
        <meshStandardMaterial
          color="white"
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>

      {/* نقطة ضوء */}
      <mesh position={[0.08, 0.05, 0.15]} renderOrder={6}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color="white"
          transparent
          opacity={0.70}
          depthWrite={false}
          emissive="white"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* هالة خارجية */}
      <mesh position={[0, -0.12, 0]} renderOrder={1}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.10}
          depthWrite={false}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
}
function GasMat({ color }) {
  const groupRef = useRef();
  const bubblesRef = useRef([]);

  const bubbles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      x: (Math.random() - 0.5) * 0.18,
      z: (Math.random() - 0.5) * 0.18,
      speed: 0.4 + Math.random() * 0.6,
      size: 0.025 + Math.random() * 0.035,
      delay: (i / 12) * 3.0,
      wobble: Math.random() * Math.PI * 2,
    })), []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    bubbles.forEach((b, i) => {
      const mesh = bubblesRef.current[i];
      if (!mesh) return;
      const dur = 1.8 + b.speed;
      const prog = ((t * b.speed + b.delay) % dur) / dur;

      // حركة لأعلى مع تأرجح
      mesh.position.y = -0.15 + prog * 0.55;
      mesh.position.x = b.x + Math.sin(t * 3 + b.wobble) * 0.025;
      mesh.position.z = b.z + Math.cos(t * 2 + b.wobble) * 0.025;

      // تكبير وتلاشي
      const scale = prog < 0.1
        ? prog / 0.1
        : prog > 0.8
        ? 1 - (prog - 0.8) / 0.2
        : 1;
      mesh.scale.setScalar(scale * (0.6 + prog * 0.6));
      mesh.material.opacity = scale * 0.75;
    });
  });

  return (
    <group ref={groupRef}>
      {bubbles.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => (bubblesRef.current[i] = el)}
          position={[b.x, -0.15, b.z]}
          renderOrder={3}
        >
          <sphereGeometry args={[b.size, 16, 16]} />
          <meshPhysicalMaterial
            color={color}
            transparent
            opacity={0.75}
            roughness={0.02}
            transmission={0.3}
            depthWrite={false}
            emissive={color}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}

      {/* هالة خفيفة في الوسط */}
      <mesh renderOrder={2}>
        <sphereGeometry args={[0.10, 24, 24]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.08}
          depthWrite={false}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
}

function PlacedMaterial({ material, index, total, bounds }) {
  const info = getMaterialInfo(material.name);
  const color = material.color || "#4488ff";   // ← fallback لو color مش موجود
  const state = (material.state || "solid").toLowerCase();  // ← normalize
  const toxicity = info?.toxicity || "low";
  
  const py = bounds.bottomY + (bounds.topY - bounds.bottomY) * 0.20;
  const px = total > 1 ? (index - (total - 1) / 2) * 0.12 : 0;

  return (
    <group position={[px, py, 0]}>
      {state === "solid"  && <SolidMat  color={color} />}
      {state === "liquid" && <LiquidMat color={color} />}
      {state === "gas"    && <GasMat    color={color} />}
      {/* fallback لو state غلط */}
      {!["solid","liquid","gas"].includes(state) && <SolidMat color={color} />}
      <Text
        position={[0, 0.18, 0]}
        fontSize={0.065}
        color="white"
        outlineWidth={0.006}
        outlineColor="#1a1a2e"
        renderOrder={10}
        anchorX="center"
      >
        {material.name}{" "}
        {toxicity === "high" ? "👹" : "🟢"}
      </Text>
    </group>
  );
}

/* ================================================================
   REACTION TRANSITION
================================================================ */
function ReactionEffect({ bounds }) {
  return (
    <group position={[0, bounds.bottomY + 0.15, 0]}>
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

/* ================================================================
   PRODUCT RESULT
================================================================ */
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
      <group position={[0, bounds.topY + 0.30, 0]}>
        <mesh renderOrder={5}>
          <planeGeometry args={[0.80, 0.22]} />
          <meshStandardMaterial color="#0a0a1a" transparent opacity={0.80 * labelOpacity} depthWrite={false} />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.11} color="#00d4ff" anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor="#0a0a1a" renderOrder={10} fillOpacity={labelOpacity}>
          {reaction.products}
        </Text>
      </group>
    </group>
  );
}

/* ================================================================
   MAIN — Modern Dark Lab UI
================================================================ */
export default function LabScene() {
  const [placedMaterials,  setPlacedMaterials]  = useState([]);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [phase,            setPhase]            = useState("idle");
  const [result,           setResult]           = useState(null);
  const [beakerBounds,     setBeakerBounds]     = useState(null);
  const [leftOpen,         setLeftOpen]         = useState(false);
  const [rightOpen,        setRightOpen]        = useState(false);

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
    setTimeout(() => { setPlacedMaterials([]); setResult(selectedReaction); setPhase("result"); }, 1600);
  };

  return (
    <div style={{
      position: "relative", width: "100vw", height: "100vh",
      display: "flex", overflow: "hidden",
      background: "linear-gradient(135deg, #060818 0%, #0d1b3e 50%, #0a1628 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ── شريط علوي ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 200,
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
          <span style={{ color: "#e0f4ff", fontWeight: 700, fontSize: 18, letterSpacing: "0.03em" }}>
            Simuscience <span style={{ color: "#00d4ff", fontSize: 13, fontWeight: 400, marginLeft: 8 }}>Virtual Lab</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {["Materials", "Reactions"].map((label, idx) => (
            <button key={label} onClick={() => idx === 0 ? setLeftOpen(!leftOpen) : setRightOpen(!rightOpen)} style={{
              padding: "6px 16px", borderRadius: 20,
              background: (idx === 0 ? leftOpen : rightOpen)
                ? "linear-gradient(135deg,#00d4ff,#7b61ff)"
                : "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              color: "#c8eeff", fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "all 0.3s",
              backdropFilter: "blur(10px)",
            }}>{label}</button>
          ))}
        </div>

        {/* مؤشر الحالة */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: phase === "result" ? "#00ffaa" : phase === "fade" ? "#ffcc00" : "#00d4ff",
            boxShadow: `0 0 10px ${phase === "result" ? "#00ffaa" : phase === "fade" ? "#ffcc00" : "#00d4ff"}`,
            animation: "pulse 2s infinite",
          }} />
          <span style={{ color: "#88aacc", fontSize: 12 }}>
            {phase === "idle" ? "Ready" : phase === "fade" ? "Reacting..." : "Complete"}
          </span>
        </div>
      </div>

      {/* ── Sidebar اليسار ── */}
      <div style={{
        position: "absolute", left: 0, top: 56, zIndex: 100,
        height: "calc(100% - 56px)", width: 280,
        background: "rgba(6,8,24,0.92)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(0,212,255,0.15)",
        transform: leftOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: leftOpen ? "4px 0 40px rgba(0,212,255,0.12)" : "none",
      }}>
        <LeftSidebar />
      </div>

      {/* ── Canvas ── */}
      <div style={{ flex: 1, paddingTop: 56 }} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <Canvas camera={{ position: [0, 3, 6], fov: 45 }} style={{ background: "transparent" }}>
          <ChemicalBackground />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]}   intensity={1.4} color="#c8e8ff" />
          <directionalLight position={[-5, 8, -5]}  intensity={0.5} color="#7b61ff" />
          <pointLight       position={[0, 4, 3]}    intensity={0.8} color="#00d4ff" />
          <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={12} />
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

      {/* ── Sidebar اليمين ── */}
      <div style={{
        position: "absolute", right: 0, top: 56, zIndex: 100,
        height: "calc(100% - 56px)", width: 300,
        background: "rgba(6,8,24,0.92)",
        backdropFilter: "blur(24px)",
        borderLeft: "1px solid rgba(0,212,255,0.15)",
        transform: rightOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: rightOpen ? "-4px 0 40px rgba(0,212,255,0.12)" : "none",
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

      {/* ── تعليمات خفيفة لما الـ lab فاضي ── */}
      {phase === "idle" && placedMaterials.length === 0 && (
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,212,255,0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,212,255,0.20)",
          borderRadius: 16, padding: "12px 28px",
          color: "#88aacc", fontSize: 13, letterSpacing: "0.02em",
          pointerEvents: "none",
        }}>
          Open <strong style={{ color: "#00d4ff" }}>Materials</strong> → drag compounds into the beaker
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
