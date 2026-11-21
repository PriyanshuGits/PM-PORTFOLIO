import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars, ContactShadows } from "@react-three/drei";

function WorldObject({ position, color, type, label, selected, onSelect }) {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.35;

    const targetScale = selected ? 1.3 : 1;
    meshRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale },
      0.08
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        position={position}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(label);
        }}
      >
        {type === "torus" ? (
          <torusGeometry args={[0.7, 0.18, 16, 80]} />
        ) : type === "octahedron" ? (
          <octahedronGeometry args={[0.85]} />
        ) : (
          <icosahedronGeometry args={[0.85, 1]} />
        )}

        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.22}
          emissive={color}
          emissiveIntensity={selected ? 0.8 : 0.25}
        />
      </mesh>
    </Float>
  );
}

function EnergyShader() {
  const materialRef = useRef(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;

      gl_Position = projectionMatrix *
        modelViewMatrix *
        vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 centered = vUv - 0.5;

      float distanceFromCenter = length(centered);

      float wave = sin(
        distanceFromCenter * 35.0 - uTime * 2.5
      );

      float rings = smoothstep(
        0.35,
        0.9,
        wave
      );

      float glow = exp(-distanceFromCenter * 5.0);

      float pulse = 0.5 + 0.5 * sin(uTime * 2.0);

      vec3 red = vec3(0.9, 0.08, 0.12);

      vec3 color = red * (
        rings * 0.35 +
        glow * (0.15 + pulse * 0.2)
      );

      float alpha = (
        rings * 0.35 +
        glow * 0.45
      );

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.43, 0]}>
      <planeGeometry args={[9, 9, 1, 1]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
        side={2}
      />
    </mesh>
  );
}

function WorldScene({ selected, setSelected }) {
  return (
    <>
      <color attach="background" args={["#080808"]} />
      <fog attach="fog" args={["#080808", 10, 22]} />

      <ambientLight intensity={0.7} />
      <pointLight position={[3, 4, 4]} intensity={35} color="#E53945" />
      <pointLight position={[-4, 2, -3]} intensity={25} color="#ffffff" />

      <Stars radius={35} depth={30} count={400} factor={2} fade speed={0.5} />

      <WorldObject
        position={[-2.3, 0.3, 0]}
        color="#E53945"
        type="icosahedron"
        label="Creativity"
        selected={selected === "Creativity"}
        onSelect={setSelected}
      />

      <WorldObject
        position={[0, 1.1, -1]}
        color="#ffffff"
        type="torus"
        label="Technology"
        selected={selected === "Technology"}
        onSelect={setSelected}
      />

      <WorldObject
        position={[2.3, 0.2, 0]}
        color="#E53945"
        type="octahedron"
        label="Innovation"
        selected={selected === "Innovation"}
        onSelect={setSelected}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#151515" metalness={0.6} roughness={0.7} />
      </mesh>

      <EnergyShader />

      <gridHelper
        args={[12, 24, "#E53945", "#292929"]}
        position={[0, -1.48, 0]}
      />

      <ContactShadows
        position={[0, -1.46, 0]}
        opacity={0.5}
        scale={12}
        blur={2}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function InteractiveWorld() {
  const [selected, setSelected] = useState("");

  return (
    <div className="interactive-world">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        dpr={1}
        gl={{
          antialias: false,
          powerPreference: "low-power",
          alpha: false,
          stencil: false,
          depth: true,
        }}
        onPointerMissed={() => setSelected("")}
      >
        <WorldScene selected={selected} setSelected={setSelected} />
      </Canvas>

      <div className="world-overlay">
        <span className="world-status">
          <span className="world-status-dot" />
          INTERACTIVE ENVIRONMENT
        </span>

        <p className="world-instruction">Drag to explore · Click an object</p>

        {selected && (
          <div className="world-selection">
            <span>YOU DISCOVERED</span>
            <strong>{selected}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
