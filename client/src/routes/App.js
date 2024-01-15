import React, { Suspense, useState, useEffect, useRef } from "react"
import QRCode from "react-qr-code"
// OrbitControls to move the camera around
import { OrbitControls, ContactShadows, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Modal from "@mui/material/Modal"
import Box from '@mui/material/Box'
import Lottie from "lottie-react";

import Lights from "../components/light"
import Model from "../components/model"
import { QR_CODE_BASE_URL, WS_SERVER } from "../env"
import {
  FixHue,
  FixSaturation,
  FixLightness,
  FixTexture,
  FixUScale,
  FixVScale
} from "../components/fixValues"
import logo from '../assets/video/logo.json'


// parameters for the url code of the visualizer
let h, s, l, u, v, t

let prevTexture = 0

// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

export default function App({ initialState = 'WELCOME', maxFishZoom = 5, instructions = true }) {
  const [hue, setHue] = useState(6);
  const [saturation, setSaturation] = useState(93);
  const [lightness, setLightness] = useState(60);
  const [texture, setTexture] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const [currentState, setCurrentState] = useState(initialState);

  const wsConnection = useRef(null)

  useEffect(() => {
    // start websocket client + change values
    const arduinoSocket = new WebSocket(`ws://${WS_SERVER}:9000`);
    arduinoSocket.onopen = (event) => {
      // if it works, then connection opened
    };

    arduinoSocket.onmessage = (event) => {
      try {
        // parse JSON and set the parameters values
        const payload = JSON.parse(event.data);

        setHue(FixHue(payload.values.hue));
        setSaturation(FixSaturation(payload.values.saturation));
        setLightness(FixLightness(payload.values.lightness));
        // if texture changes
        if (prevTexture !== payload.values.texture) {
          setTexture(FixTexture(payload.values.texture));
        }

        setScaleX(FixUScale(payload.values.scaleX));
        setScaleY(FixVScale(payload.values.scaleY));

        setCurrentState(payload.currentState)

        prevTexture = payload.values.texture
      }
      catch (error) {
        // Friendly message for debugging
        console.log('Error parsing JSON:', error, event.data);
      }
    };

    wsConnection.current = arduinoSocket

    return () => arduinoSocket.close();
  }, []);

  // modal config + saving url parameters
  useEffect(() => {
    switch (currentState) {
      case "WELCOME": {

        break
      }
      case "CUSTOMIZE": {
        if (instructions) {
          document.getElementById("instruction").style.display = "flex"
        }

        // if continue to save the values, when changing status the last saved are the actual of the salmon
        h = Math.floor(hue)
        s = Math.floor(saturation)
        l = Math.floor(lightness)
        u = scaleX.toFixed(3)
        v = scaleY.toFixed(3)
        t = texture

        break
      }
      case "SAVE": {

        break
      }
      case "DISPLAY": {

        break
      }
      default: {
        throw new Error('unknown state')
      }
    }
  }, [currentState, hue, saturation, lightness, scaleX, scaleY, texture])

  if (currentState === 'WELCOME') {
    return (
      <div id="await">
        <Lottie animationData={logo} loop={true} style={{ height: "6.5vw" }} />
        <p>press &lt;enter&gt; to customize your salmon.</p>
      </div>
    )
  }

  if (currentState === 'SAVE') {
    return (
      <Box id="box">
        <div id="saving-screen">
          <p className="title">
            press &lt;enter&gt; to add your salmon.
          </p>
          <p className="description">
            press &lt;back&gt; to continue your customization.
          </p>
        </div>
      </Box>
    )
  }

  if (currentState === 'DISPLAY') {
    return (
      <Box id="box">
        <div id="saved-screen">
          <div><QRCode
            size={256}
            id="qr"

            title="NJÖRD Salmon"
            value={`${QR_CODE_BASE_URL}/visualizer?h=${h}&s=${s}&l=${l}&u=${u}&v=${v}&t=${t} `}
            viewBox={`0 0 256 256`}
          />

            <p className="title" >
              scan your custom order.
            </p>
          </div>
          <p className="description">
            press &lt;enter&gt; when you have finished.
          </p>
        </div>
      </Box>
    )
  }

  return (
    <>
      <div id="instruction">
        <p style={{ marginBottom: "0" }}>use the side disks to customize your salmon.</p>
        <p>press &lt;enter&gt; when you are satisfied.</p>
      </div >

      <Canvas shadows >
        <Lights />

        <Suspense fallback={<Loader />}>
          <Model
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            uScale={scaleX}
            vScale={scaleY}
            textureIndex={texture}
            modelScale={3.5}
            position={[0.5, 0, 0]}
            rotation={[0, 0.95, 0]}
          />
        </Suspense>

        {/* <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={1.5} far={2} /> */}

        <OrbitControls
          enableZoom={true}
          minDistance={Math.min(2.5, maxFishZoom)}
          maxDistance={maxFishZoom}
          enablePan={false}
        />
      </Canvas>
    </>
  )
}