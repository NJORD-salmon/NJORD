import React, { useRef, useState, Suspense } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import { OrbitControls, Stats, TransformControls, } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"


import Caustics from "../components/caustic"
import WaterLights from "../components/waterlights"
import Floor from "../components/floor"
import Model from "../components/model"

// modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  height: 600,
  border: '2px solid #000',
  boxShadow: 24,
};

function Fish() {
  const [transform, setTransfrom] = useState()
  const size = 5

  const floorSize = 100

  const modelsData = [
    { "hue": 0, "saturation": 209, "lightness": 71, "texture": 3 },
    /*     { "hue": 149, "saturation": 189, "lightness": 81, "texture": 0 }*/
  ]

  const models = modelsData.map(config => (<Model
    castShadow
    hue={config.hue}
    saturation={config.saturation}
    lightness={config.lightness}
    uScale={1}
    vScale={1}
    textureIndex={config.texture}
    position={[getRandom(-5, 5), getRandom(-5, 5), getRandom(-5, 5)]}
  />))



  return (
    <>
      <WaterLights />{/* ref={(r) => void (r && setTransfrom(r))} */}
      {/*   <Caustics target={transform?.object}>
        <Floor size={floorSize * 3} position={[0, - size / 4, 0]} rotation-x={-Math.PI / 2} />
        <Floor Size={floorSize * 1.2} position={[0, size / 4, -size / 2]} />
        <Floor Size={floorSize * 1.2} position={[size / 1.7, size / 4, 0]} rotation-y={-Math.PI / 2} />
        <Floor size={floorSize} position={[-size / 1.7, size / 4, 0]} rotation-y={Math.PI / 2} />


        <TransformControls>
          <group position-y={0.5} rotation-y={-Math.PI / 4}>
            
          </group>
        </TransformControls>
      </Caustics> */}
      {models}

    </>
  )
}

export default function Water() {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <iframe src="http://localhost:3000/configurator" width={1200} height={600}></iframe>
          </Box>
        </Modal>
      </div>


      <Canvas
        shadows
        camera={{ fov: 75, position: [0, 0, 6], rotation: [0, 0, 0], zoom: 0.6 }
        }>

        {/* <fog attach="fog" args={['#3b9ed1', 0.1, 15]} /> */}
        {/* <color attach="background" args={['#3b9ed1']} /> */}
        {/*  <WaterLights />
        <Caustics >
          <Floor size={size * 3} position={[0, - size / 4, 0]} rotation-x={-Math.PI / 2} />
          <Floor size={size * 1.2} position={[0, size / 4, -size / 2]} />
          <Floor size={size * 1.2} position={[size / 1.7, size / 4, 0]} rotation-y={-Math.PI / 2} />
          <Floor size={size} position={[-size / 1.7, size / 4, 0]} rotation-y={Math.PI / 2} />

          {models}

        </Caustics> */}

        {/* <Stats /> */}
        <OrbitControls />

        <Suspense>
          <Fish />
        </Suspense>


      </Canvas>
    </>
  )
}

function getRandom(min = 0, max = 5) {
  return Math.random() * (max - min) + min;
}
