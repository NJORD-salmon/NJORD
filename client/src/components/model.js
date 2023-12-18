/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useRef, useMemo } from 'react'
// useGLTF to load GLTF model into the canvas
import { useAnimations, useGLTF } from '@react-three/drei'
import { MeshStandardMaterial, Color, RepeatWrapping } from 'three';
import { useFrame, useGraph } from "@react-three/fiber"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { degToRad } from 'three/src/math/MathUtils';

import * as skeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js"

export default function Model({
  hue,
  saturation,
  lightness,
  uScale,
  vScale,
  textureIndex,
  position = [0, 0, 0],
  modelScale,
  rotation = [0, degToRad(90), 0],
  animIndex = 0,
  movementAnim = false,
}) {
  // load textures
  const textureVector = [
    "./NJORD/models/salmon/meat_textures/0.png",
    "./NJORD/models/salmon/meat_textures/1.jpeg",
    "./NJORD/models/salmon/meat_textures/2.jpeg",
    "./NJORD/models/salmon/meat_textures/3.jpeg",
    "./NJORD/models/salmon/meat_textures/4.jpeg",
    "./NJORD/models/salmon/meat_textures/5.jpeg",
    "./NJORD/models/salmon/meat_textures/6.jpeg",
    "./NJORD/models/salmon/meat_textures/7.jpeg",
  ]

  const texture = new TextureLoader().load(textureVector[textureIndex])
  // change the scale of the texture
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(uScale, vScale)

  const hslColor = extractColor(hue, saturation, lightness)
  const material = getMaterial(hslColor, texture)
  // const constantMaterial = getConstantMaterial(hslColor)

  // fish face material
  const constantMaterial = new MeshStandardMaterial({
    color: extractColor(6, 93, 60),
    bumpMap: new TextureLoader().load("./NJORD/models/salmon/salmon_textures/Chinook_salmon_bump.png"),
    bumpScale: 0.5,
  })

  // fish meat
  /* const material = new MeshStandardMaterial({
    color: extractColor(6, 93, 60),
    map: textureVector[0],
  }) */

  // set changing properties of materials
  constantMaterial.color = hslColor
  material.color = hslColor
  /* if (material.map !== textureVector[animIndex]) {
    material.map = textureVector[animIndex]
    console.log("ssss")
  } */

  // change the scale of the texture
  // material.map.wrapS = RepeatWrapping
  // material.map.wrapT = RepeatWrapping
  // material.map.repeat.set(uScale, vScale)

  // eye material
  const eyeMaterial = new MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.8,
    roughness: 0.3
  })

  const myMesh = useRef()
  // select which gltf model to load
  const { scene, animations } = useGLTF('./NJORD/models/salmon/salmon.gltf')
  const clone = useMemo(() => skeletonUtils.clone(scene), [scene])
  const { nodes } = useGraph(clone)

  const { actions, names } = useAnimations(animations, myMesh)
  // console.log(actions)
  // this is executed after the rendering phase
  useEffect(() => {
    // reset and fade in animation after an index has been changed
    actions[names[animIndex]].reset().fadeIn(0.5).play();

    // TODO change animation when turning

    return () => {
      actions[names[animIndex]].fadeOut(0.5);
    };
  }, [actions, names, animIndex])

  // widthRadius is how much the fish can move on the x axis
  const widthRadius = 3.5 - position[2]

  // TODO: fix salmon movements and animation

  const max_X = 3.5 - position[2] / 4
  const radius = 3.5 - position[2] / 4
  const speed = 0.01 + Math.abs(position[2]) / 800; // Adjust the speed value to control the speed

  useEffect(() => {
    // Initial setup with random initial angle
    myMesh.current.userData.theta = Math.random() * Math.PI * 2;

    // Cleanup function
    return () => {
      // Stop any ongoing animations or cleanup resources if needed
    };
  }, []); // Empty dependency array ensures that the effect runs only once

  let prevPosition = position[2]

  useFrame(() => {

    // check if speed is greater than 0 to allow movement
    if (speed > 0 && movementAnim) {
      // parameterized equation for the infinity symbol
      const x = radius * Math.sin(myMesh.current.userData.theta);
      const y = radius * Math.sin(myMesh.current.userData.theta) * Math.cos(myMesh.current.userData.theta);

      // update the mesh position
      myMesh.current.position.x = x;
      myMesh.current.position.y = y;

      // calculate the tangent vector to the path
      const tangentX = radius * Math.cos(myMesh.current.userData.theta);
      const tangentY = -radius * Math.sin(myMesh.current.userData.theta);

      // Calculate the angle between the tangent vector and the positive x-axis
      const angle = Math.atan2(tangentX, tangentY);

      // Set the rotation based on the angle
      myMesh.current.rotation.z = angle;


      // Set the rotation around the x-axis to make the x-axis parallel to the tangent
      myMesh.current.rotation.x = degToRad(-90);
      myMesh.current.rotation.y = degToRad(-90);

      // update angle
      myMesh.current.userData.theta += speed;

      // Reset angle when a full circle is completed
      if (myMesh.current.userData.theta >= Math.PI * 2) {
        myMesh.current.userData.theta = 0;
      }

      if (myMesh.current.position.x - prevPosition > 0) {
        myMesh.current.rotation.y = degToRad(90)
      } else {
        myMesh.current.rotation.y = degToRad(-90)
      }
    }
    prevPosition = myMesh.current.position.x
  });





  return (
    <group ref={myMesh} dispose={null} scale={modelScale} position={position} rotation={rotation} animIndex={animIndex}>
      <group name="Salmon">
        {/* meat, the one which changes texture */}
        <skinnedMesh
          name="Salmon_Meat"
          object={nodes.Salmon_Meat}
          geometry={nodes.Salmon_Meat.geometry}
          material={material}
          skeleton={nodes.Salmon_Meat.skeleton}
        />
        <group name="Salmon_Skin">
          {/* face */}
          <skinnedMesh
            name="Salmon_Mesh"
            object={nodes.Salmon_Mesh}
            geometry={nodes.Salmon_Mesh.geometry}
            material={constantMaterial}
            skeleton={nodes.Salmon_Mesh.skeleton}
          />
          {/* fins */}
          <skinnedMesh
            name="Salmon_Mesh_1"
            object={nodes.Salmon_Mesh_1}
            geometry={nodes.Salmon_Mesh_1.geometry}
            material={constantMaterial}
            skeleton={nodes.Salmon_Mesh_1.skeleton}
          />
          {/* eyes */}
          <skinnedMesh
            name="Salmon_Mesh_2"
            object={nodes.Salmon_Mesh_2}
            geometry={nodes.Salmon_Mesh_2.geometry}
            material={eyeMaterial}
            skeleton={nodes.Salmon_Mesh_2.skeleton}
          />
        </group>
        <primitive object={nodes.Root} />
      </group>
    </group>
  );
}

useGLTF.preload('./NJORD/models/salmon/salmon.gltf')

// assign the color and the map to the meat material
function getMaterial(color, image) {
  return (
    new MeshStandardMaterial({
      color: color,
      map: image,
    })
  )
}

// convert color in HSL mode
function extractColor(hue, saturation, lightness) {
  return new Color("hsl(0, 100%, 100%)")
    .setHSL((hue ?? 0) / 360, (saturation ?? 0) / 100, (lightness ?? 0) / 100)
}