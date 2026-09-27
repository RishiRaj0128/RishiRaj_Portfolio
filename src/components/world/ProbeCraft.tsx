"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { NETWORK_NODES, WORLD_BOUNDS, NetworkNodeDef } from "@/lib/world/worldTopology";
import { soundFx } from "@/lib/audio/soundFx";

interface ProbeCraftProps {
  onTelemetryUpdate: (telemetry: {
    position: [number, number, number];
    velocity: number;
    headingDeg: number;
    nearestNode: NetworkNodeDef | null;
    nearestDistance: number;
  }) => void;
  onDockTrigger: (node: NetworkNodeDef) => void;
  isDocked: boolean;
  dockedNodeId: string | null;
  teleportTarget: [number, number, number] | null;
  onTeleportComplete: () => void;
  touchControls: {
    thrust: number; // -1 to 1
    steer: number;  // -1 to 1
  };
}

export default function ProbeCraft({
  onTelemetryUpdate,
  onDockTrigger,
  isDocked,
  dockedNodeId,
  teleportTarget,
  onTeleportComplete,
  touchControls,
}: ProbeCraftProps) {
  const craftRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);
  const thrusterLightRef = useRef<THREE.PointLight>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);

  const { camera } = useThree();

  // Physics state
  const state = useRef({
    pos: new THREE.Vector3(0, 1.2, 0),
    vel: new THREE.Vector3(0, 0, 0),
    yaw: 0, // radians
    pitch: 0,
    roll: 0,
    speed: 0,
    lastNearestNodeId: null as string | null,
    dockDebounce: false,
  });

  // Keyboard input state
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Track if user moved
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in an input or console
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = true;
          setHasMoved(true);
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = true;
          setHasMoved(true);
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = true;
          setHasMoved(true);
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = true;
          setHasMoved(true);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle external teleportation (e.g. from dev console or fast-travel)
  useEffect(() => {
    if (teleportTarget) {
      state.current.pos.set(teleportTarget[0], teleportTarget[1] + 1.2, teleportTarget[2]);
      state.current.vel.set(0, 0, 0);
      state.current.speed = 0;
      onTeleportComplete();
    }
  }, [teleportTarget, onTeleportComplete]);

  // Trail particles geometry
  const trailParticleCount = 28;
  const { trailPositions, trailPoints } = useMemo(() => {
    const positions = new Float32Array(trailParticleCount * 3);
    for (let i = 0; i < trailParticleCount * 3; i++) {
      positions[i] = 0;
    }
    return { trailPositions: positions, trailPoints: positions };
  }, []);

  const trailIndex = useRef(0);

  // Main physics loop (60fps guaranteed)
  useFrame((stateThree, delta) => {
    if (!craftRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    const s = state.current;

    // If currently docked, dampen motion and position camera for viewing
    if (isDocked) {
      s.vel.multiplyScalar(0.85);
      s.speed = s.vel.length();

      // Gentle floating bob
      const hoverY = 1.2 + Math.sin(stateThree.clock.elapsedTime * 2.0) * 0.08;
      craftRef.current.position.set(s.pos.x, hoverY, s.pos.z);
      craftRef.current.rotation.set(0, s.yaw, 0);

      // Smooth camera alignment when docked
      const dockedNode = NETWORK_NODES.find((n) => n.id === dockedNodeId);
      if (dockedNode) {
        const targetCamPos = new THREE.Vector3(
          s.pos.x + Math.sin(s.yaw) * 6.5,
          s.pos.y + 3.2,
          s.pos.z + Math.cos(s.yaw) * 6.5
        );
        camera.position.lerp(targetCamPos, clampedDelta * 3.5);
        camera.lookAt(s.pos.x, s.pos.y + 0.8, s.pos.z);
      }
      return;
    }

    // Determine input forces (Keyboard + Touch)
    let thrustInput = 0;
    if (keys.current.forward) thrustInput += 1;
    if (keys.current.backward) thrustInput -= 0.6;
    if (touchControls.thrust !== 0) thrustInput += touchControls.thrust;

    let steerInput = 0;
    if (keys.current.left) steerInput += 1;
    if (keys.current.right) steerInput -= 1;
    if (touchControls.steer !== 0) steerInput += touchControls.steer;

    // Physics parameters (light hovercraft feel: drift, slight banking, no car traction)
    const turnRate = 2.8; // rad/s
    const maxThrust = 32.0;
    const drag = 0.94; // slight drift
    const bankFactor = 0.35; // roll into turns

    // Update yaw (heading)
    s.yaw += steerInput * turnRate * clampedDelta;

    // Compute forward vector based on yaw
    const forwardX = -Math.sin(s.yaw);
    const forwardZ = -Math.cos(s.yaw);

    // Apply thrust along forward vector
    if (thrustInput !== 0) {
      s.vel.x += forwardX * thrustInput * maxThrust * clampedDelta;
      s.vel.z += forwardZ * thrustInput * maxThrust * clampedDelta;
    }

    // Apply hover drag/damping
    s.vel.x *= Math.pow(drag, clampedDelta * 60);
    s.vel.z *= Math.pow(drag, clampedDelta * 60);

    // Soft world boundary repulsion
    const distFromOrigin = Math.sqrt(s.pos.x * s.pos.x + s.pos.z * s.pos.z);
    if (distFromOrigin > WORLD_BOUNDS.maxRadius) {
      const excess = distFromOrigin - WORLD_BOUNDS.maxRadius;
      const angle = Math.atan2(s.pos.z, s.pos.x);
      s.vel.x -= Math.cos(angle) * excess * WORLD_BOUNDS.repulsionForce;
      s.vel.z -= Math.sin(angle) * excess * WORLD_BOUNDS.repulsionForce;
    }

    // Update position
    s.pos.x += s.vel.x * clampedDelta;
    s.pos.z += s.vel.z * clampedDelta;
    s.speed = Math.sqrt(s.vel.x * s.vel.x + s.vel.z * s.vel.z);

    // Hover bobbing
    const hoverY = 1.2 + Math.sin(stateThree.clock.elapsedTime * 3.2) * 0.12;
    s.pos.y = hoverY;

    // Banking (roll) & pitch response
    const targetRoll = -steerInput * bankFactor * Math.min(1.0, s.speed / 8.0);
    const targetPitch = thrustInput * 0.12;

    s.roll = THREE.MathUtils.lerp(s.roll, targetRoll, clampedDelta * 8.0);
    s.pitch = THREE.MathUtils.lerp(s.pitch, targetPitch, clampedDelta * 8.0);

    // Apply transform to craft mesh
    craftRef.current.position.copy(s.pos);
    craftRef.current.rotation.set(s.pitch, s.yaw, s.roll, "YXZ");

    // Thruster visual & sound modulation
    const thrustNorm = Math.min(1.0, Math.max(0, thrustInput > 0 ? thrustInput : 0) + (s.speed / 25.0) * 0.5);
    soundFx.updateThruster(thrustNorm);

    if (thrusterRef.current) {
      thrusterRef.current.scale.set(
        1.0 + thrustNorm * 0.8,
        1.0 + thrustNorm * 1.5,
        1.0 + thrustNorm * 0.8
      );
    }
    if (thrusterLightRef.current) {
      thrusterLightRef.current.intensity = 0.5 + thrustNorm * 2.2;
    }

    // Core packet crystal subtle pulse
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(stateThree.clock.elapsedTime * 6) * 0.1;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Update thruster trail points
    if (trailRef.current) {
      const rearOffset = new THREE.Vector3(0, 0, 1.2).applyEuler(craftRef.current.rotation);
      const exhaustPos = s.pos.clone().add(rearOffset);

      const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
      const idx = (trailIndex.current % trailParticleCount) * 3;
      positions[idx] = exhaustPos.x;
      positions[idx + 1] = exhaustPos.y;
      positions[idx + 2] = exhaustPos.z;
      trailIndex.current++;
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Third-person chase camera controller
    const camDistance = 7.8;
    const camHeight = 3.6;
    const camTarget = new THREE.Vector3(
      s.pos.x - forwardX * camDistance,
      s.pos.y + camHeight,
      s.pos.z - forwardZ * camDistance
    );

    camera.position.lerp(camTarget, clampedDelta * 5.0);
    camera.lookAt(s.pos.x + forwardX * 2.2, s.pos.y + 0.6, s.pos.z + forwardZ * 2.2);

    // Node Proximity & Docking Detection
    let nearestNode: NetworkNodeDef | null = null;
    let minDistance = Infinity;

    for (const node of NETWORK_NODES) {
      const dx = s.pos.x - node.position[0];
      const dz = s.pos.z - node.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < minDistance) {
        minDistance = dist;
        nearestNode = node;
      }

      // Check proximity trigger for auto-docking
      if (dist <= node.dockingRadius) {
        if (!s.dockDebounce && s.lastNearestNodeId !== node.id) {
          s.dockDebounce = true;
          s.lastNearestNodeId = node.id;
          onDockTrigger(node);
          setTimeout(() => {
            s.dockDebounce = false;
          }, 800);
        }
      }
    }

    // Proximity ambient audio layering (ambient tone fades in within 35m)
    soundFx.updateNodeProximity(nearestNode ? nearestNode.id : null, minDistance);

    // Heading in degrees (0 - 360)
    const headingDeg = Math.round(((s.yaw * 180) / Math.PI + 360) % 360);

    // Telemetry callback to HUD
    onTelemetryUpdate({
      position: [parseFloat(s.pos.x.toFixed(1)), parseFloat(s.pos.y.toFixed(1)), parseFloat(s.pos.z.toFixed(1))],
      velocity: parseFloat(s.speed.toFixed(1)),
      headingDeg,
      nearestNode,
      nearestDistance: parseFloat(minDistance.toFixed(1)),
    });
  });

  return (
    <group>
      {/* 
        DATA-PACKET PROBE / DRONE (Strictly NOT a car/kart)
        Angular, aerodynamic data-packet craft with faceted metallic chassis,
        central glowing amber crystal payload, and rear thruster exhaust.
      */}
      <group ref={craftRef} position={[0, 1.2, 0]}>
        {/* Main Probe Chassis - Sleek angular prism */}
        <mesh castShadow>
          <coneGeometry args={[0.7, 1.8, 4]} />
          <meshStandardMaterial
            color="#171B22"
            roughness={0.35}
            metalness={0.7}
            wireframe={false}
          />
        </mesh>

        {/* Chassis Armor Plates / Facets */}
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.2, 1.6, 0.22]} />
          <meshStandardMaterial
            color="#1F242C"
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>

        {/* Port & Starboard Winglets */}
        <mesh position={[-0.85, 0.05, 0.2]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.55, 0.05, 0.7]} />
          <meshStandardMaterial color="#2D3440" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.85, 0.05, 0.2]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.55, 0.05, 0.7]} />
          <meshStandardMaterial color="#2D3440" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Central Glowing Data Crystal Payload */}
        <mesh ref={coreRef} position={[0, 0.18, 0]}>
          <octahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color="#C86D32"
            emissive="#C86D32"
            emissiveIntensity={1.4}
            roughness={0.1}
          />
        </mesh>

        {/* Rear Thruster Housing */}
        <mesh position={[0, 0, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.35, 8]} />
          <meshStandardMaterial color="#111317" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Thruster Flame / Exhaust Cone (Desaturated Amber, NOT neon) */}
        <mesh ref={thrusterRef} position={[0, 0, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 0.65, 8]} />
          <meshBasicMaterial color="#C86D32" transparent opacity={0.85} />
        </mesh>

        {/* Directional Thruster Light */}
        <pointLight
          ref={thrusterLightRef}
          position={[0, 0, 1.4]}
          color="#C86D32"
          distance={5}
          intensity={1.2}
        />
      </group>

      {/* Thruster Trail Particles */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#C86D32"
          size={0.14}
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
