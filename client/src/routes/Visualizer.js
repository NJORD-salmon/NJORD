import React, { Suspense, useState } from "react"
// OrbitControls to move the camera around
import { OrbitControls, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useSearchParams } from "react-router-dom"
import Lottie from "lottie-react"
import { useDrag } from "@use-gesture/react"
import { useSpring, animated } from 'react-spring'

import Lights from "../components/light"
import Model from "../components/model"
import swim1 from '../assets/video/swim1.json'
import swim2 from '../assets/video/swim2.json'
import swim3 from '../assets/video/swim3.json'
import summary from '../assets/img/vn.jpeg'


// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

const BOTTOM_POINT = window.innerHeight - 40;
const logo = [swim1, swim2, swim3]

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

  const [animIndex, setAnimIndex] = useState(0)

  return (
    <>
      <div id="logo">
        <Lottie animationData={logo[animIndex]} loop={true} id="lottie" />
      </div>

      <div id="buttons">
        <div className="hr"></div>
        <div id="swims">
          <div
            className="change-swim"
            onClick={() => {
              setAnimIndex(0)
            }}>
            swim 1
          </div>
          <div className="vl"></div>
          <div
            className="change-swim"
            onClick={() => {
              setAnimIndex(1)
            }}>
            swim 2
          </div>
          <div className="vl"></div>
          <div
            className="change-swim"
            onClick={() => {
              setAnimIndex(2)
              console.log(animIndex)
            }}>
            swim 3
          </div>
        </div>
        <div className="hr"></div>
        <div id={"info"}>
          <div id={"change-info"}
            onClick={() => {

              if (document.getElementById("change-info").innerHTML === "click to view your salmon") {

                document.getElementById("change-info").innerHTML = "click to view your salmon data";
                document.getElementById("overlay").style.display = "none";

              }
              else if (document.getElementById("change-info").innerHTML === "click to view your salmon data") {

                document.getElementById("change-info").innerHTML = "click to view your salmon";
                document.getElementById("overlay").style.display = "flex";
              }
            }}>
            click to view your salmon data
          </div>
        </div>
      </div>

      <div id="overlay">
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
      </div >


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
