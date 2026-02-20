import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/* -------------------------------------------------------
   ELECTRONIC COMPONENTS — realistic PCB parts
   ------------------------------------------------------- */

function ElectrolyticCapacitor({ position, height = 0.5, radius = 0.12 }) {
  const y = 0.06;
  return (
    <group position={position}>
      <mesh position={[0, y + height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 20]} />
        <meshStandardMaterial color="#111111" metalness={0.15} roughness={0.55} />
      </mesh>
      <mesh position={[0, y + height, 0]}>
        <cylinderGeometry args={[radius * 0.92, radius * 0.92, 0.015, 20]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.92} roughness={0.12} />
      </mesh>
      <mesh position={[0, y + height + 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.25, radius * 0.45, 3]} />
        <meshStandardMaterial color="#777" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, y + height * 0.78, 0]}>
        <cylinderGeometry args={[radius + 0.002, radius + 0.002, height * 0.06, 20]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

function SMDCapacitor({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[0.08, 0.03, 0.05]} />
        <meshStandardMaterial color="#c4a55a" metalness={0.12} roughness={0.6} />
      </mesh>
      {[-0.035, 0.035].map((x, i) => (
        <mesh key={i} position={[x, 0.075, 0]}>
          <boxGeometry args={[0.012, 0.032, 0.052]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function SMDResistor({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.1, 0.025, 0.04]} />
        <meshStandardMaterial color="#222" metalness={0.1} roughness={0.65} />
      </mesh>
      {[-0.042, 0.042].map((x, i) => (
        <mesh key={i} position={[x, 0.07, 0]}>
          <boxGeometry args={[0.018, 0.027, 0.042]} />
          <meshStandardMaterial color="#888" metalness={0.85} roughness={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function ICChip({ position, width = 0.5, depth = 0.5, height = 0.07 }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2 + 0.06, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#141414" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[-width / 2 + 0.04, height + 0.061, -depth / 2 + 0.04]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#aaa" metalness={0.5} roughness={0.4} />
      </mesh>
      {[
        [-width / 2 - 0.013, 0, 0, 0.026, 0.004, depth * 0.88],
        [width / 2 + 0.013, 0, 0, 0.026, 0.004, depth * 0.88],
        [0, 0, -depth / 2 - 0.013, width * 0.88, 0.004, 0.026],
        [0, 0, depth / 2 + 0.013, width * 0.88, 0.004, 0.026],
      ].map(([x, _, z, w, h, d], i) => (
        <mesh key={i} position={[x, 0.06, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.92} roughness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function MOSFET({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.14]} />
        <meshStandardMaterial color="#141414" metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.062, -0.09]}>
        <boxGeometry args={[0.16, 0.004, 0.06]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.92} roughness={0.12} />
      </mesh>
    </group>
  );
}

function Inductor({ position, radius = 0.15 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[radius, radius, 0.1, 20]} />
        <meshStandardMaterial color="#252525" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.175, 0]}>
        <cylinderGeometry args={[radius * 0.6, radius * 0.6, 0.005, 16]} />
        <meshStandardMaterial color="#333" metalness={0.15} roughness={0.75} />
      </mesh>
    </group>
  );
}

function HeatSink({ position }) {
  const fins = useMemo(() => {
    const count = 14;
    const total = 1.05;
    const gap = total / count;
    return Array.from({ length: count }, (_, i) => -total / 2 + gap / 2 + i * gap);
  }, []);

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.15, 0.04, 1.15]} />
        <meshStandardMaterial color="#d2d2d2" metalness={0.9} roughness={0.2} />
      </mesh>
      {fins.map((x, i) => (
        <mesh key={i} position={[x, 0.22, 0]}>
          <boxGeometry args={[0.025, 0.4, 1.05]} />
          <meshStandardMaterial color="#d2d2d2" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function RAMSlot({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.9, 0.11, 0.1]} />
        <meshStandardMaterial color="#141414" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.165, 0]}>
        <boxGeometry args={[1.8, 0.02, 0.035]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.3} roughness={0.5} />
      </mesh>
      {[-0.95, 0.95].map((x, i) => (
        <mesh key={i} position={[x, 0.14, 0]}>
          <boxGeometry args={[0.07, 0.16, 0.12]} />
          <meshStandardMaterial color="#aaa" metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.075, 0.008]}>
        <boxGeometry args={[1.7, 0.05, 0.008]} />
        <meshStandardMaterial color="#DAA520" metalness={0.95} roughness={0.08} />
      </mesh>
    </group>
  );
}

function PCIeSlot({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.085, 0]}>
        <boxGeometry args={[1.8, 0.09, 0.09]} />
        <meshStandardMaterial color="#141414" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0.9, 0.11, 0]}>
        <boxGeometry args={[0.05, 0.12, 0.11]} />
        <meshStandardMaterial color="#aaa" metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

function IOPanel({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.08, 0.72, 1.5]} />
        <meshStandardMaterial color="#888" metalness={0.88} roughness={0.18} />
      </mesh>
      {[0.45, 0.15, -0.15, -0.45].map((z, i) => (
        <group key={i} position={[-0.02, 0.52 - i * 0.12, z]}>
          <mesh>
            <boxGeometry args={[0.06, 0.07, 0.2]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.25} roughness={0.5} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.04, 0.035, 0.16]} />
            <meshStandardMaterial color="#DAA520" metalness={0.95} roughness={0.08} />
          </mesh>
        </group>
      ))}
      <mesh position={[-0.02, 0.15, 0.45]}>
        <boxGeometry args={[0.06, 0.045, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.25} roughness={0.5} />
      </mesh>
      <mesh position={[-0.02, 0.15, -0.45]}>
        <boxGeometry args={[0.06, 0.045, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.25} roughness={0.5} />
      </mesh>
    </group>
  );
}

function M2Slot({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.072, 0]}>
        <boxGeometry args={[0.55, 0.05, 0.1]} />
        <meshStandardMaterial color="#141414" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0.34, 0.09, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

function CrystalOscillator({ position }) {
  return (
    <mesh position={[position[0], 0.08, position[2]]}>
      <boxGeometry args={[0.14, 0.04, 0.08]} />
      <meshStandardMaterial color="#b5b5b5" metalness={0.92} roughness={0.12} />
    </mesh>
  );
}

function CMOSBattery({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 20]} />
        <meshStandardMaterial color="#777" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.035, 20]} />
        <meshStandardMaterial color="#c5c5c5" metalness={0.82} roughness={0.18} />
      </mesh>
    </group>
  );
}

