import React, { Suspense, useState, useEffect } from "react"
// OrbitControls to move the camera around
import { OrbitControls, ContactShadows, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

import { useSearchParams } from "react-router-dom";

import Lights from "../components/light"
import Model from "../components/model"

// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

export default function Visualizer() {
  const [searchParams] = useSearchParams();
  const { h, s, l, u, v, t } = Object.fromEntries(searchParams.entries())

  return (
    <>
      <Canvas shadows >
        <Lights />

        <Suspense fallback={<Loader />}>
          <Model
            hue={h ?? 6}
            saturation={s ?? 93}
            lightness={l ?? 60}
            uScale={u ?? 1}
            vScale={v ?? 1}
            textureIndex={t ?? 0}
            modelScale={3.5}
            position={[0.5, 0, 0]}
            rotation={[0, 0.95, 0]}
            animIndex={0}
          />
        </Suspense>

        <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={1.5} far={2} />

        <OrbitControls

          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </>
  )
}
