import React, { Suspense, useState } from "react"
// OrbitControls to move the camera around
import { OrbitControls, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useSearchParams } from "react-router-dom"
import Lottie from "lottie-react"

import Lights from "../components/light"
import Model from "../components/model"
import VisualizerUI from "../components/visualizerUI"

import swim1 from '../assets/video/swim1.json'
import swim2 from '../assets/video/swim2.json'
import swim3 from '../assets/video/swim3.json'

const logo = [swim1, swim2, swim3]

// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

export default function Visualizer() {
  const [searchParams] = useSearchParams();
  // here it is not necessary to fix the values since they don't change 
  // and they have already been managed before
  const { h, s, l, u, v, t } = Object.fromEntries(searchParams.entries())

  const [animIndex, setAnimIndex] = useState(0)

  return (
    <>
      <div id="logo">
        <Lottie animationData={logo[animIndex]} loop={true} id="lottie" />
      </div>
      <VisualizerUI
        salmonParams={{ h, s, l, u, v, t }}
        animationInfo={{ animIndex, setAnimIndex }}
        swimAnimations={logo.length}
      />

      <Canvas shadows>
        <Lights />

        <Suspense fallback={<Loader />}>
          <Model
            hue={h ?? 6}
            saturation={s ?? 93}
            lightness={l ?? 60}
            uScale={u ?? 1}
            vScale={v ?? 1}
            textureIndex={t ?? 4}
            modelScale={3.5}
            position={[0.5, 0, 0]}
            rotation={[0, 0.95, 0]}
            isAnimChanging={true}
            animIndex={animIndex}
          />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          minDistance={2.5}
          maxDistance={10}
          enablePan={false}
        />
      </Canvas>
    </>
  )
}