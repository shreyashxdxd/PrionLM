import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function DNAHelix() {
  const groupRef = useRef();

  const dna = useMemo(() => {
    const points = 180;
    const height = 10;
    const radius = 1.7;
    const turns = 3.2;

    const strandA = [];
    const strandB = [];
    const basePairs = [];

    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);

      const y = (t - 0.5) * height;
      const angle = t * Math.PI * 2 * turns;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      strandA.push(new THREE.Vector3(x1, y, z1));
      strandB.push(new THREE.Vector3(x2, y, z2));

      if (i % 6 === 0) {
        const start = new THREE.Vector3(x1, y, z1);
        const end = new THREE.Vector3(x2, y, z2);

        const direction = new THREE.Vector3()
          .subVectors(end, start);

        const length = direction.length();

        const midpoint = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5);

        basePairs.push({
          position: midpoint,
          direction,
          length,
        });
      }
    }

    return {
      strandA,
      strandB,
      basePairs,
    };
  }, []);

  const particles = useMemo(() => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.2 + Math.random() * 2.5;

      positions[i * 3] =
        Math.cos(angle) * radius;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 11;

      positions[i * 3 + 2] =
        Math.sin(angle) * radius;
    }

    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Current rotation speed
    groupRef.current.rotation.y += delta * 0.10;

    // Very subtle floating movement
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
  });

  return (
    <group
      ref={groupRef}
      rotation={[0.08, 0, -0.12]}
    >

      {/* -----------------------------------------
          DNA STRAND A
      ----------------------------------------- */}

      <mesh>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3(dna.strandA),
            320,
            0.07,
            12,
            false,
          ]}
        />

        <meshStandardMaterial
          color="#c8d0dc"
          roughness={0.25}
          metalness={0.35}
          emissive="#168cff"
          emissiveIntensity={0.28}
        />
      </mesh>


      {/* -----------------------------------------
          DNA STRAND B
      ----------------------------------------- */}

      <mesh>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3(dna.strandB),
            320,
            0.07,
            12,
            false,
          ]}
        />

        <meshStandardMaterial
          color="#ffffff"
          roughness={0.22}
          metalness={0.3}
          emissive="#168cff"
          emissiveIntensity={0.24}
        />
      </mesh>


      {/* -----------------------------------------
          BASE PAIRS
      ----------------------------------------- */}

      {dna.basePairs.map((pair, index) => {
        const quaternion = new THREE.Quaternion();

        quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          pair.direction.clone().normalize()
        );

        return (
          <mesh
            key={index}
            position={pair.position}
            quaternion={quaternion}
          >
            <cylinderGeometry
              args={[
                0.032,
                0.032,
                pair.length,
                10,
              ]}
            />

            <meshStandardMaterial
              color="#8fa1b5"
              emissive="#168cff"
              emissiveIntensity={0.18}
              transparent
              opacity={0.65}
              roughness={0.35}
            />
          </mesh>
        );
      })}


      {/* -----------------------------------------
          ATMOSPHERIC PARTICLES
      ----------------------------------------- */}

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          color="#168cff"
          size={0.045}
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>

    </group>
  );
}


export default function DNAAnimation() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 13],
        fov: 42,
      }}

      gl={{
        antialias: true,
        alpha: true,
      }}

      dpr={[1, 2]}
    >

      {/* Base illumination */}
      <ambientLight intensity={0.3} />


      {/* White dimensional light */}
      <directionalLight
        position={[4, 5, 6]}
        intensity={2}
        color="#ffffff"
      />


      {/* Main Ocean Blue light */}
      <pointLight
        position={[2, 1, 4]}
        intensity={5}
        distance={12}
        color="#168cff"
      />


      {/* Secondary blue light */}
      <pointLight
        position={[-3, -2, 2]}
        intensity={2.5}
        distance={10}
        color="#168cff"
      />


      {/* Cool white rim */}
      <pointLight
        position={[4, 0, -4]}
        intensity={1.5}
        distance={10}
        color="#ffffff"
      />


      <DNAHelix />

    </Canvas>
  );
}