function PowerConnector({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.35, 0.2, 0.55]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.15} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.28, 0.14, 0.48]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  );
}

function LEDIndicator({ position, color = '#FFD700' }) {
  const matRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    matRef.current.emissiveIntensity = 0.5 + Math.sin(t * 2 + position[0] * 10) * 0.5;
  });
  return (
    <mesh position={[position[0], 0.075, position[2]]}>
      <boxGeometry args={[0.04, 0.025, 0.025]} />
      <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0.8} />
    </mesh>
  );
}

function CopperTrace({ start, end, width = 0.018 }) {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  return (
    <mesh
      position={[(start[0] + end[0]) / 2, 0.063, (start[2] + end[2]) / 2]}
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, 0.003, width]} />
      <meshStandardMaterial
        color="#B87333"
        metalness={0.92}
        roughness={0.25}
        emissive="#B87333"
        emissiveIntensity={0.02}
      />
    </mesh>
  );
}

function ViaHoles() {
  const positions = useMemo(() => {
    const pts = [];
    for (let x = -2.5; x <= 2.5; x += 0.55) {
      for (let z = -1.5; z <= 1.5; z += 0.6) {
        if (Math.abs(x + 0.5) < 0.9 && Math.abs(z) < 0.9) continue;
        if ((Math.round(x * 7) + Math.round(z * 7)) % 4 === 0) {
          pts.push([x, z]);
        }
      }
    }
    return pts;
  }, []);

  return (
    <>
      {positions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.066, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.012, 0.03, 8]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

/* -------------------------------------------------------
   FULL MOTHERBOARD ASSEMBLY
   ------------------------------------------------------- */

function Motherboard() {
  return (
    <group rotation={[0.12, 0, 0.04]}>
      {/* === PCB SUBSTRATE === */}
      <mesh>
        <boxGeometry args={[6.5, 0.12, 4.2]} />
        <meshStandardMaterial color="#0a1a0a" metalness={0.12} roughness={0.75} />
      </mesh>
      <mesh position={[0, -0.062, 0]}>
        <boxGeometry args={[6.3, 0.005, 4.0]} />
        <meshStandardMaterial color="#B87333" metalness={0.92} roughness={0.25} />
      </mesh>

      <ViaHoles />

      {[[-2.9, 1.8], [-2.9, -1.8], [2.9, 1.8], [2.9, -1.8], [0, 1.85], [0, -1.85]].map(
        ([x, z], i) => (
          <mesh key={i} position={[x, 0.066, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.055, 0.11, 16]} />
            <meshStandardMaterial color="#b0b0b0" metalness={0.92} roughness={0.15} side={THREE.DoubleSide} />
          </mesh>
        )
      )}

      {/* === CPU ZONE === */}
      <mesh position={[-0.5, 0.065, 0]}>
        <boxGeometry args={[1.5, 0.004, 1.5]} />
        <meshStandardMaterial color="#141414" metalness={0.2} roughness={0.6} />
      </mesh>
      <group position={[-0.5, 0, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.3, 0.06, 1.3]} />
          <meshStandardMaterial color="#1e3a0e" metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[1.1, 0.04, 1.1]} />
          <meshStandardMaterial color="#6e6e6e" metalness={0.94} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.171, 0]}>
          <boxGeometry args={[0.65, 0.001, 0.22]} />
          <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <HeatSink position={[-0.5, 0.17, 0]} />

      {/* === VRM ZONE === */}
      <ElectrolyticCapacitor position={[-2.3, 0, -0.8]} height={0.55} radius={0.13} />
      <ElectrolyticCapacitor position={[-2.3, 0, -0.4]} height={0.48} radius={0.12} />
      <ElectrolyticCapacitor position={[-2.3, 0, 0.0]} height={0.55} radius={0.13} />
      <ElectrolyticCapacitor position={[-2.3, 0, 0.4]} height={0.48} radius={0.12} />
      <ElectrolyticCapacitor position={[-2.3, 0, 0.8]} height={0.55} radius={0.13} />

      <MOSFET position={[-1.8, 0, -0.7]} />
      <MOSFET position={[-1.8, 0, -0.3]} />
      <MOSFET position={[-1.8, 0, 0.1]} />
      <MOSFET position={[-1.8, 0, 0.5]} />

      <Inductor position={[-2.65, 0, -0.55]} radius={0.14} />
      <Inductor position={[-2.65, 0, 0.05]} radius={0.13} />
      <Inductor position={[-2.65, 0, 0.65]} radius={0.14} />

      {/* === MEMORY ZONE === */}
      <RAMSlot position={[1.5, 0, -0.65]} />
      <RAMSlot position={[1.5, 0, 0.65]} />

      {/* === CHIPSET & SUPPORT ICs === */}
      <ICChip position={[0.8, 0, 1.4]} width={0.55} depth={0.55} height={0.065} />
      <ICChip position={[-1.6, 0, -1.5]} width={0.35} depth={0.35} height={0.05} />
      <ICChip position={[2.4, 0, 0.4]} width={0.4} depth={0.3} height={0.05} />
      <ICChip position={[2.4, 0, -0.4]} width={0.3} depth={0.28} height={0.045} />
      <ICChip position={[-0.3, 0, -1.6]} width={0.25} depth={0.25} height={0.04} />

      {/* === SMD CAPACITORS (decoupling) === */}
      {[
        [-1.25, -0.8], [-1.25, -0.55], [-1.25, 0.55], [-1.25, 0.8],
        [0.25, -0.8], [0.25, -0.55], [0.25, 0.55], [0.25, 0.8],
        [0.55, 1.2], [0.8, 1.2], [1.05, 1.2],
        [2.15, 0.2], [2.15, 0.55], [2.65, 0.2], [2.65, 0.55],
        [2.15, -0.2], [2.15, -0.55],
        [-0.5, -1.35], [-0.3, -1.35],
      ].map(([x, z], i) => (
        <SMDCapacitor key={`sc${i}`} position={[x, 0, z]} />
      ))}

      {/* === SMD RESISTORS === */}
      {[
        [[-1.5, -1.3], 0], [[-1.3, -1.3], 0], [[-1.1, -1.3], 0], [[-0.9, -1.3], 0],
        [[-1.5, 1.3], 0], [[-1.3, 1.3], 0], [[-1.1, 1.3], 0], [[-0.9, 1.3], 0],
        [[0.4, -1.75], Math.PI / 2], [[0.6, -1.75], Math.PI / 2], [[0.8, -1.75], Math.PI / 2],
        [[0.4, 1.75], Math.PI / 2], [[0.6, 1.75], Math.PI / 2], [[0.8, 1.75], Math.PI / 2],
        [[1.8, -1.4], 0], [[2.0, -1.4], 0],
        [[-2.8, -1.3], Math.PI / 2], [[-2.8, -1.1], Math.PI / 2],
      ].map(([[x, z], rot], i) => (
        <SMDResistor key={`sr${i}`} position={[x, 0, z]} rotation={[0, rot, 0]} />
      ))}

      {/* === EXPANSION SLOTS === */}
      <PCIeSlot position={[-0.2, 0, 1.65]} />

      {/* === M.2 SLOT === */}
      <M2Slot position={[1.3, 0, -1.5]} />

      {/* === I/O PANEL === */}
      <IOPanel position={[3.15, 0, 0]} />

      {/* === CRYSTAL OSCILLATOR === */}
      <CrystalOscillator position={[-0.6, 0, -1.65]} />

      {/* === CMOS BATTERY === */}
      <CMOSBattery position={[2.1, 0, -1.2]} />

      {/* === ATX POWER CONNECTOR === */}
      <PowerConnector position={[2.8, 0, -1.55]} />

      {/* === LED INDICATORS === */}
      <LEDIndicator position={[-2.85, 0, 1.75]} color="#FFD700" />
      <LEDIndicator position={[-2.65, 0, 1.75]} color="#00D4FF" />
      <LEDIndicator position={[-2.45, 0, 1.75]} color="#FFD700" />
      <LEDIndicator position={[-2.25, 0, 1.75]} color="#22C55E" />

      {/* === COPPER TRACES === */}
      <CopperTrace start={[0.2, 0, -0.3]} end={[0.5, 0, -0.65]} />
      <CopperTrace start={[0.2, 0, 0.3]} end={[0.5, 0, 0.65]} />
      <CopperTrace start={[-0.2, 0, 0.8]} end={[0.5, 0, 1.2]} />
      <CopperTrace start={[-1.55, 0, -0.5]} end={[-1.25, 0, -0.55]} />
      <CopperTrace start={[-1.55, 0, 0.0]} end={[-1.25, 0, 0.0]} />
      <CopperTrace start={[-1.55, 0, 0.5]} end={[-1.25, 0, 0.55]} />
      <CopperTrace start={[1.05, 0, 1.4]} end={[2.0, 0, 0.9]} />
      <CopperTrace start={[2.0, 0, 0.9]} end={[2.8, 0, 0.5]} />
      <CopperTrace start={[0.55, 0, 1.5]} end={[-0.2, 0, 1.65]} width={0.022} />
      <CopperTrace start={[-2.3, 0, -1.1]} end={[-2.3, 0, -0.8]} width={0.035} />
      <CopperTrace start={[-2.3, 0, 0.8]} end={[-2.3, 0, 1.1]} width={0.035} />
      <CopperTrace start={[0.15, 0, -0.5]} end={[2.1, 0, -0.4]} />
      <CopperTrace start={[-0.5, 0, -0.8]} end={[-1.4, 0, -1.5]} />
      <CopperTrace start={[1.3, 0, -1.25]} end={[1.8, 0, -1.4]} />
      <CopperTrace start={[-0.6, 0, -1.45]} end={[-0.6, 0, -1.65]} width={0.015} />
      <CopperTrace start={[0.8, 0, 1.65]} end={[1.3, 0, 1.4]} />

      {/* === SILKSCREEN LABELS === */}
      {[[-2.85, -1.55, 0.35, 0.12], [1.9, 1.55, 0.5, 0.12], [0.8, -1.9, 0.3, 0.08]].map(
        ([x, z, w, h], i) => (
          <mesh key={`silk${i}`} position={[x, 0.065, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w, h]} />
            <meshStandardMaterial
              color="#e0e0e0"
              metalness={0}
              roughness={1}
              transparent
              opacity={0.22}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      )}
    </group>
  );
}

