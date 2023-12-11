import React, { Suspense, useState, useEffect } from "react"
// OrbitControls to move the camera around
import { OrbitControls, ContactShadows, Stats, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Modal from "@mui/material/Modal"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
// GUI template to debug the sliders
import { Leva, useControls } from "leva"

import Lights from "../components/light"
import Model from "../components/model"
import { FixHue, FixSaturation, FixLightness } from "../components/fixValues"
import { SERVER_ADDRESS } from "../env"


// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

// configuration for screen sliders
const scaleXConfig = {
  value: 1,
  min: 0,
  max: 5,
  step: 0.01,
}
const scaleYConfig = {
  value: 1,
  min: 0,
  max: 5,
  step: 0.01,
}
const textureConfig = {
  value: 0,
  min: 0,
  max: 5,
  step: 1,
}

export default function App() {
  const [hue, setHue] = useState(6);
  const [saturation, setSaturation] = useState(93);
  const [lightness, setLightness] = useState(60);
  // const [texture, setTexture] = useState(0);
  // const [scaleX, setScaleX] = useState(1);
  // const [scaleY, setScaleY] = useState(1); 

  const [nextButton, setNextButton] = useState(0);
  const [okButton, setOkButton] = useState(0);
  const [backButton, setbackButton] = useState(false);

  const [open, setOpen] = React.useState(false);
  // TODO: change initial state (page) to TUTORIAL in the future
  const [currentState, setCurrentState] = useState("CUSTOMIZE");

  // TODO: slider for scaling textures
  const { scaleX, scaleY, texture } = useControls({
    scaleX: scaleXConfig,
    scaleY: scaleYConfig,
    texture: textureConfig
  })

  useEffect(() => {
    // start websocket client + change hue value
    const arduinoSocket = new WebSocket(`ws://${SERVER_ADDRESS}:9000`);
    arduinoSocket.onopen = (event) => {
      // if it works, then connection opened
      // console.log(event)
    };

    arduinoSocket.onmessage = (event) => {
      try {
        // parse JSON and set the parameters values
        const payload = JSON.parse(event.data);

        setHue(FixHue(payload.values.hue));
        setSaturation(FixSaturation(payload.values.saturation));
        setLightness(FixLightness(payload.values.lightness));
        //setTexture(FixTexture(payload.values.texture));
        // setScaleX(FixUScale(payload.scaleX));
        // setScaleY(FixVScale(payload.scaleY));

        setNextButton(payload.values.next);
        setOkButton(payload.values.ok);
        setbackButton(payload.values.back);
        // console.log(payload)

        // TODO: fix modals
        setCurrentState(payload.currentState)
        console.log(currentState)
      }
      catch (error) {
        // Friendly message for debugging
        console.log('Error parsing JSON:', error, event.data);
      }
    };

    return () => arduinoSocket.close();
  }, [currentState]);

  // read changes of button with modal
  useEffect(() => {
    switch (currentState) {
      case "TUTORIAL": {
        setOpen(false)
        break
      }
      case "CUSTOMIZE": {
        setOpen(false)
        break
      }
      case "SAVE": {
        // open the modal to save the salmon
        setOpen(true)
        break
      }
      case "DISPLAY": {
        document.getElementById("saved-screen").style.display = "block";

        // TODO: qr code, press ok => start animation
        // setTimeout(() => {
        // code is executed after 1 second

        // }, 1000)
        break
      }
      default: {
        throw new Error('unknown state')
      }
    }
  }, [currentState])

  return (
    <>
      <div>
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box id="box-modal">
            <div id="saving-screen">
              <Typography className="modal-modal-title">
                Do you want to save this salmon?
              </Typography>
              <div>
                <Typography id="modal-modal-back" className="modal-description" sx={{ mt: 2 }}>
                  Back
                </Typography>
                <Typography id="modal-modal-ok" className="modal-description" sx={{ mt: 2 }}>
                  Ok
                </Typography>
              </div>
            </div>
            <div id="saved-screen">
              <Typography className="modal-modal-title" >
                Salmon saved!
              </Typography>
            </div>
          </Box>
        </Modal>
      </div>

      <Leva collapsed={false} flat={false} hidden={false}></Leva>
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
          /* minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2} */
          enableZoom={true}
          minDistance={2.5}
          maxDistance={10}
          enablePan={false}
        />
        <Stats />
      </Canvas>
    </>
  )
}