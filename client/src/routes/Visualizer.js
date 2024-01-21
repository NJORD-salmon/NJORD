import React, { Suspense, useRef } from "react"
// OrbitControls to move the camera around
import { OrbitControls, ContactShadows, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import { useDrag, useGesture } from "@use-gesture/react"
import { useSpring, useSprings, useTransition, animated, config, to } from 'react-spring'


import Lights from "../components/light"
import Model from "../components/model"
import logo from '../assets/video/logo.json'
import summary from '../assets/img/vn.jpeg'


// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

const BOTTOM_POINT = window.innerHeight - 40;

export default function Visualizer() {
  const [searchParams] = useSearchParams();
  // here it is not necessary to fix the values since they don't change 
  // and they have already been managed before
  const { h, s, l, u, v, t } = Object.fromEntries(searchParams.entries())

  const posHandle = useSpring({ y: BOTTOM_POINT })
  const bindHandle = useDrag((params) => {
    if (params.dragging) {
      if (params.xy[1] > 0 && params.xy[1] < BOTTOM_POINT) {
        posHandle.y.set(params.xy[1]);
      }
    } else {
      if (params.xy[1] < BOTTOM_POINT / 2) {
        posHandle.y.start(0);
      } else {
        posHandle.y.start(BOTTOM_POINT);
      }
    }
  }, {
    bounds: { top: 0, bottom: BOTTOM_POINT },
  });

  return (
    <>
      <div id="logo">
        <Lottie animationData={logo} loop={true} id="lottie" />
      </div>

      <animated.div {...bindHandle()} style={{
        touchAction: "none",
        y: posHandle.y
      }}
        className="handle-container" >
        <div className="handle" />
      </animated.div>
      <animated.div id="overlay" style={{
        y: posHandle.y,
        opacity: posHandle.y.to([0, BOTTOM_POINT], [1, 0.8])
      }} >
        <div>
          <p>thank you for your order</p>
          <p>here are your choices:</p>
          <div id="param-list">
            <ul >
              <li>hue: {h}</li>
              <li>saturation: {s}</li>
              <li>lightness: {l}</li>
            </ul>
            <ul>
              <li>texture: {t}</li>
              <li>scale x: {u}</li>
              <li>scale y: {v}</li>
            </ul>
          </div>
        </div>
        <div><img src={summary} alt="nutritional values" style={{ width: "90vw" }} /></div>
      </animated.div>

      <Canvas shadows style={{ height: "95%" }} >
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
            animIndex={0}
          />
        </Suspense>

        {/* <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={1.5} far={2} /> */}

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
