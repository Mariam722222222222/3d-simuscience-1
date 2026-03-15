import React, { useState, Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Text } from "@react-three/drei";
import * as THREE from "three";

import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Beaker from "./Beaker";
import reactionsData from "../Data/csvjson (1).json";
import "../App.css";

/* ================= API CALL ================= */

async function callPredictAPI(reactants, conditions) {
  try {

    const sessionHash = Math.random().toString(36).substring(2, 14);

    const joinResponse = await fetch(
      "https://nadamomen26-simu-api.hf.space/gradio_api/queue/join",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: [reactants, conditions],
          fn_index: 2,
          trigger_id: 13,
          session_hash: sessionHash
        })
      }
    );

    const joinResult = await joinResponse.json();
    console.log("JOIN RESPONSE:", joinResult);

    const dataResponse = await fetch(
      `https://nadamomen26-simu-api.hf.space/gradio_api/queue/data?session_hash=${sessionHash}`
    );

    const text = await dataResponse.text();
    console.log("QUEUE DATA:", text);

    const productMatch = text.match(/'product':\s*'([^']+)'/);
    const safetyMatch = text.match(/'safety':\s*'([^']+)'/);

    const product = productMatch ? productMatch[1] : "Unknown";
    const safety = safetyMatch ? safetyMatch[1] : "No safety info";

    return {
      product,
      safety
    };

  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}

/* ================= MATERIAL ================= */

function PlacedMaterial({ mat }) {
  const size = 0.15;

  return (
    <mesh renderOrder={10}>
      {mat.shape === "cube" ? (
        <boxGeometry args={[size, size, size]} />
      ) : (
        <sphereGeometry args={[size / 2, 32, 32]} />
      )}

      <meshStandardMaterial
        color={mat.color}
        transparent
        opacity={0.95}
        depthTest={false}
        depthWrite={false}
      />

      <Text position={[0, size + 0.05, 0]} fontSize={0.08} color="black">
        {mat.name}
      </Text>
    </mesh>
  );
}

/* ================= DROP HANDLER ================= */

function DropHandler({ dropRequest, onPlace, beakerBounds }) {
  const { camera, gl } = useThree();
  const raycaster = new THREE.Raycaster();

  React.useEffect(() => {
    if (!dropRequest || !beakerBounds) return;

    const { clientX, clientY, material } = dropRequest;
    const rect = gl.domElement.getBoundingClientRect();

    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera({ x, y }, camera);

    const plane = new THREE.Plane(
      new THREE.Vector3(0, 1, 0),
      -beakerBounds.centerY
    );

    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);

    onPlace({
      ...material,
      position: [
        THREE.MathUtils.clamp(point.x, -0.2, 0.2),
        beakerBounds.bottomY + 0.25,
        0.35,
      ],
    });
  }, [dropRequest, beakerBounds]);

  return null;
}

/* ================= LAB SCENE ================= */

const LabScene = () => {

  const [dropRequest, setDropRequest] = useState(null);
  const [placedMaterials, setPlacedMaterials] = useState([]);
  const [beakerBounds, setBeakerBounds] = useState(null);

  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionStarted, setReactionStarted] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  /* ================= REACTANTS ================= */

  const reactantsInBeaker = useMemo(
    () => placedMaterials.map((m) => m.name).sort(),
    [placedMaterials]
  );

  /* ================= MATCH DATASET ================= */

  const matchedReactions = useMemo(() => {

    if (reactantsInBeaker.length < 2) return [];

    const beakerSet = new Set(
      reactantsInBeaker.map((r) => r.trim().toLowerCase())
    );

    return reactionsData.filter((r) => {

      const datasetReactants = r.reactants
        .split("+")
        .map((x) => x.trim().toLowerCase());

      const datasetSet = new Set(datasetReactants);

      if (datasetSet.size !== beakerSet.size) return false;

      for (let item of datasetSet) {
        if (!beakerSet.has(item)) return false;
      }

      return true;

    });

  }, [reactantsInBeaker]);

  /* ================= DROP ================= */

  const handleDrop = (e) => {
    e.preventDefault();
    const material = JSON.parse(e.dataTransfer.getData("application/json"));

    setDropRequest({
      clientX: e.clientX,
      clientY: e.clientY,
      material,
    });
  };

  /* ================= START REACTION ================= */

  const startReaction = async () => {

  if (!selectedReaction) {
    alert("Please select reaction condition");
    return;
  }

  try {

    // نأخذ النص مباشرة من الداتاسيت
    const reactantsString = selectedReaction.reactants.trim();
    const conditionString = selectedReaction.conditions.trim();

    console.log("Reactants sent to AI:", reactantsString);
    console.log("Conditions sent to AI:", conditionString);

    const result = await callPredictAPI(
      reactantsString,
      conditionString
    );

    setAiResult({
      products: result?.product || "Unknown Product",
      observation: result?.safety || "Reaction completed",
    });

    setReactionStarted(true);

  } catch (error) {
    console.error("Reaction failed:", error);
  }
};

  /* ================= RESET ================= */

  const resetLab = () => {
    setPlacedMaterials([]);
    setSelectedReaction(null);
    setReactionStarted(false);
    setAiResult(null);
  };

  return (
    <div className="root-layout">

      <LeftSidebar />

      <div
        className="lab-canvas-wrap"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >

        <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>

          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} />

          <OrbitControls />

          <Suspense fallback={null}>

            <Environment preset="studio" />

            <Beaker
              reactionStarted={reactionStarted}
              onReady={setBeakerBounds}
            />

          </Suspense>

          <DropHandler
            dropRequest={dropRequest}
            onPlace={(obj) =>
              setPlacedMaterials((prev) => [...prev, obj])
            }
            beakerBounds={beakerBounds}
          />

          {!reactionStarted &&
            placedMaterials.map((m, i) => (
              <group key={i} position={m.position}>
                <PlacedMaterial mat={m} />
              </group>
            ))}

          {reactionStarted && aiResult && beakerBounds && (
            <>
              <mesh position={[0, beakerBounds.bottomY + 0.45, 0.35]}>
                <sphereGeometry args={[0.18, 32, 32]} />
                <meshStandardMaterial
                  color="#00ff99"
                  transparent
                  opacity={0.95}
                />
              </mesh>

              <Text
                position={[0, beakerBounds.bottomY + 0.75, 0.35]}
                fontSize={0.1}
                color="black"
              >
                {aiResult.products}
              </Text>
            </>
          )}

        </Canvas>

      </div>

      <RightSidebar
        reactions={matchedReactions}
        selectedReaction={selectedReaction}
        reactionStarted={reactionStarted}
        aiResult={aiResult}
        onReactionChange={setSelectedReaction}
        onStartReaction={startReaction}
        onReset={resetLab}
      />

    </div>
  );
};

export default LabScene;