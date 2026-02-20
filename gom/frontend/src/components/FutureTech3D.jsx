import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function CoreSphere() {
  const meshRef = useRef();
  const matRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    matRef.current.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.25;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          ref={matRef}
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.1}
          roughness={0}
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
}

function GimbalRing({ radius, tube, speed, axis, color, emissive, emissiveIntensity = 0.15 }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const rot = groupRef.current.rotation;
    if (axis === 'x') {
      rot.x = t * speed;
      rot.z = Math.sin(t * speed * 0.5) * 0.3;
    } else if (axis === 'y') {
      rot.y = t * speed;
      rot.x = Math.sin(t * speed * 0.3) * 0.2;
    } else {
      rot.z = t * speed;
      rot.y = Math.sin(t * speed * 0.4) * 0.15;
    }
  });

  const nodes = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const angle = (i / 4) * Math.PI * 2;
      return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
    });
  }, [radius]);

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[radius, tube, 16, 100]} />
        <meshStandardMaterial
          color={color}
          metalness={0.95}
          roughness={0.05}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[tube * 5, tube * 5, tube * 2.5]} />
          <meshStandardMaterial
            color="#222222"
            metalness={0.9}
            roughness={0.15}
            emissive={emissive}
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

function Satellite({ orbitRadius, orbitSpeed, shape, size, yOff }) {
  const ref = useRef();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const a = phase + t * orbitSpeed;
    ref.current.position.set(
      Math.cos(a) * orbitRadius,
      yOff + Math.sin(t * 0.5 + phase) * 0.15,
      Math.sin(a) * orbitRadius
    );
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <mesh ref={ref}>
      {shape === 'box' && <boxGeometry args={[size, size, size]} />}
      {shape === 'oct' && <octahedronGeometry args={[size * 0.7]} />}
      {shape === 'dod' && <dodecahedronGeometry args={[size * 0.6]} />}
      <meshStandardMaterial
        color="#1F1F1F"
        metalness={0.95}
        roughness={0.08}
        emissive="#00D4FF"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function Particles({ count = 300, radius = 3.5 }) {
  const ref = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const gold = new THREE.Color('#FFD700');
    const cyan = new THREE.Color('#00D4FF');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.5);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = Math.random() > 0.5 ? gold : cyan;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count, radius]);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function HexPlatform() {
  const ref = useRef();

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <group ref={ref} position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[2.2, 2.4, 0.08, 6]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.15}
          emissive="#FFD700"
          emissiveIntensity={0.03}
        />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <ringGeometry args={[1.8, 2.0, 6]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.8}
          roughness={0.2}
          emissive="#FFD700"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <ringGeometry args={[0.8, 0.85, 32]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function EnergyArcs({ count = 3 }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  const arcs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const curve = new THREE.EllipseCurve(
        0, 0,
        2.8 + i * 0.3, 2.5 + i * 0.2,
        0, Math.PI * (0.4 + Math.random() * 0.3),
        false, (i * Math.PI * 2) / count
      );
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, (Math.random() - 0.5) * 0.5, p.y))
      );
      return { geometry, rotation: [0, (i * Math.PI * 2) / count, Math.random() * 0.5 - 0.25] };
    });
  }, [count]);

  return (
    <group ref={groupRef}>
      {arcs.map((arc, i) => (
        <line key={i} geometry={arc.geometry} rotation={arc.rotation}>
          <lineBasicMaterial
            color={i % 2 === 0 ? '#FFD700' : '#00D4FF'}
            transparent
            opacity={0.15}
          />
        </line>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <spotLight
        position={[5, 8, 5]}
        intensity={1.5}
        angle={0.4}
        penumbra={0.8}
        castShadow
      />
      <pointLight position={[3, 2, 4]} intensity={0.8} color="#FFD700" distance={15} />
      <pointLight position={[-3, -1, 3]} intensity={0.4} color="#00D4FF" distance={12} />
      <pointLight position={[0, -3, -2]} intensity={0.3} color="#FFD700" distance={10} />

      <CoreSphere />

      <GimbalRing
        radius={1.1}
        tube={0.035}
        speed={0.4}
        axis="x"
        color="#C0C0C0"
        emissive="#FFD700"
        emissiveIntensity={0.15}
      />
      <GimbalRing
        radius={1.5}
        tube={0.025}
        speed={0.25}
        axis="y"
        color="#888888"
        emissive="#00D4FF"
        emissiveIntensity={0.12}
      />
      <GimbalRing
        radius={1.9}
        tube={0.02}
        speed={0.15}
        axis="z"
        color="#C0C0C0"
        emissive="#FFD700"
        emissiveIntensity={0.1}
      />

      <Satellite orbitRadius={2.5} orbitSpeed={0.3} shape="box" size={0.12} yOff={0.3} />
      <Satellite orbitRadius={2.3} orbitSpeed={-0.25} shape="oct" size={0.1} yOff={-0.2} />
      <Satellite orbitRadius={2.7} orbitSpeed={0.2} shape="dod" size={0.08} yOff={0.1} />
      <Satellite orbitRadius={2.1} orbitSpeed={-0.35} shape="box" size={0.09} yOff={-0.4} />
      <Satellite orbitRadius={2.6} orbitSpeed={0.15} shape="oct" size={0.11} yOff={0.5} />
      <Satellite orbitRadius={2.4} orbitSpeed={-0.18} shape="dod" size={0.07} yOff={-0.1} />

      <HexPlatform />
      <EnergyArcs count={4} />
      <Particles count={300} radius={3.5} />

      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.3}
        scale={12}
        blur={2.5}
        far={4}
        color="#FFD700"
      />

      <Environment preset="city" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />

      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-2 border-caution-yellow border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-tech uppercase tracking-widest text-caution-yellow">
          Initializing Core...
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
        style={{
          background: 'radial-gradient(circle, #00D4FF, transparent)',
          opacity: 0.03,
        }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, #FFD700, transparent)',
          opacity: 0.03,
        }}
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
        <span className="inline-flex items-center px-4 py-2 rounded-full border border-tech-blue border-opacity-50 text-xs font-tech uppercase tracking-widest text-tech-blue mb-4">
          ⚙ Engineering the Future
        </span>
        <h2 className="text-3xl md:text-5xl font-tech font-bold text-stainless-steel">
          <span className="neon-text">QUANTUM</span> PRECISION CORE
        </h2>
        <p className="text-stainless-steel text-sm md:text-base mt-3 max-w-2xl mx-auto opacity-70">
          Where advanced robotics, next-gen electronics, and material science
          converge&mdash;engineering the impossible at molecular precision.
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
            camera={{ position: [0, 1, 6], fov: 40 }}
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
