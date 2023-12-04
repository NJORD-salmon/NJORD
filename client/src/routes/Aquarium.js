import React, { /* useRef, useState, */ useEffect, Suspense } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { degToRad } from "three/src/math/MathUtils.js"

import WaterLights from "../components/waterlights.js"
// import Floor from "../components/floor.js" // for lights debugging
import Model from "../components/model.js"

function getRandom(min = 0, max = 5) {
  return Math.random() * (max - min) + min;
}

function Fish() {
  const modelsData = [
    { "hue": 0, "saturation": 209, "lightness": 50, "texture": 3, "positionY": -4 },
    /*{ "hue": 149, "saturation": 189, "lightness": 40, "texture": 0, "positionY": -3 },
    { "hue": 120, "saturation": 196, "lightness": 86, "texture": 1} */
  ]



  const models = modelsData.map(config => (<Model
    castShadow={true}
    hue={config.hue}
    saturation={config.saturation}
    lightness={config.lightness}
    uScale={5}
    vScale={1}
    textureIndex={config.texture}
    // TODO for now we give random positions
    // position={[y, z, x]}
    position={[/* getRandom(-4.2, 4.2) */ config.positionY, getRandom(-1.5, 1.5), /* getRandom(-7, 1.5) */-1]}
    animIndex={0}
    movementAnim={true}
  />))



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

  useEffect(() => {
    // start websocket client + change hue value
    const arduinoSocket = new WebSocket("ws://localhost:9000");
    arduinoSocket.onopen = (event) => {
      // if it works, then connection opened
      // console.log(event)
    };

    arduinoSocket.onmessage = (event) => {
      try {

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
      <div>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box id="modal-configurator" sx={{ mt: 2 }}>
            <iframe src="http://localhost:3000/configurator" title="salmon_window"></iframe>
          </Box>
        </Modal>
      </div >

      <Canvas
        // TODO fix orthographic camera to get better fish motion
        // orthographic
        shadows
        camera={{
          fov: 75,
          position: [0, 0, 3],
          rotation: [0, 0, 0],
        }} >

        <fog attach="fog" args={['#3b9ed1', 0.1, 15]} />
        {/* <color attach="background" args={['#3b9ed1']} /> */}


        <Suspense>
          <Fish />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  )
}


