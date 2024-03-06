"use client"

import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { ContactShadows, Float, Environment } from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from "react"
import { gsap } from "gsap";

export default function Shapes(){
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0 select-none">
      <Canvas className="z-0" shadows gl = {{antialias:false}} dpr={[1, 1.5]} camera={{postion: [0, 0, 25], fov: 30, next:1, far:40}}>
        <Suspense fallback={null}>
          <Geometries />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.65}
            scale={20}
            blur={1}
            far={9} />
            <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  )
}

function Geometries() {
  const geometries = [
    {
      position: [0,0,0],
      r: 0.25,
      geometry: new THREE.TetrahedronGeometry(0.5) // Knot

    },
      {
      position: [-.7, .7, -4],
      r: 0.34,
      geometry: new THREE.IcosahedronGeometry(0.45) // Gem

    },
    {
      position: [.3, -.15, .1],
      r: 0.37,
      geometry: new THREE.CapsuleGeometry(0.1, 0.2, 2, 16) // Pill

    },
    {
      position: [-.25, -.25, .1],
      r: 0.35,
      geometry: new THREE.TorusGeometry(0.2, 0.1, 16, 4) // Square

    },
    {
      position: [.4, .66, -4],
      r: 0.5,
      geometry: new THREE.OctahedronGeometry(0.4) // Diamond

    }
  ];

  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: 0.3}),
    new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.3}),
    new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0.3}),
    new THREE.MeshStandardMaterial({ color: 0xa55eea, roughness: 0.4}),
    new THREE.MeshStandardMaterial({ color: 0x8854d0, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x45aaf2, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x2d98da, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x2bcbba, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x0fb9b1, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x4b7bec, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x3867d6, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x833471, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x9980FA, roughness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x12CBC4, roughness: 0.5}),
  ];

  const soundEffects = [
    new Audio("/sounds/knock1.ogg"),
    new Audio("/sounds/knock2.ogg"),
    new Audio("/sounds/knock3.ogg")
  ]

  return geometries.map(({position, r, geometry}) => (
    <Geometry
      key={JSON.stringify(position)}
      position={position.map((p) => p * 2)}
      soundEffects={soundEffects}
      geometry={geometry}
      materials={materials}
      r={r}
    />
  ))
}

function Geometry({r, position, geometry, materials, soundEffects}){
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);

  const startingMaterial = getRandomMaterial();

  function getRandomMaterial(){
    return gsap.utils.random(materials);
  }

  function handleClick(e){
    const mesh = e.object;

    gsap.utils.random(soundEffects).play();

    gsap.to(mesh.rotation, {
      x: `+=${gsap.utils.random(0,2)}`,
      y: `+=${gsap.utils.random(0,2)}`,
      z: `+=${gsap.utils.random(0,2)}`,
      duration: 1.3,
      ease: "elastic.out(1,0.3)"
    });
    mesh.material = getRandomMaterial();
  }

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  }

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  }

  useEffect(() => {
    let ctx = gsap.context(() => {
      setVisible(true);
      gsap.from(meshRef.current.scale,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "elastic.out(1,0.3)",
          delay: 0.3
        })
    });
    return () => ctx.revert();
  }, [])

  return (
    <group position={position} ref={meshRef}>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
        <mesh
          geometry={geometry}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          visible={visible}
          material={startingMaterial}
        />
      </Float>
    </group>
  )
}
