import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DnaBackgroundProps {
  speed?: number;
  opacity?: number;
}

export const DnaBackground: React.FC<DnaBackgroundProps> = ({
  speed = 1.0,
  opacity = 0.85,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Three.js Scene
    const scene = new THREE.Scene();

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 48);

    // High performance WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Realistic Lighting setup for unified single-color biomolecule
    const ambientLight = new THREE.AmbientLight(0x0a1626, 3.0);
    scene.add(ambientLight);

    // Main key light with single cyan-teal tone
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    keyLight.position.set(25, 30, 30);
    scene.add(keyLight);

    // Rim light from opposite side for depth & 3D curvature
    const rimLight = new THREE.DirectionalLight(0x0284c7, 2.2);
    rimLight.position.set(-25, -20, -20);
    scene.add(rimLight);

    // Soft point light at center
    const centerGlow = new THREE.PointLight(0x38bdf8, 1.8, 60);
    centerGlow.position.set(0, 0, 10);
    scene.add(centerGlow);

    // DNA Root Object
    const dnaGroup = new THREE.Group();
    // Tilt the helix slightly for an authentic 3D spatial perspective
    dnaGroup.rotation.z = 0.22;
    dnaGroup.rotation.x = 0.12;
    scene.add(dnaGroup);

    // UNIFIED SINGLE-COLOR SPECIFICATION
    // Clean, realistic molecular cyan-teal hue as seen in cryo-EM & PDB surface density maps
    const baseColor = new THREE.Color(0x38bdf8); // Sky / Soft Cyan

    const realisticBioMaterial = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.28,
      metalness: 0.22,
      emissive: baseColor,
      emissiveIntensity: 0.18,
    });

    const realisticBackboneMaterial = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.22,
      metalness: 0.35,
      emissive: baseColor,
      emissiveIntensity: 0.22,
    });

    // Realistic B-DNA Parameters
    // Major groove: ~2.2 nm (~220° separation)
    // Minor groove: ~1.2 nm (~140° separation)
    // 10.5 base pairs per helical turn (360° / 10.5 ≈ 0.598 radians per base pair)
    const numBasePairs = 75;
    const helixRadius = 5.2;
    const risePerStep = 0.85; // Rise in Y per base pair
    const twistPerStep = (Math.PI * 2) / 10.5; // ~34.3° per step
    const minorGrooveAngle = (140 * Math.PI) / 180; // Realistic strand offset (140° vs 220°)

    const pointsStrand1: THREE.Vector3[] = [];
    const pointsStrand2: THREE.Vector3[] = [];
    const startY = -(numBasePairs * risePerStep) / 2;

    // Base pair slab geometries
    const baseGeo = new THREE.BoxGeometry(0.7, 0.28, 2.1);
    const atomSphereGeo = new THREE.SphereGeometry(0.42, 16, 16);

    for (let i = 0; i < numBasePairs; i++) {
      const angle1 = i * twistPerStep;
      const angle2 = angle1 + minorGrooveAngle; // Asymmetric offset creating authentic Major & Minor grooves
      const y = startY + i * risePerStep;

      // Coordinate on Strand 1 (5' to 3')
      const x1 = Math.cos(angle1) * helixRadius;
      const z1 = Math.sin(angle1) * helixRadius;
      const pos1 = new THREE.Vector3(x1, y, z1);
      pointsStrand1.push(pos1);

      // Coordinate on Strand 2 (antiparallel)
      const x2 = Math.cos(angle2) * helixRadius;
      const z2 = Math.sin(angle2) * helixRadius;
      const pos2 = new THREE.Vector3(x2, y, z2);
      pointsStrand2.push(pos2);

      // Phosphate-sugar backbone sphere nodes
      const node1 = new THREE.Mesh(atomSphereGeo, realisticBackboneMaterial);
      node1.position.copy(pos1);
      dnaGroup.add(node1);

      const node2 = new THREE.Mesh(atomSphereGeo, realisticBackboneMaterial);
      node2.position.copy(pos2);
      dnaGroup.add(node2);

      // Realistic planar base pair rung bridging the two helical strands
      const midpoint = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
      const span = new THREE.Vector3().subVectors(pos2, pos1);
      const spanLength = span.length();

      // Realistic planar base pair cylinder/rod
      const rungGeo = new THREE.CylinderGeometry(0.18, 0.18, spanLength, 12);
      const rungMesh = new THREE.Mesh(rungGeo, realisticBioMaterial);
      rungMesh.position.copy(midpoint);
      rungMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), span.clone().normalize());
      dnaGroup.add(rungMesh);

      // Nitrogenous base aromatic ring representation: paired flat slabs along the rung
      const basePlate = new THREE.Mesh(baseGeo, realisticBioMaterial);
      basePlate.position.copy(midpoint);
      basePlate.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), span.clone().normalize());
      dnaGroup.add(basePlate);
    }

    // Continuous smooth helical tubes for both backbones
    const curve1 = new THREE.CatmullRomCurve3(pointsStrand1);
    const tubeGeo1 = new THREE.TubeGeometry(curve1, numBasePairs * 4, 0.32, 12, false);
    const tubeMesh1 = new THREE.Mesh(tubeGeo1, realisticBackboneMaterial);
    dnaGroup.add(tubeMesh1);

    const curve2 = new THREE.CatmullRomCurve3(pointsStrand2);
    const tubeGeo2 = new THREE.TubeGeometry(curve2, numBasePairs * 4, 0.32, 12, false);
    const tubeMesh2 = new THREE.Mesh(tubeGeo2, realisticBackboneMaterial);
    dnaGroup.add(tubeMesh2);

    // Subtle single-colored ambient molecular dust particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 55;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 65;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 35;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.6,
      color: baseColor,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = nx * 0.25;
      mouseRef.current.targetY = ny * 0.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth, realistic slow rotation (single-colored double helix)
      dnaGroup.rotation.y += 0.004 * speed;
      dnaGroup.position.y = Math.sin(elapsedTime * 0.6) * 0.5;

      // Mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      dnaGroup.rotation.x = 0.12 + mouseRef.current.y * 0.2;
      dnaGroup.rotation.z = 0.22 + mouseRef.current.x * 0.2;

      particleSystem.rotation.y = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js resources
      atomSphereGeo.dispose();
      baseGeo.dispose();
      tubeGeo1.dispose();
      tubeGeo2.dispose();
      particleGeo.dispose();
      realisticBioMaterial.dispose();
      realisticBackboneMaterial.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};
