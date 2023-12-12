import React, { useEffect, Suspense, useState } from "react"
import Box from "@mui/material/Box"
import Button from '@mui/material/Button'
import Modal from "@mui/material/Modal"
import { OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { degToRad } from "three/src/math/MathUtils.js"

import WaterLights from "../components/waterlights.js"
// import Floor from "../components/floor.js" // for lights debugging
import Model from "../components/model.js"
import { SERVER_ADDRESS } from "../env"
import {
  FixHue,
  FixSaturation,
  FixLightness,
  FixTexture,
  FixUScale,
  FixVScale
} from "../components/fixValues"

function getRandomY(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomZ(idx) {
  const min = -1.5 - idx / 4
  const max = 1.5 + idx / 4
  return Math.random() * (max - min) + min;
}

function Fish({ fishes }) {

  const models = fishes.map((config, idx) => {
    return <Model
      castShadow={true}
      hue={FixHue(config.hue)}
      saturation={FixSaturation(config.saturation)}
      lightness={FixLightness(config.lightness)}
      uScale={FixUScale(config.scaleX)}
      vScale={FixVScale(config.scaleY)}
      textureIndex={FixTexture(config.texture)}
      // TODO for now we give random positions
      // position={[y, z, x]}
      position={[getRandomY(-3, 3), getRandomZ(idx), -idx / 2]}
      animIndex={0}
      movementAnim={true}
      key={idx}
    />
  })

  return (
    <>
      <WaterLights />

      {/* for debugging */}
      {/* <Floor sizeY={6} sizeX={22} position={[0, -2, 0]} rotation-x={-Math.PI / 2} />
      <Floor sizeY={12} sizeX={22} position={[0, 4, -3]} />
      <Floor sizeY={12} sizeX={6} position={[11, 4, 0]} rotation-y={-Math.PI / 2} />
      <Floor sizeY={12} sizeX={6} position={[-11, 4, 0]} rotation-y={Math.PI / 2} /> */}

      {models}
    </>
  )
}

export default function Water() {
  const [fishes, setFishes] = useState([])
  const [currentState, setCurrentState] = useState("CUSTOMIZE");

  useEffect(() => {
    // start websocket client 
    const arduinoSocket = new WebSocket(`ws://${SERVER_ADDRESS}:9000`);
    arduinoSocket.onopen = (event) => {
      // if it works, then connection opened
      // send a message to server to request fish parameters
      arduinoSocket.send('gimme-fish')
    };

    arduinoSocket.onmessage = (event) => {
      try {
        // if there are fishes in the JSON, then change fishes state
        const payload = JSON.parse(event.data)
        if (payload?.fishes?.length > 0) {
          console.log(payload)
          setFishes(payload.fishes)
        }
      }
      catch (error) {
        // Friendly message for debugging
        console.log('Error parsing JSON:', error, event.data);
      }
    };

    return () => arduinoSocket.close();
  }, []);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // read changes to manage modal
  /*useEffect(() => {
   switch (currentState) {
      case "CUSTOMIZE": {
        setOpen(true)
        break
      }
      case "DISPLAY": {
        setOpen(false)
 
        break
      }
      default: {
        throw new Error('unknown state')
      }
    }
  }, [currentState])
 */
  return (
    <>
      <div className={'modal-button'}>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box id="modal-configurator" sx={{ mt: 2 }}>
            <iframe src={`http://${SERVER_ADDRESS}:3000/configurator`} title="salmon_window"></iframe>
          </Box>
        </Modal>
      </div >

      <Canvas
        shadows
        camera={{
          fov: 30,
          position: [0, 0, 3],
          rotation: [0, 0, 0],
          zoom: 0.4

        }} >

        <fog attach="fog" args={['#cecece', 0.1, 20]} />

        <Suspense>
          <Fish fishes={fishes} />
        </Suspense>
        <OrbitControls />

        <Stats />
      </Canvas>
    </>
  )
}