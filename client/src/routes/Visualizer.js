import React, { Suspense, useEffect, useState } from "react"
// OrbitControls to move the camera around
import { OrbitControls, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useSearchParams } from "react-router-dom"
import Lottie from "lottie-react"
import { useOrientation } from "react-use"

import Lights from "../components/light"
import Model from "../components/model"
import swim1 from '../assets/video/swim1.json'
import swim2 from '../assets/video/swim2.json'
import swim3 from '../assets/video/swim3.json'

const textureName = ["tulips", "leaf", "imprint", "cascade", "zinc", "plasma", "zebra", "waves", "microbe",]

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

  const [animIndex, setAnimIndex] = useState(0)

  const { type } = useOrientation();

  useEffect(() => {
    if (type === "portrait-primary" || type === "portrait-secondary") {
      for (let i = 0; i < logo.length; i++) {
        document.getElementById(`swim${i}`).style.border = "1px solid #000";
        document.getElementById(`swim${i}`).style.borderBottom = "0";
      }

      document.getElementById(`swim${animIndex}`).style.border = "2px solid #000";

      if (animIndex == 0) {
        document.getElementById(`swim${animIndex}`).style.borderRight = "1px solid #000";
        document.getElementById(`swim${animIndex + 1}`).style.borderRight = "0";
      } else if (animIndex == 1) {
        document.getElementById(`swim${animIndex}`).style.borderLeft = "1px solid #000";
        document.getElementById(`swim${animIndex}`).style.borderRight = "1px solid #000";
      } else if (animIndex == 2) {
        document.getElementById(`swim${animIndex}`).style.borderLeft = "1px solid #000";
        document.getElementById(`swim${animIndex - 1}`).style.borderLeft = "0";
      }

      document.getElementById(`swim${animIndex}`).style.borderBottom = "0";

    } else {

      for (let i = 0; i < logo.length; i++) {
        document.getElementById(`swim${i}`).style.border = "1px solid #000";
        document.getElementById(`swim${i}`).style.borderBottom = "0";
      }

      document.getElementById(`swim${animIndex}`).style.border = "2px solid #000";

      if (animIndex == 0) {
        document.getElementById(`swim${animIndex + 1}`).style.borderTop = "0";
      } else if (animIndex == 1) {
        document.getElementById(`swim${animIndex + 1}`).style.borderTop = "0";
      } else if (animIndex == 2) {
        document.getElementById(`swim${animIndex - 1}`).style.borderBottom = "0";
        document.getElementById(`swim${animIndex}`).style.borderBottom = "0";
      }


    }
  }, [animIndex, type])

  return (
    <>
      <div id="logo">
        <Lottie animationData={logo[animIndex]} loop={true} id="lottie" />
      </div>
      <div>
        <div id="overlay">
          <div>
            <p>the <span className="bold">Customized Njord Salmon</span> comes from the cold
              waters of the Norwegian fjords. every stage of
              processing, starting from the strictly fresh raw material,
              is the result of a long-standing tradition. Njord
              Norwegian Salmon is a source of OMEGA-3 fatty acids.
              <br></br>
            </p>
            <p>
              <br></br>
              <span className="bold">store at temperatures between 0°C and 4°C.</span>
              <br></br>
              cooking instructions: bake in the oven at 180°C for 15
              minutes or grill for 10 minutes on each side.
              <br></br>
            </p>
            <p>
              <br></br>
              ingredients: <span className="bold">Norwegian Salmon</span> (salmo salar) 97°10,
              salt, Sicily sea water, aquamarine, beryl extract,
              delphiniums flower, water from Cosenz, discolored
              blueberries. farmed in Norway.
              <br></br>
              to be consumed by: 31/12/2024
              <br></br>
            </p>
            <p>
              <br></br>
              <span className="bold">nutritional information</span> - average values per 100g</p>
            <div className="param-list">
              <ul className="param-names">
                <li>energy</li>
                <br></br>
                <br></br>
                <li>fats</li>
                <li>&#8627;saturated</li>
                <li>&#8627;monounsaturated</li>
                <li>&#8627;polyunsaturated</li>
                <br></br>
                <li>carbohydrates</li>
                <li>&#8627;of which sugars</li>
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
              <ul className="param-values">
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
                <br></br>
              </ul>
            </div>
            <p><span className="bold">color information</span> - values of your personal salmon</p>
            <div className="param-list">
              <ul className="param-names">
                <li>color</li>
                <li>&#8627;HSL</li>
              </ul>
              <ul className="param-values">
                <br></br>
                <li>H: {h}°</li>
                <li>S: {s}%</li>
                <li>L: {l}%</li>
                <br></br>
              </ul>
            </div>
            <p><span className="bold">texture information</span> - values of your personal salmon</p>
            <div className="param-list">
              <ul className="param-names">
                <li>texture</li>
                <li>&#8627;scaling X</li>
                <li>&#8627;scaling Y</li>
              </ul>
              <ul className="param-values">
                <li>{textureName[t]}</li>
                <li>{Number.parseFloat(u).toFixed(2)}</li>
                <li>{Number.parseFloat(v).toFixed(2)}</li>
                <br></br>
              </ul>
            </div>
            <div id="contact-info">
              <span>info@njord.no</span>
              <span><a href={"https://www.instagram.com/njord.colors?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="} target="_blank">instagram</a></span>
              <span>www.njord.com</span>
            </div>
          </div>
          <div style={{ padding: "5vh 0" }}></div>
        </div >

        <div id="buttons">
          <div id="swims">
            <div
              className="change-swim"
              id="swim0"
              onClick={() => {
                setAnimIndex(0)
              }}>
              swim 1
            </div>
            <div
              className="change-swim"
              id="swim1"
              onClick={() => {
                setAnimIndex(1)
              }}>
              swim 2
            </div>
            <div
              className="change-swim"
              id="swim2"
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
                toggleView()

              }}>
              click to view your salmon data
            </div>
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


function toggleView() {
  if (document.getElementById("change-info").innerHTML === "click to view your salmon") {
    document.getElementById("change-info").innerHTML = "click to view your salmon data";
    document.getElementById("overlay").style.display = "none";
  }
  else if (document.getElementById("change-info").innerHTML === "click to view your salmon data") {
    document.getElementById("change-info").innerHTML = "click to view your salmon";
    document.getElementById("overlay").style.display = "flex";
  }
}