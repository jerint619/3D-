import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useFrame } from "react-three-fiber";
import { saveAs } from "file-saver";
import { toBlob } from "canvas-toBlob";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(0, 0, 5));

function updateCameraPosition(frame) {
    const radius = 5;
    const theta = (frame * Math.PI) / 30;
    const x = radius * Math.sin(theta);
    const z = radius * Math.cos(theta);
    setCameraPosition(new THREE.Vector3(x, 0, z));
  }
  
  function useAnimationFrame(callback) {
    const requestRef = useRef();
    const previousTimeRef = useRef();
  
    function animate(time) {
      if (previousTimeRef.current != undefined) {
        const deltaTime = time - previousTimeRef.current;
        const frame = Math.floor(time / 1000) % 60;
        callback(frame, deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }
  
    useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }, []);
  }

  
  const [model, setModel] = useState(null);
const loader = new GLTFLoader();

useEffect(() => {
  loader.load("/path/to/model.glb", setModel);
}, []);


function Model() {
    const { nodes } = model.scene;
    const group = useRef();
    useAnimationFrame(updateCameraPosition);
  
    return (
      <group ref={group}>
        <mesh visible geometry={nodes.geometry_0.geometry}>
          <meshStandardMaterial attach="material" />
        </mesh>
      </group>
    );
  }
  
  function ModelViewer() {
    return (
      <Canvas camera={{ position: cameraPosition }}>
        <ambientLight intensity={0.5}






function ModelViewer() {
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 10 });
  const cameraRef = useRef();
  const [model, setModel] = useState(null);

  const loader = new GLTFLoader();

  loader.load(
    'your-model-path.gltf',
    (gltf) => {
      // set the model to the loaded gltf object
      setModel(gltf.scene);
    },
    (xhr) => {
      // loading progress callback
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
      // error callback
      console.error('Error loading GLTF model:', error);
    }
  );

  useFrame(({ gl, scene, camera }) => {
    // Update the camera position on every frame
    cameraRef.current.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    cameraRef.current.lookAt(0, 0, 0);

    // Render and save 60 images over different view angles
    for (let i = 0; i < 60; i++) {
      const renderTarget = new THREE.RenderTarget(1024, 1024);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas: renderTarget.texture.image });

      renderer.setSize(1024, 1024);
      renderer.setRenderTarget(renderTarget);

      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);

      camera.rotateY((i * Math.PI) / 30);

      renderer.render(scene, camera);

      // Save the image using the renderTarget texture
      const image = renderer.domElement.toDataURL('image/png');
      // do something with the image, e.g. save it to the server or download it
    }
  });

  return (
    <Canvas>
      <perspectiveCamera ref={cameraRef} position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]} />
      {model && <primitive object={model} />}
    </Canvas>
  );
}
