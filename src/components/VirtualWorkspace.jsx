
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  ContactShadows,
  Environment,
} from "@react-three/drei";

function WorkspaceScene() {
  const sceneRef = useRef(null);
  const monitorRef = useRef(null);

  useFrame((state) => {
    if (!sceneRef.current) return;

    const targetX = state.pointer.y * 0.08;
    const targetY = state.pointer.x * 0.12;

    sceneRef.current.rotation.x +=
      (targetX - sceneRef.current.rotation.x) * 0.04;

    sceneRef.current.rotation.y +=
      (targetY - sceneRef.current.rotation.y) * 0.04;
  });

  return (
    <group ref={sceneRef}>
      {/* DESK TOP */}
      <mesh position={[0, -1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.8, 0.18, 2.8]} />
        <meshStandardMaterial color="#242424" roughness={0.35} />
      </mesh>

      {/* DESK LEGS */}
      {[-2.45, 2.45].map((x) => (
        <mesh key={x} position={[x, -2.05, 0]} castShadow>
          <boxGeometry args={[0.16, 1.5, 0.16]} />
          <meshStandardMaterial color="#444444" metalness={0.7} />
        </mesh>
      ))}

      {/* MONITOR STAND */}
      <mesh position={[0, -0.95, -0.55]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.35]} />
        <meshStandardMaterial color="#777777" metalness={0.8} />
      </mesh>

      <mesh position={[0, -0.7, -0.55]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.65]} />
        <meshStandardMaterial color="#555555" metalness={0.7} />
      </mesh>

      {/* MONITOR BODY */}
      <group ref={monitorRef} position={[0, 0.15, -0.65]}>
        <mesh castShadow>
          <boxGeometry args={[3.5, 2.15, 0.16]} />
          <meshStandardMaterial
            color="#161616"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        {/* SCREEN */}
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[3.28, 1.92]} />
          <meshBasicMaterial color="#090B10" />
        </mesh>

        {/* SCREEN HEADER */}
        <mesh position={[-1.25, 0.78, 0.105]}>
          <boxGeometry args={[0.55, 0.07, 0.01]} />
          <meshBasicMaterial color="#E53945" />
        </mesh>

        {/* SCREEN CODE LINES */}
        {Array.from({ length: 7 }).map((_, i) => (
          <group key={i}>
            <mesh
              position={[-1.05 + (i % 2) * 0.08, 0.43 - i * 0.19, 0.11]}
            >
              <boxGeometry args={[1.1 + (i % 3) * 0.2, 0.035, 0.01]} />
              <meshBasicMaterial
                color={i % 3 === 0 ? "#E53945" : i % 3 === 1 ? "#7777AA" : "#D0D0D0"}
              />
            </mesh>

            <mesh position={[0.55, 0.43 - i * 0.19, 0.11]}>
              <boxGeometry args={[0.65 + (i % 2) * 0.3, 0.035, 0.01]} />
              <meshBasicMaterial color="#555B68" />
            </mesh>
          </group>
        ))}

        {/* SCREEN GLOW */}
        <pointLight
          position={[0, 0, 0.6]}
          color="#E53945"
          intensity={0.7}
          distance={3}
        />
      </group>

      {/* KEYBOARD */}
      <mesh position={[0, -1.08, 0.55]} castShadow>
        <boxGeometry args={[2.15, 0.09, 0.65]} />
        <meshStandardMaterial color="#101010" metalness={0.5} />
      </mesh>

      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 13 }).map((__, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[
              -0.95 + col * 0.158,
              -1.025,
              0.32 + row * 0.14,
            ]}
          >
            <boxGeometry args={[0.11, 0.025, 0.09]} />
            <meshStandardMaterial
              color={row === 0 && col === 0 ? "#E53945" : "#454545"}
              emissive={row === 0 && col === 0 ? "#E53945" : "#000000"}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))
      )}

      {/* MOUSE */}
      <mesh position={[1.65, -1.08, 0.5]} castShadow>
        <sphereGeometry args={[0.19, 24, 16]} />
        <meshStandardMaterial color="#292929" roughness={0.35} />
      </mesh>

      {/* COFFEE CUP */}
      <mesh position={[-2, -0.88, 0.65]} castShadow>
        <cylinderGeometry args={[0.17, 0.15, 0.42, 24]} />
        <meshStandardMaterial color="#E53945" roughness={0.3} />
      </mesh>

      {/* DESK DECORATION */}
      <mesh position={[2.2, -0.88, -0.6]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.45, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* FLOATING RED ACCENT */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[2.25, 1.55, -0.3]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color="#E53945"
            emissive="#E53945"
            emissiveIntensity={1.8}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function VirtualWorkspace() {
  return (
    <div className="relative h-[350px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#080808] sm:h-[450px] md:h-[540px]">
      <div className="pointer-events-none absolute left-5 top-5 z-10">
        <p className="text-[10px] tracking-[3px] text-[#E53945]">
          PM / DEVELOPER STUDIO
        </p>
        <p className="mt-2 text-xs text-white/50">
          Interactive workspace · Drag to explore
        </p>
      </div>

      <Canvas
        camera={{ position: [5, 3.2, 7], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[4, 6, 5]}
          intensity={2}
          castShadow
        />
        <pointLight position={[-3, 2, 2]} color="#E53945" intensity={1.5} />

        <WorkspaceScene />

        <ContactShadows
          position={[0, -2.85, 0]}
          opacity={0.45}
          scale={9}
          blur={2.5}
        />

        <Environment preset="city" />

        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={10}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 2}
          target={[0, -0.3, 0]}
        />
      </Canvas>
    </div>
  );
}
