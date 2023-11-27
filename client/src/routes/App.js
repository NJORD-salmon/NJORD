import React, { Suspense, useState, useEffect } from "react"
// OrbitControls to move the camera around
import { OrbitControls, ContactShadows, Stats, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Modal from "@mui/material/Modal"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
// GUI template to debug the sliders
import { Leva, useControls } from "leva"
import { isTypedArray } from "three/src/animation/AnimationUtils"

import Lights from "../components/light"
import Model from "../components/model"

// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

// const numberOfTextures = 4
// const textureRangeSize = 256 / numberOfTextures

function getTexture(texture, divider) {
  return Math.floor(texture / divider)
}

// configuration of the scale of the texture
const scaleXConfig = {
  value: 1,
  min: 0,
  max: 2,
  step: 0.01,
}
const scaleYConfig = {
  value: 1,
  min: 0,
  max: 4,
  step: 0.01,
}

const textureConfig = {
  value: 1,
  min: 0,
  max: 3,
  step: 1,
}

export default function App() {
  const [hue, setHue] = useState(6);
  const [saturation, setSaturation] = useState(93);
  const [lightness, setLightness] = useState(60);
  // const [texture, setTexture] = useState(0);
  // const [scaleX, setScaleX] = useState(1);
  // const [scaleY, setScaleY] = useState(1); 

  const [nextButton, setNextButton] = useState(false);
  const [okButton, setOkButton] = useState(false);
  const [backButton, setbackButton] = useState(false);

  const [open, setOpen] = React.useState(false);

  // TODO slider for scaling textures
  const { scaleX, scaleY, texture } = useControls({
    scaleX: scaleXConfig,
    scaleY: scaleYConfig,
    texture: textureConfig
  })

  // read changes of button with modal
  useEffect(() => {
    if (nextButton === 1) {
      // open the modal to save the salmon
      return () => setOpen(true)
    } else if (okButton === 1) {
      // close the modal, start animation and save the data
      return () => {
        alert("Saved")
        setOpen(false);
      }
    } else if (backButton === 1) {
      // just go back to customization
      return () => setOpen(false)
    }
  }, [nextButton, okButton, backButton])

  useEffect(() => {
    // start websocket client + change hue value
    const arduinoSocket = new WebSocket("ws://localhost:9000");
    arduinoSocket.onopen = (event) => {
      // if it works, then connection opened
      // console.log(event)
    };

    arduinoSocket.onmessage = (event) => {
      try {
        // parse JSON and set the parameters values
        const payload = JSON.parse(event.data);

        setHue((payload.values.hue) * 360 / 255);
        setSaturation((payload.values.saturation) * 100 / 255);
        setLightness(10 + (payload.values.lightness) * 90 / 255);
        // setTexture(payload.values.texture);
        //  TODO fix scale payload
        // setScaleX(payload.scaleX);
        // setScaleX(payload.scaleX);

        setNextButton(payload.values.next);
        setOkButton(payload.values.ok);
        setbackButton(payload.values.back);
        console.log(payload)
      }
      catch (error) {
        // Friendly message for debugging
        console.log('Error parsing JSON:', error, event.data);
      }
    };

    return () => arduinoSocket.close();
  }, []);

  return (
    <>
      <div>
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box id="box-modal">
            <Typography class="modal-modal-title">
              Do you want to save this salmon?
            </Typography>
            <Typography id="modal-modal-back" class="modal-description" sx={{ mt: 2 }}>
              Back
            </Typography>
            <Typography id="modal-modal-ok" class="modal-description" sx={{ mt: 2 }}>
              Ok
            </Typography>
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
            textureIndex={/* getTexture(texture, textureRangeSize) */ texture}
            modelScale={3.5}
            position={[0.5, 0, 0]}
            rotation={[0, 0.95, 0]}
          />
        </Suspense>

        <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={1.5} far={2} />

        <OrbitControls
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          enableZoom={false}
          enablePan={false}
        />
        <Stats />
      </Canvas>
    </>
  )
}
