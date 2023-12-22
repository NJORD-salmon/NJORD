import React, { Suspense, useState, useEffect } from "react"
import QRCode from "react-qr-code"
// OrbitControls to move the camera around
import { OrbitControls, ContactShadows, Stats, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Modal from "@mui/material/Modal"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

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


// parameters for the url code of the visualizer
let h, s, l, u, v, t

// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

export default function App() {
  const [hue, setHue] = useState(6);
  const [saturation, setSaturation] = useState(93);
  const [lightness, setLightness] = useState(60);
  const [texture, setTexture] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const [nextButton, setNextButton] = useState(0);
  const [backButton, setbackButton] = useState(0);

  const [open, setOpen] = React.useState(false);
  // TODO: change initial state (page) to TUTORIAL in the future
  const [currentState, setCurrentState] = useState("CUSTOMIZE");

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
        setTexture(FixTexture(payload.values.texture));
        setScaleX(FixUScale(payload.values.scaleX));
        setScaleY(FixVScale(payload.values.scaleY));

        setNextButton(payload.values.next);
        setbackButton(payload.values.back);

        setCurrentState(payload.currentState)
      }
      catch (error) {
        // Friendly message for debugging
        console.log('Error parsing JSON:', error, event.data);
      }
    };

    return () => arduinoSocket.close();
  }, [currentState]);

  // modal config + saving url parameters
  useEffect(() => {
    switch (currentState) {
      case "TUTORIAL": {
        setOpen(false)

        break
      }
      case "CUSTOMIZE": {
        // keep the modal closed
        setOpen(false)
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
        // open the modal to save the salmon
        setOpen(true)

        break
      }
      case "DISPLAY": {
        // saved file confirmation
        document.getElementById("saving-screen").style.display = "none";
        document.getElementById("saved-screen").style.display = "block";
        // show qr code
        document.getElementById("container").style.display = "block";

        // TODO: press next => start animation, next state

        break
      }
      default: {
        throw new Error('unknown state')
      }
    }
  }, [currentState, hue, saturation, lightness, scaleX, scaleY, texture])

  return (
    <>
      <div>
        <Modal
          open={open}
        // aria-labelledby="modal-modal-title"
        // aria-describedby="modal-modal-description"
        >
          <Box id="box-modal">

            <div id="saving-screen">
              <Typography className="modal-title">
                Do you want to save this salmon?
              </Typography>
              <div>
                <Typography className="modal-description" sx={{ mt: 2 }}>
                  Back
                </Typography>
                <Typography className="modal-description" sx={{ mt: 2 }}>
                  Ok
                </Typography>
              </div>
            </div>

            <div id="saved-screen">
              <Typography className="modal-title" >
                Salmon saved!
              </Typography>
            </div>

            <div id="container">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                title="NJÖRD Salmon"
                value={`${QR_CODE_BASE_URL}/visualizer?h=${h}&s=${s}&l=${l}&u=${u}&v=${v}&t=${t} `}
                viewBox={`0 0 256 256`}
              />
            </div>

          </Box>
        </Modal>
      </div>

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
        {/* <Stats /> */}
      </Canvas>
    </>
  )
}