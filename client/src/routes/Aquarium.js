import React, { useEffect, Suspense, useState, useRef } from "react"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import { ErrorBoundary } from 'react-error-boundary'
import { OrbitControls, Stats, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Lottie from "lottie-react";
import ReactPlayer from 'react-player'


import WaterLights from "../components/waterlights.js"
// import Floor from "../components/floor.js" // for lights debugging
import Caustics from "../components/caustics.js"
import Model from "../components/model.js"
import { SERVER_ADDRESS, WS_SERVER } from "../env"
import {
  FixHue,
  FixSaturation,
  FixLightness,
  FixTexture,
  FixUScale,
  FixVScale
} from "../components/fixValues"
import logo from '../assets/video/data.json'
import waterVideo from '../assets/video/video.mp4'


// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

function getRandomY(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomZ(idx) {
  const min = -1.4 - idx / 4
  const max = 1.4 + idx / 4
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
      // TODO fix z positions
      // position={[y, z, x]}
      position={[getRandomY(-3, 3), getRandomZ(idx), -idx / 2]}
      rotation
      animIndex={0}
      movementAnim={true}
      key={idx}
    />
  })

  return (
    <>
      <WaterLights />
      <Caustics>

        {/* for debugging
      <Floor sizeY={12} sizeX={22} position={[0, 0, -5]} />
      <Floor sizeY={6} sizeX={22} position={[0, -2, 0]} rotation-x={-Math.PI / 2} />
      <Floor sizeY={12} sizeX={6} position={[11, 4, 0]} rotation-y={-Math.PI / 2} />
      <Floor sizeY={12} sizeX={6} position={[-11, 4, 0]} rotation-y={Math.PI / 2} /> */}

        <ErrorBoundary>
          {models}
        </ErrorBoundary>
      </Caustics>
    </>
  )
}

export default function Water() {
  const [fishes, setFishes] = useState([])
  const [currentState, setCurrentState] = useState("CUSTOMIZE");

  useEffect(() => {
    // start websocket client 
    const arduinoSocket = new WebSocket(`ws://${WS_SERVER}:9000`);
    arduinoSocket.onopen = (event) => {
      // send a message to server to request fish parameters
      arduinoSocket.send('gimme-fish')
    };

    arduinoSocket.onmessage = (event) => {
      try {
        // if there are fishes in the JSON, then change fishes state
        const payload = JSON.parse(event.data)
        if (payload?.fishes?.length > 0) {
          setFishes(payload.fishes)
        }

        setCurrentState(payload.currentState)
      }
      catch (error) {
        // Friendly message for debugging
        console.log('Error parsing JSON:', error, event.data);
      }
    };

    return () => arduinoSocket.close();
  }, [currentState]);

  const [open, setOpen] = React.useState(false);

  // read changes to manage modal
  useEffect(() => {
    switch (currentState) {
      case "TUTORIAL": {
        setOpen(true)
        break
      }
      case "CUSTOMIZE": {
        setOpen(true)
        // TODO: fix modals in the water
        document.getElementById("await-salmon").style.display = "none";
        break
      }
      case "SAVE": {
        setOpen(true)
        document.getElementById("modal-configurator").style.display = "none";
        document.getElementById("await-salmon").style.display = "block";
        break
      }
      case "DISPLAY": {
        setOpen(false)
        document.getElementById("await-salmon").style.display = "none";
        break
      }
      default: {
        throw new Error('unknown state')
      }
    }
  }, [currentState])


  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => {
    setIsVideoLoaded(true);
  };

  return (
    <>
      <div id="bkg">
        <ReactPlayer
          url={waterVideo}
          playing={true}
          controls={false}
          loop={true}
          muted={true}
          playsinline={true}
          onReady={onLoadedData}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>

      <div id="await-salmon">
        <Lottie animationData={logo} loop={true} />
      </div>

      <div className={'modal-button'}>
        <Modal open={open}>
          <Box id="modal-configurator" sx={{ mt: 2 }}>
            <iframe src={`${SERVER_ADDRESS}/configurator`} title="salmon_window" ></iframe>
          </Box>
        </Modal>
      </div >

      <Canvas
        // shadows
        camera={{
          // less fov, less perspective distortion
          fov: 30,
          position: [0, 0, 4],
          rotation: [0, 0, 0],
          zoom: 0.4
        }} >

        {/* to give the impression of something farther away */}
        <fog attach="fog" args={['#cecece', 0.1, 20]} />

        <Suspense fallback={<Loader />}>
          <Fish fishes={fishes} />
        </Suspense>
        <OrbitControls />

        {<Stats />}
      </Canvas>
    </>
  )
}