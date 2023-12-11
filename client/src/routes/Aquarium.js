import React, { useEffect, Suspense, useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import { OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { degToRad } from "three/src/math/MathUtils.js"

import WaterLights from "../components/waterlights.js"
// import Floor from "../components/floor.js" // for lights debugging
import Model from "../components/model.js"
import { FixHue, FixSaturation, FixLightness } from "../components/fixValues.js"
import { SERVER_ADDRESS } from "../env"


function getRandom(min = 0, max = 5) {
  return Math.random() * (max - min) + min;
}

function Fish({ fishes }) {

  const models = fishes.map((config, idx) => {
    return <Model
      castShadow={true}
      hue={FixHue(config.hue)}
      saturation={FixSaturation(config.saturation)}
      lightness={FixLightness(config.lightness)}
      uScale={1}
      vScale={1}
      textureIndex={config.texture ?? 0}
      // TODO for now we give random positions
      // position={[y, z, x]}
      position={[getRandom(-3, 3), getRandom(-2, 2),/*  getRandom(-7, 0) */ -idx / 2]}
      animIndex={0}
      movementAnim={true}
      key={idx}
    />
  })

  return (
    <>

      <WaterLights />

      {/* for debugging */}
      {/*<Floor sizeY={6} sizeX={22} position={[0, -2, 0]} rotation-x={-Math.PI / 2} />
        <Floor sizeY={12} sizeX={22} position={[0, 4, -3]} />
         <Floor sizeY={12} sizeX={6} position={[11, 4, 0]} rotation-y={-Math.PI / 2} />
        <Floor sizeY={12} sizeX={6} position={[-11, 4, 0]} rotation-y={Math.PI / 2} /> */}

      {models}

    </>
  )
}

export default function Water() {
  const [fishes, setFishes] = useState([])

  useEffect(() => {
    // start websocket client 
    const arduinoSocket = new WebSocket(`ws://${SERVER_ADDRESS}:9000`);
    arduinoSocket.onopen = (event) => {
      // if it works, then connection opened
      // send a messagge to server to request fish parameters
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

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <>
      <div className={'modal-button'}>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
          open={openModal}
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
        // TODO fix orthographic camera to get better fish motion
        // orthographic
        shadows
        camera={{
          fov: 30,
          position: [0, 0, 3],
          rotation: [0, 0, 0],
          zoom: 0.4

        }} >

        <fog attach="fog" args={['#cecece', 0.1, 15]} />

        <Suspense>
          <Fish fishes={fishes} />
        </Suspense>
        <OrbitControls />

        <Stats />
      </Canvas>
    </>
  )
}