
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";

// FEATURE 17: REAL-TIME SHADER EFFECT
function EnergyShader() {
  const materialRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#E53945") },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh scale={[2.05, 2.05, 2.05]}>
      <sphereGeometry args={[1, 64, 64]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vPosition;
          varying vec3 vNormal;
          uniform float uTime;

          void main() {
            vPosition = position;
            vNormal = normal;

            vec3 pos = position;

            float wave = sin(
              position.y * 5.0 +
              position.x * 4.0 +
              uTime * 1.5
            );

            pos += normal * wave * 0.018;

            gl_Position = projectionMatrix *
              modelViewMatrix *
              vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;

          varying vec3 vPosition;
          varying vec3 vNormal;

          void main() {
            float wave = sin(
              vPosition.y * 8.0 +
              vPosition.x * 6.0 +
              uTime * 2.0
            );

            float glow = pow(
              1.0 - abs(dot(
                normalize(vNormal),
                vec3(0.0, 0.0, 1.0)
              )),
              2.0
            );

            float energy = smoothstep(
              0.25,
              0.95,
              wave * 0.5 + 0.5
            );

            vec3 color = mix(
              vec3(0.025, 0.025, 0.025),
              uColor,
              energy * 0.65 + glow * 0.5
            );

            float alpha = 0.12 + glow * 0.38 + energy * 0.12;

            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// FEATURE 19: INTERACTIVE PARTICLE SYSTEM
function InteractiveParticles() {
  const pointsRef = useRef(null);
  const { pointer } = useThree();

  const particleData = useMemo(() => {
    const count = 450;
    const positions = new Float32Array(count * 3);
    const originals = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const x = (Math.random() - 0.5) * 7;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 4;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originals[i3] = x;
      originals[i3 + 1] = y;
      originals[i3 + 2] = z;

      speeds[i] = 0.4 + Math.random() * 0.8;
    }

    return { positions, originals, speeds };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleData.speeds.length; i++) {
      const i3 = i * 3;
      const speed = particleData.speeds[i];

      const originalX = particleData.originals[i3];
      const originalY = particleData.originals[i3 + 1];
      const originalZ = particleData.originals[i3 + 2];

      const mouseX = pointer.x * 2.5;
      const mouseY = pointer.y * 2.5;

      const dx = originalX - mouseX;
      const dy = originalY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const influence = Math.max(0, 1 - distance / 2.5);

      positions[i3] =
        originalX +
        Math.sin(time * speed + i) * 0.12 +
        (dx / (distance + 0.1)) * influence * 0.35;

      positions[i3 + 1] =
        originalY +
        Math.cos(time * speed + i) * 0.12 +
        (dy / (distance + 0.1)) * influence * 0.35;

      positions[i3 + 2] =
        originalZ + Math.sin(time * speed + i) * 0.15;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.positions.length / 3}
          array={particleData.positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#E53945"
        size={0.025}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// FEATURES 12, 13, 14: CHARACTER EXPRESSIONS, BLINKING & EYE TRACKING
function Character() {
  const headRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const leftBrowRef = useRef(null);
  const rightBrowRef = useRef(null);

  const smileCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.23, -0.34, 0.91),
      new THREE.Vector3(-0.12, -0.43, 0.96),
      new THREE.Vector3(0, -0.46, 0.98),
      new THREE.Vector3(0.12, -0.43, 0.96),
      new THREE.Vector3(0.23, -0.34, 0.91),
    ]);
  }, []);

  const smileGeometry = useMemo(
    () => new THREE.TubeGeometry(smileCurve, 32, 0.025, 8, false),
    [smileCurve]
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (headRef.current) {
      headRef.current.rotation.y =
        Math.sin(time * 0.45) * 0.08 + state.pointer.x * 0.16;

      headRef.current.rotation.x =
        -state.pointer.y * 0.1 + Math.sin(time * 0.6) * 0.025;
    }

    const pupilX = state.pointer.x * 0.09;
    const pupilY = state.pointer.y * 0.07;

    [leftPupilRef, rightPupilRef].forEach((ref) => {
      if (ref.current) {
        ref.current.position.x = THREE.MathUtils.lerp(
          ref.current.position.x,
          pupilX,
          0.12
        );

        ref.current.position.y = THREE.MathUtils.lerp(
          ref.current.position.y,
          pupilY,
          0.12
        );
      }
    });

    const blinkCycle = time % 4.2;
    const blink = Math.max(
      0,
      1 - Math.abs(blinkCycle - 0.12) / 0.12
    );

    const eyeScale = Math.max(0.08, 1 - blink);

    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = eyeScale;
    }

    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = eyeScale;
    }

    const browMovement = Math.sin(time * 1.1) * 0.035;

    if (leftBrowRef.current) {
      leftBrowRef.current.position.y = 0.54 + browMovement;
    }

    if (rightBrowRef.current) {
      rightBrowRef.current.position.y = 0.54 + browMovement;
    }
  });

  return (
    <group scale={1.2} position={[0, 0.45, 0]}>
      <group ref={headRef} position={[0, 0.55, 0]}>
        <mesh scale={[1.12, 1.25, 0.82]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color="#292929"
            metalness={0.65}
            roughness={0.28}
          />
        </mesh>

        <mesh position={[0, -0.02, 0.69]} scale={[0.91, 0.98, 0.17]}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            color="#171717"
            metalness={0.35}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[0, 1.02, 0.18]} scale={[0.55, 0.12, 0.15]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#E53945"
            metalness={0.7}
            roughness={0.22}
            emissive="#E53945"
            emissiveIntensity={0.25}
          />
        </mesh>

        <group ref={leftEyeRef} position={[-0.38, 0.2, 0.82]}>
          <mesh scale={[0.23, 0.28, 0.12]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>

          <group ref={leftPupilRef} position={[0, 0, 0.105]}>
            <mesh scale={[0.105, 0.14, 0.07]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial
                color="#E53945"
                metalness={0.35}
                roughness={0.18}
              />
            </mesh>

            <mesh position={[0.025, 0.045, 0.055]} scale={0.025}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        </group>

        <group ref={rightEyeRef} position={[0.38, 0.2, 0.82]}>
          <mesh scale={[0.23, 0.28, 0.12]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>

          <group ref={rightPupilRef} position={[0, 0, 0.105]}>
            <mesh scale={[0.105, 0.14, 0.07]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial
                color="#E53945"
                metalness={0.35}
                roughness={0.18}
              />
            </mesh>

            <mesh position={[0.025, 0.045, 0.055]} scale={0.025}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        </group>

        <mesh
          ref={leftBrowRef}
          position={[-0.38, 0.54, 0.83]}
          rotation={[0, 0, 0.12]}
          scale={[0.27, 0.055, 0.07]}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#E53945" />
        </mesh>

        <mesh
          ref={rightBrowRef}
          position={[0.38, 0.54, 0.83]}
          rotation={[0, 0, -0.12]}
          scale={[0.27, 0.055, 0.07]}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#E53945" />
        </mesh>

        <mesh geometry={smileGeometry}>
          <meshStandardMaterial
            color="#E53945"
            emissive="#E53945"
            emissiveIntensity={0.35}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[-1.02, 0, 0.05]} scale={[0.16, 0.25, 0.2]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#E53945"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[1.02, 0, 0.05]} scale={[0.16, 0.25, 0.2]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#E53945"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      </group>

      <mesh position={[0, -0.88, 0]} scale={[0.35, 0.38, 0.32]}>
        <cylinderGeometry args={[0.65, 0.8, 1, 32]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, -1.65, 0]} scale={[0.82, 0.72, 0.48]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#202020"
          metalness={0.7}
          roughness={0.28}
        />
      </mesh>

      <mesh position={[0, -1.55, 0.44]} scale={[0.24, 0.24, 0.07]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#E53945"
          emissive="#E53945"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

// FEATURE 26: SCROLL-CONTROLLED 3D ANIMATION
function ScrollControlledScene({ scrollProgressRef, children }) {
  const sceneRef = useRef(null);

  useFrame((_, delta) => {
    if (!sceneRef.current) return;

    const progress = scrollProgressRef.current;

    const targetRotationY = progress * 0.85;
    const targetRotationX = progress * 0.16;
    const targetPositionY = -progress * 0.45;
    const targetScale = 1 - progress * 0.06;

    sceneRef.current.rotation.y = THREE.MathUtils.damp(
      sceneRef.current.rotation.y,
      targetRotationY,
      4,
      delta
    );

    sceneRef.current.rotation.x = THREE.MathUtils.damp(
      sceneRef.current.rotation.x,
      targetRotationX,
      4,
      delta
    );

    sceneRef.current.position.y = THREE.MathUtils.damp(
      sceneRef.current.position.y,
      targetPositionY,
      4,
      delta
    );

    const currentScale = sceneRef.current.scale.x;

    const nextScale = THREE.MathUtils.damp(
      currentScale,
      targetScale,
      4,
      delta
    );

    sceneRef.current.scale.setScalar(nextScale);
  });

  return <group ref={sceneRef}>{children}</group>;
}

// FLOATING RINGS
function FloatingRings() {
  const ringRef = useRef(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.2;

      ringRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }
  });

  return (
    <group ref={ringRef}>
      <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[2, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#E53945"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[1.65, 0.8, 0.2]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color="#E53945"
          emissive="#E53945"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const scrollProgressRef = useRef(0);

  // Track page scroll progress
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateScrollProgress = () => {
      if (reducedMotion.matches) {
        scrollProgressRef.current = 0;
        return;
      }

      const scrollRange = window.innerHeight * 2.2;

      const progress = THREE.MathUtils.clamp(
        window.scrollY / scrollRange,
        0,
        1
      );

      scrollProgressRef.current = progress;
    };

    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, {
      passive: true,
    });

    window.addEventListener("resize", updateScrollProgress);

    reducedMotion.addEventListener?.("change", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);

      reducedMotion.removeEventListener?.(
        "change",
        updateScrollProgress
      );
    };
  }, []);

  return (
    <div className="h-[360px] w-full sm:h-[430px] md:h-[500px] lg:h-[550px]">
      <Canvas
        dpr={1}
        gl={{
          antialias: false,
          powerPreference: "low-power",
          alpha: true,
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
        }}
      >
        <ambientLight intensity={0.8} />

        <directionalLight position={[4, 5, 5]} intensity={2.2} />

        <pointLight
          position={[-3, 1, 3]}
          color="#E53945"
          intensity={2.5}
        />

        <ScrollControlledScene scrollProgressRef={scrollProgressRef}>
          <EnergyShader />

          <InteractiveParticles />

          <Float
            speed={1.4}
            rotationIntensity={0.12}
            floatIntensity={0.25}
          >
            <Character />
          </Float>

          <FloatingRings />

          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.3}
            scale={6}
            blur={2}
          />
        </ScrollControlledScene>

        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
