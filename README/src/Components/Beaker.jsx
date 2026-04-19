import React, { useMemo, useEffect, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Beaker = forwardRef(
  ({ position = [0, 0, 0], onReady, reactionStarted }, ref) => {
    const gltf = useGLTF("/models/lab/beaker.glb");
    const beaker = useMemo(() => gltf.scene.clone(), [gltf]);

    useEffect(() => {
      beaker.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: "#a8c8e8",
            transparent: true,
            opacity: reactionStarted ? 0.22 : 0.38,
            transmission: 0.85,
            roughness: 0.05,
            metalness: 0.0,
            thickness: 0.8,
            ior: 1.45,
            depthWrite: false,
          });
          child.renderOrder = 1;
        }
      });

      const box = new THREE.Box3().setFromObject(beaker);
      const totalH = box.max.y - box.min.y;

      // بنبني profile حقيقي للقارورة بنعدّي على كل الـ vertices
      // ونحسب أقصى radius في كل مستوى Y
      const SLICES = 40;
      const sliceRadii = new Array(SLICES).fill(0);

      beaker.traverse((child) => {
        if (!child.isMesh || !child.geometry) return;
        const pos = child.geometry.attributes.position;
        if (!pos) return;
        const mat = child.matrixWorld;
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i).applyMatrix4(mat);
          const normY = (v.y - box.min.y) / totalH;          // 0..1 من القاع للأعلى
          const sliceIdx = Math.min(SLICES - 1, Math.floor(normY * SLICES));
          const r = Math.sqrt(v.x * v.x + v.z * v.z);
          if (r > sliceRadii[sliceIdx]) sliceRadii[sliceIdx] = r;
        }
      });

      // نضبط أي slices فارغة بـ interpolation
      for (let i = 0; i < SLICES; i++) {
        if (sliceRadii[i] === 0) {
          const prev = i > 0 ? sliceRadii[i - 1] : 0;
          const next = sliceRadii.slice(i + 1).find((r) => r > 0) ?? prev;
          sliceRadii[i] = (prev + next) / 2;
        }
      }

      onReady?.({
        topY:        box.max.y,
        bottomY:     box.min.y,
        centerY:     (box.max.y + box.min.y) / 2,
        totalH,
        sliceRadii,            // ← profile كامل للقارورة
        innerRadius: Math.max(...sliceRadii) * 0.80,
      });
    }, [beaker, reactionStarted]);

    return (
      <primitive ref={ref} object={beaker} position={position} scale={[0.5, 0.5, 0.5]} />
    );
  }
);

export default Beaker;
