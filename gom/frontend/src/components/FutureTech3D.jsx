import React, {
  useRef, useMemo, useState, useCallback,
  createContext, useContext, Suspense,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/* =========================================================
   CIRCUIT INTERACTION SYSTEM
   ========================================================= */

const CircuitCtx = createContext({ active: null, fire: () => {} });
const useCircuit = () => useContext(CircuitCtx);

const CIRCUIT_COLORS = {
  power: '#FFD700',
  data: '#00D4FF',
  clock: '#22C55E',
};

function ClickableZone({ circuit, hitbox = [0.6, 0.4, 0.6], children }) {
  const { fire, active } = useCircuit();
  const hovRef = useRef(false);
  const glowRef = useRef();
  const color = CIRCUIT_COLORS[circuit];

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const mat = glowRef.current.material;
    if (active === circuit) {
      mat.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
    } else if (hovRef.current) {
      mat.opacity += (0.25 - mat.opacity) * 0.15;
    } else {
      mat.opacity += (0 - mat.opacity) * 0.1;
    }
  });

  return (
    <group>
      <mesh
        onClick={(e) => { e.stopPropagation(); fire(circuit); }}
        onPointerOver={(e) => {
          e.stopPropagation();
          hovRef.current = true;
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          hovRef.current = false;
          document.body.style.cursor = 'auto';
        }}
        position={[0, hitbox[1] / 2, 0]}
      >
        <boxGeometry args={hitbox} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {children}
      <mesh ref={glowRef} position={[0, 0.068, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[hitbox[0] * 0.85, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   ANIMATED COPPER TRACE — traveling pulse on activation
   ========================================================= */

function AnimatedTrace({ start, end, width = 0.018, circuit, delay = 0 }) {
  const matRef = useRef();
  const { active } = useCircuit();
  const isOn = active === circuit;
  const cColor = useMemo(
    () => new THREE.Color(CIRCUIT_COLORS[circuit] || '#FFD700'),
    [circuit],
  );
  const baseC = useMemo(() => new THREE.Color('#B87333'), []);

  useFrame(({ clock }) => {
    const m = matRef.current;
    if (!m) return;
    if (isOn) {
      const wave = Math.pow(Math.max(0, Math.sin(clock.getElapsedTime() * 3 - delay * 1.5)), 2);
      m.emissiveIntensity = 0.03 + wave * 1.6;
      m.emissive.copy(baseC).lerp(cColor, wave);
    } else {
      m.emissiveIntensity += (0.02 - m.emissiveIntensity) * 0.06;
      m.emissive.lerp(baseC, 0.06);
    }
  });

  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const len = Math.sqrt(dx * dx + dz * dz);
  const ang = Math.atan2(dz, dx);

  return (
    <mesh
      position={[(start[0] + end[0]) / 2, 0.063, (start[2] + end[2]) / 2]}
      rotation={[0, -ang, 0]}
    >
      <boxGeometry args={[len, 0.003, width]} />
      <meshStandardMaterial
        ref={matRef}
        color="#B87333"
        metalness={0.92}
        roughness={0.25}
        emissive="#B87333"
        emissiveIntensity={0.02}
      />
    </mesh>
  );
}

/* =========================================================
   ELECTRONIC COMPONENTS — enhanced with more detail
   ========================================================= */

function ElectrolyticCapacitor({ position, height = 0.5, radius = 0.12 }) {
  const y = 0.06;
  return (
    <group position={position}>
      <mesh position={[0, y + 0.005, 0]}>
        <cylinderGeometry args={[radius + 0.005, radius + 0.005, 0.01, 20]} />
        <meshStandardMaterial color="#333" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, y + height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 20]} />
        <meshStandardMaterial color="#111" metalness={0.15} roughness={0.55} />
      </mesh>
      <mesh position={[radius * 0.7, y + height / 2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.008, height * 0.85, radius * 0.6]} />
        <meshStandardMaterial color="#888" metalness={0.1} roughness={0.8} />
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
        <meshStandardMaterial color="#aaa" metalness={0.5} roughness={0.35} />
      </mesh>
      {[-0.03, 0.03].map((x, i) => (
        <mesh key={i} position={[x, y - 0.015, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function SMDCapacitor({ position }) {
  return (
    <group position={position}>
      {[-0.035, 0.035].map((x, i) => (
        <mesh key={`p${i}`} position={[x, 0.062, 0]}>
          <boxGeometry args={[0.025, 0.002, 0.058]} />
          <meshStandardMaterial color="#B87333" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
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
      {[-0.042, 0.042].map((x, i) => (
        <mesh key={`p${i}`} position={[x, 0.062, 0]}>
          <boxGeometry args={[0.022, 0.002, 0.048]} />
          <meshStandardMaterial color="#B87333" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
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
      <mesh position={[0, 0.062, 0]}>
        <boxGeometry args={[width + 0.06, 0.002, depth + 0.06]} />
        <meshStandardMaterial color="#B87333" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, height / 2 + 0.06, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#141414" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, height + 0.061, 0]}>
        <boxGeometry args={[width * 0.65, 0.001, depth * 0.25]} />
        <meshStandardMaterial color="#222" metalness={0.15} roughness={0.8} />
      </mesh>
      <mesh position={[-width / 2 + 0.04, height + 0.062, -depth / 2 + 0.04]}>
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
      <mesh position={[0, 0.062, 0]}>
        <boxGeometry args={[0.22, 0.002, 0.22]} />
        <meshStandardMaterial color="#B87333" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.14]} />
        <meshStandardMaterial color="#141414" metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.062, -0.09]}>
        <boxGeometry args={[0.16, 0.004, 0.06]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.92} roughness={0.12} />
      </mesh>
      {[-0.05, 0, 0.05].map((x, i) => (
        <mesh key={i} position={[x, 0.063, 0.1]}>
          <boxGeometry args={[0.022, 0.004, 0.04]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.92} roughness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function Inductor({ position, radius = 0.15 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, radius + 0.02, 20]} />
        <meshStandardMaterial color="#B87333" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[radius, radius, 0.1, 20]} />
        <meshStandardMaterial color="#252525" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.175, 0]}>
        <torusGeometry args={[radius * 0.45, 0.012, 8, 16]} />
        <meshStandardMaterial color="#B87333" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.178, 0]}>
        <cylinderGeometry args={[radius * 0.3, radius * 0.3, 0.005, 16]} />
        <meshStandardMaterial color="#333" metalness={0.15} roughness={0.75} />
      </mesh>
    </group>
  );
}

function HeatSink({ position }) {
  const fins = useMemo(() => {
    const c = 14, t = 1.05, g = t / c;
    return Array.from({ length: c }, (_, i) => -t / 2 + g / 2 + i * g);
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
      {[[-0.5, -0.5], [-0.5, 0.5], [0.5, -0.5], [0.5, 0.5]].map(([x, z], i) => (
        <group key={i} position={[x, 0.43, z]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 8]} />
            <meshStandardMaterial color="#888" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.008, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.015, 6]} />
            <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
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
      <mesh position={[0.35, 0.065, 0]}>
        <boxGeometry args={[0.06, 0.13, 0.11]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.6} />
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
      <mesh position={[0, 0.065, 0.005]}>
        <boxGeometry args={[1.7, 0.04, 0.006]} />
        <meshStandardMaterial color="#DAA520" metalness={0.95} roughness={0.08} />
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
      <group position={[-0.02, 0.18, 0]}>
        <mesh>
          <boxGeometry args={[0.06, 0.08, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.25} roughness={0.5} />
        </mesh>
        {[[-0.03, 0.04, 0.1], [-0.03, 0.04, -0.07]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshStandardMaterial
              color={i === 0 ? '#22C55E' : '#F59E0B'}
              emissive={i === 0 ? '#22C55E' : '#F59E0B'}
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}
      </group>
      {[0.5, -0.5].map((z, i) => (
        <mesh key={i} position={[-0.02, 0.15, z]}>
          <boxGeometry args={[0.06, 0.045, 0.22]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.25} roughness={0.5} />
        </mesh>
      ))}
      <group position={[-0.02, 0.58, -0.55]}>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
          <meshStandardMaterial color="#22C55E" metalness={0.2} roughness={0.5} />
        </mesh>
      </group>
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
      <mesh position={[0, 0.062, 0]}>
        <boxGeometry args={[0.5, 0.003, 0.006]} />
        <meshStandardMaterial color="#DAA520" metalness={0.95} roughness={0.08} />
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
    <group position={position}>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.14, 0.04, 0.08]} />
        <meshStandardMaterial color="#b5b5b5" metalness={0.92} roughness={0.12} />
      </mesh>
      {[-0.04, 0.04].map((x, i) => (
        <mesh key={i} position={[x, 0.062, 0]}>
          <boxGeometry args={[0.015, 0.003, 0.02]} />
          <meshStandardMaterial color="#B87333" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function CMOSBattery({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.3, 20]} />
        <meshStandardMaterial color="#B87333" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 20]} />
        <meshStandardMaterial color="#777" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.035, 20]} />
        <meshStandardMaterial color="#c5c5c5" metalness={0.82} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.168, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.001, 16]} />
        <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.4} />
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
      {Array.from({ length: 12 }, (_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        return (
          <mesh
            key={i}
            position={[-0.04 + row * 0.08, 0.18, -0.18 + col * 0.072]}
          >
            <boxGeometry args={[0.025, 0.06, 0.025]} />
            <meshStandardMaterial color="#DAA520" metalness={0.95} roughness={0.08} />
          </mesh>
        );
      })}
    </group>
  );
}

function LEDIndicator({ position, color = '#FFD700', circuit }) {
  const matRef = useRef();
  const glowRef = useRef();
  const { active } = useCircuit();
  const lit = active === circuit;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const target = lit ? 2.5 : 0.4 + Math.sin(t * 2 + position[0] * 10) * 0.4;
    matRef.current.emissiveIntensity += (target - matRef.current.emissiveIntensity) * 0.12;
    glowRef.current.material.opacity += ((lit ? 0.35 : 0) - glowRef.current.material.opacity) * 0.1;
  });

  return (
    <group>
      <mesh position={[position[0], 0.075, position[2]]}>
        <boxGeometry args={[0.04, 0.025, 0.025]} />
        <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={glowRef} position={[position[0], 0.12, position[2]]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ViaHoles() {
  const pts = useMemo(() => {
    const arr = [];
    for (let x = -2.5; x <= 2.5; x += 0.55) {
      for (let z = -1.5; z <= 1.5; z += 0.6) {
        if (Math.abs(x + 0.5) < 0.9 && Math.abs(z) < 0.9) continue;
        if ((Math.round(x * 7) + Math.round(z * 7)) % 4 === 0) arr.push([x, z]);
      }
    }
    return arr;
  }, []);

  return (
    <>
      {pts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.066, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.012, 0.03, 8]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

/* =========================================================
   NEW COMPONENTS — pin headers, SATA, chipset HS, etc.
   ========================================================= */

function PinHeader({ position, rows = 2, cols = 5, rotation = [0, 0, 0] }) {
  const pins = useMemo(() => {
    const arr = [];
    const sp = 0.06;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        arr.push([r * sp - ((rows - 1) * sp) / 2, c * sp - ((cols - 1) * sp) / 2]);
    return arr;
  }, [rows, cols]);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.065, 0]}>
        <boxGeometry args={[rows * 0.06 + 0.02, 0.03, cols * 0.06 + 0.02]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.6} />
      </mesh>
      {pins.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.11, z]}>
          <boxGeometry args={[0.015, 0.07, 0.015]} />
          <meshStandardMaterial color="#DAA520" metalness={0.95} roughness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function SATAConnector({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.095, 0]}>
        <boxGeometry args={[0.1, 0.09, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.06, 0.04, 0.22]} />
        <meshStandardMaterial color="#DAA520" metalness={0.95} roughness={0.08} />
      </mesh>
    </group>
  );
}

function ChipsetHeatsink({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.6, 0.06, 0.6]} />
        <meshStandardMaterial color="#444" metalness={0.88} roughness={0.2} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-0.2 + i * 0.1, 0.1, 0]}>
          <boxGeometry args={[0.03, 0.1, 0.55]} />
          <meshStandardMaterial color="#444" metalness={0.88} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function SocketBracket({ position }) {
  const s = 1.55;
  return (
    <group position={position}>
      {[
        [-s / 2, 0.08, 0, 0.03, 0.06, s],
        [s / 2, 0.08, 0, 0.03, 0.06, s],
        [0, 0.08, -s / 2, s, 0.06, 0.03],
        [0, 0.08, s / 2, s, 0.06, 0.03],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#666" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function DebugLEDBar({ position }) {
  const { active } = useCircuit();
  const refs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((mat, i) => {
      if (!mat) return;
      if (active) {
        const wave = Math.max(0, Math.sin(t * 4 - i * 0.4));
        mat.emissiveIntensity = 0.3 + wave * 2.0;
      } else {
        mat.emissiveIntensity += (0.15 - mat.emissiveIntensity) * 0.08;
      }
    });
  });

  const colors = ['#EF4444', '#F59E0B', '#22C55E', '#00D4FF', '#FFD700', '#22C55E', '#00D4FF', '#FFD700'];
  return (
    <group position={position}>
      <mesh position={[0, 0.068, 0]}>
        <boxGeometry args={[0.06, 0.02, 0.52]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.6} />
      </mesh>
      {colors.map((c, i) => (
        <mesh key={i} position={[0, 0.08, -0.22 + i * 0.065]}>
          <boxGeometry args={[0.03, 0.012, 0.03]} />
          <meshStandardMaterial
            ref={(el) => { refs.current[i] = el; }}
            color={c}
            emissive={c}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   FULL MOTHERBOARD ASSEMBLY
   ========================================================= */

function Motherboard() {
  return (
    <group rotation={[0.12, 0, 0.04]}>
      {/* === PCB === */}
      <mesh>
        <boxGeometry args={[6.5, 0.12, 4.2]} />
        <meshStandardMaterial color="#0a1a0a" metalness={0.12} roughness={0.75} />
      </mesh>
      <mesh position={[0, -0.062, 0]}>
        <boxGeometry args={[6.3, 0.005, 4.0]} />
        <meshStandardMaterial color="#B87333" metalness={0.92} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.061, 0]}>
        <boxGeometry args={[6.48, 0.001, 4.18]} />
        <meshStandardMaterial color="#072007" metalness={0.08} roughness={0.9} />
      </mesh>

      <ViaHoles />

      {[[-2.9, 1.8], [-2.9, -1.8], [2.9, 1.8], [2.9, -1.8], [0, 1.85], [0, -1.85]].map(
        ([x, z], i) => (
          <mesh key={i} position={[x, 0.066, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.055, 0.11, 16]} />
            <meshStandardMaterial color="#b0b0b0" metalness={0.92} roughness={0.15} side={THREE.DoubleSide} />
          </mesh>
        ),
      )}

      {/* === CPU ZONE (clickable → data circuit) === */}
      <ClickableZone circuit="data" hitbox={[1.6, 0.8, 1.6]}>
        <SocketBracket position={[-0.5, 0, 0]} />
        <mesh position={[-0.5, 0.065, 0]}>
          <boxGeometry args={[1.5, 0.004, 1.5]} />
          <meshStandardMaterial color="#141414" metalness={0.2} roughness={0.6} />
        </mesh>
        <group position={[-0.5, 0, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[1.3, 0.06, 1.3]} />
            <meshStandardMaterial color="#1e3a0e" metalness={0.2} roughness={0.5} />
          </mesh>
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 6 }, (__, c) => (
              <mesh key={`bg${r}${c}`} position={[-0.35 + c * 0.14, 0.068, -0.35 + r * 0.14]}>
                <sphereGeometry args={[0.015, 4, 4]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.15} />
              </mesh>
            )),
          )}
          <mesh position={[0, 0.135, 0]}>
            <boxGeometry args={[1.15, 0.005, 1.15]} />
            <meshStandardMaterial color="#888" metalness={0.3} roughness={0.6} />
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
      </ClickableZone>

      {/* === VRM / POWER ZONE (clickable → power circuit) === */}
      <ClickableZone circuit="power" hitbox={[1.2, 0.8, 2.0]}>
        <group position={[-2.3, 0, 0]}>
          <ElectrolyticCapacitor position={[0, 0, -0.8]} height={0.55} radius={0.13} />
          <ElectrolyticCapacitor position={[0, 0, -0.4]} height={0.48} radius={0.12} />
          <ElectrolyticCapacitor position={[0, 0, 0.0]} height={0.55} radius={0.13} />
          <ElectrolyticCapacitor position={[0, 0, 0.4]} height={0.48} radius={0.12} />
          <ElectrolyticCapacitor position={[0, 0, 0.8]} height={0.55} radius={0.13} />
        </group>
        <group position={[-1.8, 0, 0]}>
          <MOSFET position={[0, 0, -0.7]} />
          <MOSFET position={[0, 0, -0.3]} />
          <MOSFET position={[0, 0, 0.1]} />
          <MOSFET position={[0, 0, 0.5]} />
        </group>
        <Inductor position={[-2.65, 0, -0.55]} radius={0.14} />
        <Inductor position={[-2.65, 0, 0.05]} radius={0.13} />
        <Inductor position={[-2.65, 0, 0.65]} radius={0.14} />
      </ClickableZone>

      {/* === POWER CONNECTOR (clickable → power circuit) === */}
      <ClickableZone circuit="power" hitbox={[0.5, 0.5, 0.7]}>
        <PowerConnector position={[2.8, 0, -1.55]} />
      </ClickableZone>

      {/* === CLOCK ZONE (clickable → clock circuit) === */}
      <ClickableZone circuit="clock" hitbox={[0.8, 0.4, 0.8]}>
        <CMOSBattery position={[2.1, 0, -1.2]} />
        <CrystalOscillator position={[-0.6, 0, -1.65]} />
      </ClickableZone>

      {/* === MEMORY === */}
      <RAMSlot position={[1.5, 0, -0.65]} />
      <RAMSlot position={[1.5, 0, 0.65]} />

      {/* === CHIPSET with heatsink === */}
      <ICChip position={[0.8, 0, 1.4]} width={0.55} depth={0.55} height={0.065} />
      <ChipsetHeatsink position={[0.8, 0.1, 1.4]} />

      {/* === SUPPORT ICs === */}
      <ICChip position={[-1.6, 0, -1.5]} width={0.35} depth={0.35} height={0.05} />
      <ICChip position={[2.4, 0, 0.4]} width={0.4} depth={0.3} height={0.05} />
      <ICChip position={[2.4, 0, -0.4]} width={0.3} depth={0.28} height={0.045} />
      <ICChip position={[-0.3, 0, -1.6]} width={0.25} depth={0.25} height={0.04} />

      {/* === SMD CAPACITORS === */}
      {[
        [-1.25, -0.8], [-1.25, -0.55], [-1.25, 0.55], [-1.25, 0.8],
        [0.25, -0.8], [0.25, -0.55], [0.25, 0.55], [0.25, 0.8],
        [0.55, 1.2], [0.8, 1.2], [1.05, 1.2],
        [2.15, 0.2], [2.15, 0.55], [2.65, 0.2], [2.65, 0.55],
        [2.15, -0.2], [2.15, -0.55],
        [-0.5, -1.35], [-0.3, -1.35],
        [1.4, 1.15], [1.4, 1.65],
        [-1.6, -1.2], [-1.6, -1.8],
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
        [[1.2, 1.0], Math.PI / 2], [[1.2, 0.8], Math.PI / 2],
        [[-0.7, 1.6], 0], [[-0.5, 1.6], 0],
      ].map(([[x, z], rot], i) => (
        <SMDResistor key={`sr${i}`} position={[x, 0, z]} rotation={[0, rot, 0]} />
      ))}

      {/* === EXPANSION / CONNECTORS === */}
      <PCIeSlot position={[-0.2, 0, 1.65]} />
      <M2Slot position={[1.3, 0, -1.5]} />
      <IOPanel position={[3.15, 0, 0]} />
      <SATAConnector position={[2.8, 0, 0.9]} />
      <SATAConnector position={[2.8, 0, 1.2]} />

      {/* === PIN HEADERS === */}
      <PinHeader position={[-2.8, 0, 1.3]} rows={2} cols={5} />
      <PinHeader position={[-2.0, 0, 1.65]} rows={1} cols={4} />
      <PinHeader position={[2.0, 0, 1.7]} rows={2} cols={5} />
      <PinHeader position={[0.5, 0, -1.9]} rows={1} cols={3} />
      <PinHeader position={[1.8, 0, -1.75]} rows={1} cols={4} />

      {/* === DEBUG LED BAR === */}
      <DebugLEDBar position={[-2.9, 0, 0.5]} />

      {/* === LED INDICATORS (circuit-aware) === */}
      <LEDIndicator position={[-2.85, 0, 1.75]} color="#FFD700" circuit="power" />
      <LEDIndicator position={[-2.65, 0, 1.75]} color="#00D4FF" circuit="data" />
      <LEDIndicator position={[-2.45, 0, 1.75]} color="#FFD700" circuit="power" />
      <LEDIndicator position={[-2.25, 0, 1.75]} color="#22C55E" circuit="clock" />

      {/* === ANIMATED COPPER TRACES — POWER CIRCUIT === */}
      <AnimatedTrace circuit="power" delay={0} start={[2.65, 0, -1.3]} end={[2.0, 0, -0.8]} width={0.035} />
      <AnimatedTrace circuit="power" delay={0.3} start={[-2.3, 0, -1.1]} end={[-2.3, 0, -0.8]} width={0.035} />
      <AnimatedTrace circuit="power" delay={0.4} start={[-2.3, 0, 0.8]} end={[-2.3, 0, 1.1]} width={0.035} />
      <AnimatedTrace circuit="power" delay={0.6} start={[-2.65, 0, -0.35]} end={[-2.3, 0, -0.4]} />
      <AnimatedTrace circuit="power" delay={0.7} start={[-2.65, 0, 0.25]} end={[-2.3, 0, 0.4]} />
      <AnimatedTrace circuit="power" delay={0.8} start={[-2.65, 0, 0.85]} end={[-2.3, 0, 0.8]} />
      <AnimatedTrace circuit="power" delay={1.0} start={[-1.55, 0, -0.5]} end={[-1.25, 0, -0.55]} />
      <AnimatedTrace circuit="power" delay={1.2} start={[-1.55, 0, 0.0]} end={[-1.25, 0, 0.0]} />
      <AnimatedTrace circuit="power" delay={1.4} start={[-1.55, 0, 0.5]} end={[-1.25, 0, 0.55]} />

      {/* === ANIMATED COPPER TRACES — DATA CIRCUIT === */}
      <AnimatedTrace circuit="data" delay={0} start={[0.2, 0, -0.3]} end={[0.5, 0, -0.65]} />
      <AnimatedTrace circuit="data" delay={0.1} start={[0.3, 0, -0.4]} end={[1.0, 0, -0.55]} />
      <AnimatedTrace circuit="data" delay={0.2} start={[0.2, 0, 0.3]} end={[0.5, 0, 0.65]} />
      <AnimatedTrace circuit="data" delay={0.25} start={[0.3, 0, 0.4]} end={[1.0, 0, 0.55]} />
      <AnimatedTrace circuit="data" delay={0.5} start={[-0.2, 0, 0.8]} end={[0.5, 0, 1.2]} />
      <AnimatedTrace circuit="data" delay={0.6} start={[-0.5, 0, -0.8]} end={[-1.4, 0, -1.5]} />
      <AnimatedTrace circuit="data" delay={0.7} start={[0.8, 0, 1.65]} end={[1.3, 0, 1.4]} />
      <AnimatedTrace circuit="data" delay={0.8} start={[0.55, 0, 1.5]} end={[-0.2, 0, 1.65]} width={0.022} />
      <AnimatedTrace circuit="data" delay={1.0} start={[1.05, 0, 1.4]} end={[2.0, 0, 0.9]} />
      <AnimatedTrace circuit="data" delay={1.2} start={[0.15, 0, -0.5]} end={[2.1, 0, -0.4]} />
      <AnimatedTrace circuit="data" delay={1.5} start={[2.0, 0, 0.9]} end={[2.8, 0, 0.5]} />

      {/* === ANIMATED COPPER TRACES — CLOCK CIRCUIT === */}
      <AnimatedTrace circuit="clock" delay={0} start={[2.1, 0, -1.05]} end={[1.3, 0, -1.25]} />
      <AnimatedTrace circuit="clock" delay={0.3} start={[-0.6, 0, -1.45]} end={[-0.6, 0, -1.65]} width={0.015} />
      <AnimatedTrace circuit="clock" delay={0.5} start={[1.3, 0, -1.25]} end={[1.8, 0, -1.4]} />
      <AnimatedTrace circuit="clock" delay={0.8} start={[-0.3, 0, -1.35]} end={[-0.5, 0, -0.8]} />

      {/* === SILKSCREEN === */}
      {[
        [-2.85, -1.55, 0.35, 0.12], [1.9, 1.55, 0.5, 0.12],
        [0.8, -1.9, 0.3, 0.08], [-0.5, 0.9, 0.15, 0.06],
        [2.4, -0.7, 0.2, 0.06],
      ].map(([x, z, w, h], i) => (
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
      ))}

      {/* === EDGE PLATING === */}
      {[
        [0, 0.0, -2.1, 6.5, 0.12, 0.008],
        [0, 0.0, 2.1, 6.5, 0.12, 0.008],
        [-3.25, 0.0, 0, 0.008, 0.12, 4.2],
        [3.25, 0.0, 0, 0.008, 0.12, 4.2],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`edge${i}`} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#B87333" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   SCENE
   ========================================================= */

function SceneInner({ activeCircuit, fire }) {
  return (
    <CircuitCtx.Provider value={{ active: activeCircuit, fire }}>
      <ambientLight intensity={0.2} />
      <spotLight position={[4, 8, 3]} intensity={2.0} angle={0.5} penumbra={0.8} castShadow />
      <pointLight position={[-5, 4, -3]} intensity={0.6} color="#e8e0d0" distance={20} />
      <pointLight position={[0, -2, 5]} intensity={0.25} color="#00D4FF" distance={15} />
      <pointLight position={[-2, -1, -3]} intensity={0.18} color="#FFD700" distance={12} />

      <Motherboard />

      <ContactShadows position={[0, -1.2, 0]} opacity={0.35} scale={14} blur={2.2} far={4.5} />
      <Environment preset="studio" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!activeCircuit}
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />

      <EffectComposer>
        <Bloom
          intensity={activeCircuit ? 0.6 : 0.3}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </CircuitCtx.Provider>
  );
}

/* =========================================================
   SECTION WRAPPER
   ========================================================= */

const CIRCUIT_LABELS = {
  power: { text: 'POWER DELIVERY PATH', color: '#FFD700' },
  data: { text: 'DATA BUS ARCHITECTURE', color: '#00D4FF' },
  clock: { text: 'CLOCK SIGNAL NETWORK', color: '#22C55E' },
};

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
  const [activeCircuit, setActiveCircuit] = useState(null);
  const timerRef = useRef(null);

  const fire = useCallback((circuit) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveCircuit(circuit);
    timerRef.current = setTimeout(() => setActiveCircuit(null), 4500);
  }, []);

  const label = activeCircuit ? CIRCUIT_LABELS[activeCircuit] : null;

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
        {label && (
          <motion.div
            key={activeCircuit}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-5 py-2 rounded-full border text-xs font-tech uppercase tracking-widest backdrop-blur-sm"
            style={{ borderColor: label.color, color: label.color, background: 'rgba(10,10,10,0.7)' }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {label.text}
          </motion.div>
        )}

        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{ position: [4, 5, 6], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
          >
            <SceneInner activeCircuit={activeCircuit} fire={fire} />
          </Canvas>
        </Suspense>

        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-tech uppercase tracking-widest text-stainless-steel opacity-40 whitespace-nowrap z-10">
          Click on components to visualize circuit paths
        </p>
      </motion.div>
    </section>
  );
};

export default FutureTech3D;