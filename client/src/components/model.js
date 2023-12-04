/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useRef } from 'react'
// useGLTF to load GLTF model into the canvas
import { useAnimations, useGLTF } from '@react-three/drei'
import { MeshStandardMaterial, Color, RepeatWrapping } from 'three';
import { useFrame } from "@react-three/fiber"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { degToRad } from 'three/src/math/MathUtils';

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
  movementAnim = false
}) {

  const eyeMaterial = new MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.8,
    roughness: 0.3
  })

  const textureVector = [
    '../models/salmon/0.png',
    "../models/salmon/1.jpeg",
    // "../models/salmon/2.jpeg",
    "../models/salmon/3.jpeg",
    "../models/salmon/4.jpeg",
    "../models/salmon/5.jpeg",
    "../models/salmon/6.jpeg",
  ]
  // load texture
  const texture = new TextureLoader().load(textureVector[textureIndex])
  // change the scale of the texture
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(uScale, vScale)

  const hslColor = extractColor(hue, saturation, lightness)
  const material = getMaterial(hslColor, texture)
  const constantMaterial = getCostantMaterial(hslColor)

  const myMesh = useRef()
  // select which gltf model to load
  const { nodes, animations } = useGLTF('../models/salmon/salmon.gltf')
  const { actions, names } = useAnimations(animations, myMesh)
  console.log(actions)

  useEffect(() => {
    // this is executed after the rendering phase

    // Reset and fade in animation after an index has been changed
    actions[names[animIndex]].reset().fadeIn(0.5).play();

    // TODO change animation when turning
    // right now it doesn't work
    if ((myMesh.current.position.x > widthRadius - 1 && myMesh.current.position.x <= widthRadius)
      || (myMesh.current.position.x < -widthRadius + 1 && myMesh.current.position.x >= -widthRadius)) {
      animIndex = 5
    }



    return () => {
      actions[names[animIndex]].fadeOut(0.5);
    };
  }, [actions, names, animIndex])

  const widthRadius = 4 - position[2]

  useFrame(({ clock }) => {
    // add movement animation to scene if aquarium
    if (movementAnim) {
      const timer = clock.getElapsedTime() / 5.7
      myMesh.current.position.x = Math.sin(timer) * widthRadius

      if ((myMesh.current.position.x > widthRadius - 1 && myMesh.current.position.x <= widthRadius)
        || (myMesh.current.position.x < -widthRadius + 1 && myMesh.current.position.x >= -widthRadius)) {
        // 880 it's the number opf frames to complete the 180° rotation
        myMesh.current.rotation.y += degToRad(180) / 880
        console.log(animIndex)
      }
    }


  })

  return (
    <group ref={myMesh} dispose={null} scale={modelScale} position={position} rotation={rotation} >
      {/* TODO set  */}
      <group name="Scene">
        <group name="Salmon">
          <skinnedMesh
            name="Salmon_Eye"
            geometry={nodes.Salmon_Eye.geometry}
            material={eyeMaterial}
            skeleton={nodes.Salmon_Eye.skeleton}
          />
          <skinnedMesh
            name="Salmon_Meat"
            geometry={nodes.Salmon_Meat.geometry}
            material={material}
            skeleton={nodes.Salmon_Meat.skeleton}
          />
          <group name="Salmon_Skin">
            <skinnedMesh
              name="Salmon_Mesh"
              geometry={nodes.Salmon_Mesh.geometry}
              material={constantMaterial}
              skeleton={nodes.Salmon_Mesh.skeleton}
            />
            <skinnedMesh
              name="Salmon_Mesh_1"
              geometry={nodes.Salmon_Mesh_1.geometry}
              material={constantMaterial}
              skeleton={nodes.Salmon_Mesh_1.skeleton}
            />
            <skinnedMesh
              name="Salmon_Mesh_2"
              geometry={nodes.Salmon_Mesh_2.geometry}
              material={eyeMaterial}
              skeleton={nodes.Salmon_Mesh_2.skeleton}
            />
          </group>
          <primitive object={nodes.Root} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/salmon/salmon.gltf')

// assign the color and the map to the mesh material
function getMaterial(color, image) {
  return (
    new MeshStandardMaterial({
      color: color,
      map: image,
    })
  )
}

function getCostantMaterial(color) {
  return (
    new MeshStandardMaterial({
      color: color,
      bumpMap: new TextureLoader().load("../models/salmon/salmon_textures/Chinook_salmon_bump.png"),
      bumpScale: 0.5,
    })
  )
}

// convert color in HSL mode
function extractColor(hue, saturation, lightness) {
  return new Color("hsl(0, 100%, 100%)")
    .setHSL((hue ?? 0) / 360, (saturation ?? 0) / 100, (lightness ?? 0) / 100)
}

