import React, { /* useRef, useState, */ useEffect, Suspense } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import { OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { degToRad } from "three/src/math/MathUtils.js"


import WaterLights from "../components/waterlights.js"
// import Floor from "../components/floor.js" // for lights debugging
import Model from "../components/model.js"


function getRandom(min = 0, max = 5) {
  return Math.random() * (max - min) + min;
}

function newPosition(position, index) {
  for (let i = 0; i < index; i++) {
    position = [getRandom(-1, 1), getRandom(-1, 1), i - index]
    console.log("aaaaaahhhhhhhhh")
  }
  return position
}

function Fish() {
  const modelsData = [
    { "hue": 0, "saturation": 209, "lightness": 50, "texture": 3, "positionY": 0, "positionX": -5 },
    { "hue": 210, "saturation": 189, "lightness": 40, "texture": 0, "positionY": 5, "positionX": -5 },
    { "hue": 210, "saturation": 189, "lightness": 40, "texture": 0, "positionY": 5, "positionX": -5 },
    { "hue": 210, "saturation": 189, "lightness": 40, "texture": 0, "positionY": 5, "positionX": -5 },
    { "hue": 210, "saturation": 189, "lightness": 40, "texture": 0, "positionY": 5, "positionX": -5 },
    { "hue": 210, "saturation": 189, "lightness": 40, "texture": 0, "positionY": 5, "positionX": -5 },
    { "hue": 210, "saturation": 189, "lightness": 40, "texture": 0, "positionY": 5, "positionX": -5 },
    { "hue": 210, "saturation": 189, "lightness": 40, "texture": 0, "positionY": 5, "positionX": -5 },
  ]

  const models = modelsData.map((config, idx) => {
    return <Model
      castShadow={true}
      hue={config.hue}
      saturation={config.saturation}
      lightness={config.lightness}
      uScale={5}
      vScale={1}
      textureIndex={config.texture}
      // TODO for now we give random positions
      // position={[y, z, x]}
      position={[getRandom(-3, 3), getRandom(-3, 3), getRandom(-7, 0)]}
      animIndex={0}
      movementAnim={true}
      key={idx}
    />
  })

  // newPosition(models.position, models.length)
  for (let i = 0; i < models.length; i++) {
    models.position = [getRandom(-1, 1), getRandom(-1, 1), i - models.length]
    console.log("aaaaaahhhhhhhhh")
  }

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
      <div class={'modal-button'}>
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
          <Fish />
        </Suspense>
        <OrbitControls />

        <Stats />
      </Canvas>
    </>
  )
}