/* -------------------------------------------------------
   SCENE — lighting, env, post-processing
   ------------------------------------------------------- */

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight
        position={[4, 8, 3]}
        intensity={2.0}
        angle={0.5}
        penumbra={0.8}
        castShadow
      />
      <pointLight position={[-5, 4, -3]} intensity={0.6} color="#e8e0d0" distance={20} />
      <pointLight position={[0, -2, 5]} intensity={0.25} color="#00D4FF" distance={15} />
      <pointLight position={[-2, -1, -3]} intensity={0.18} color="#FFD700" distance={12} />

      <Motherboard />

      <ContactShadows position={[0, -1.2, 0]} opacity={0.35} scale={14} blur={2.2} far={4.5} />

      <Environment preset="studio" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />

      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.8} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </>
  );
}

/* -------------------------------------------------------
   SECTION WRAPPER
   ------------------------------------------------------- */

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-2 border-caution-yellow border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-tech uppercase tracking-widest text-caution-yellow">
          Loading Hardware...
        </span>
      </div>
    </div>
  );
}

const FutureTech3D = () => {
  return (
    <section className="relative min-h-screen bg-tactical-black flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-overlay" />

      <motion.div
        className="absolute top-10 left-20 w-64 h-64 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, #00D4FF, transparent)', opacity: 0.03 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-80 h-80 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, #FFD700, transparent)', opacity: 0.03 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="text-center z-10 px-4 mb-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-flex items-center px-4 py-2 rounded-full border border-caution-yellow border-opacity-50 text-xs font-tech uppercase tracking-widest text-caution-yellow mb-4">
          ⚡ Precision Electronics
        </span>
        <h2 className="text-3xl md:text-5xl font-tech font-bold text-stainless-steel">
          <span className="neon-text">ENGINEERED</span> TO PERFECTION
        </h2>
        <p className="text-stainless-steel text-sm md:text-base mt-3 max-w-2xl mx-auto opacity-70">
          Every trace, component, and connection&mdash;designed for absolute
          reliability in aerospace, defense, and next-generation electronics.
        </p>
      </motion.div>

      <motion.div
        className="w-[70%] relative z-10"
        style={{ height: '65vh' }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{ position: [4, 5, 6], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </motion.div>
    </section>
  );
};

export default FutureTech3D;
