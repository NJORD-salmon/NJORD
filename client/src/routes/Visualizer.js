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
          <p>the Customized Njord Salmon comes from the cold
            waters of the Norwegian fjords. every stage of
            processing, starting from the strictly fresh raw material,
            is the result of a long-standing tradition. Njord
            Norwegian Salmon is a source of OMEGA-3 fatty acids.
          </p>
          <p>store at temperatures between 0°C and 4°C.
            cooking instructions: bake in the oven at 180°C for 15
            minutes or grill for 10 minutes on each side.
          </p>
          <p>ingredients: Norwegian Salmon (salmo salar) 97°10,
            salt, Sicily sea water, aquamarine, beryl extract,
            delphiniums flower, water from Cosenz, discolored
            blueberries. farmed in Norway.
            <br></br>
            to be consumed by: 31/12/2024
          </p>
          <p>nutritional information - average values per 100g</p>
          <div className="param-list">
            <ul >
              <li>energy</li>
              <br></br>
              <br></br>
              <li>fats</li>
              <li>*saturated</li>
              <li>*monounsaturated</li>
              <li>*polyunsaturated</li>
              <br></br>
              <li>carbohydrates</li>
              <li>*of which sugars</li>
              <br></br>
              <li>proteins</li>
              <br></br>
              <li>salt</li>
              <br></br>
              <li>omega-3</li>
              <br></br>
              <li>fiber</li>
              <br></br>
              <li>sugar</li>
            </ul>
            <ul>
              <li>709 kJ</li>
              <li>169 kcal</li>
              <br></br>
              <li>9,0 g</li>
              <li>1,3 g</li>
              <li>5,1 g</li>
              <li>2,7 g</li>
              <br></br>
              <li>&lt;0,5 g</li>
              <li>&lt;0,5 g</li>
              <br></br>
              <li>22 g</li>
              <br></br>
              <li>2,7 g</li>
              <br></br>
              <li>0,5 g</li>
              <br></br>
              <li>&lt;0,5 g</li>
              <br></br>
              <li>&lt;0,5 g</li>
            </ul>
          </div>
          <p>color information - values of your personal salmon</p>
          <div className="param-list">
            <ul >
              <li>color</li>
              <li>*HSL</li>
            </ul>
            <ul>
              <li>H:{h}</li>
              <li>S:{s}</li>
              <li>L:{l}</li>
            </ul>
          </div>
          <p>texture information - values of your personal salmon</p>
          <div className="param-list">
            <ul >
              <li>texture</li>
              <li>*scaling X</li>
              <li>*scaling Y</li>
            </ul>
            <ul>
              <li>name</li>
              <li>{s} in percent</li>
              <li>{l} in percent</li>
              <br></br>
            </ul>
          </div>
          <div id="contact-info">
            <span>info@njord.no </span>
            <span> instagram </span>
            <span>www.njord.com </span>
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
