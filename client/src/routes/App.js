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

let currentState

const numberOfTextures = 6
const textureRangeSize = 256 / numberOfTextures

function getTexture(texture, divider) {
  return Math.floor(texture / divider)
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
        //setTexture(payload.values.texture);
        //  TODO fix scale payload
        // setScaleX(payload.scaleX);
        // setScaleX(payload.scaleX);

        setNextButton(payload.values.next);
        setOkButton(payload.values.ok);
        setbackButton(payload.values.back);
        console.log(payload)

        // TODO: fix modals
        currentState = payload.currentState
        console.log(currentState)
      }
      catch (error) {
        // Friendly message for debugging
        console.log('Error parsing JSON:', error, event.data);
      }
    };

    return () => arduinoSocket.close();
  }, []);

  // read changes of button with modal
  useEffect(() => {
    if (currentState === "SAVE") {
      // open the modal to save the salmon
      return () => setOpen(true)
    } else if (currentState === "DISPLAY") {
      // close the modal, start animation and save the data
      return () => {
        //  mostra conferma di salvataggio
        display()
        setTimeout(() => {
          // code is executed after 1 second
          setOpen(false)
        }, 5000)
      }
    } else if (currentState === "CUSTOMIZE") {
      // just go back to customization
      return () => setOpen(false)
    }
  }, [nextButton, okButton, backButton])

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
            textureIndex={/* getTexture(texture, textureRangeSize) */ texture}
            modelScale={3.5}
            position={[0.5, 0, 0]}
            rotation={[0, 0.95, 0]}
            animIndex={0}
          />
        </Suspense>

        <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={1.5} far={2} />

        <OrbitControls
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          enableZoom={false}
          enablePan={false}
        />
        {/* <Stats /> */}
      </Canvas>
    </>
  )
}

function display() {
  if (document.getElementById("saved-screen").style.display === "none") {
    document.getElementById("saved-screen").style.display = "block";
  } else {
    document.getElementById("saved-screen").style.display = "none";
  }
}