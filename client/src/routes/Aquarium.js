import React, { useEffect, Suspense, useState, useRef } from "react"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import { ErrorBoundary } from 'react-error-boundary'
import { OrbitControls, Html, useProgress, Stats } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import Lottie from "lottie-react";
import ReactPlayer from 'react-player'

import App from './App.js'
import WaterLights from "../components/waterLights.js"
import Model from "../components/model.js"
import { WS_SERVER } from "../env"
import {
  FixHue,
  FixSaturation,
  FixLightness,
  FixTexture,
  FixUScale,
  FixVScale
} from "../components/fixValues"
import logo from '../assets/video/logo_white.json'
import waterVideo from '../assets/video/video.mp4'


// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

function getRandomX(min, max, idx) {
  if (idx === 0) {
    return 0
  }
  return Math.random() * (max - min) + min
}

function getRandomY(idx, currentState, viewport) {
  if (currentState === "DISPLAY" && idx === 0) {
    return viewport.height * 1.35
  }
  const min = -1.4 - idx / 4
  const max = 1.4 + idx / 4
  return Math.random() * (max - min) + min
}

function getZ(idx) {
  return -idx / 2
}

function Fish({ fishes, currentState, animIndex }) {
  const { viewport } = useThree();

  const models = fishes.map((config, idx) => {
    return <Model
      castShadow={true}
      hue={FixHue(config.hue)}
      saturation={FixSaturation(config.saturation)}
      lightness={FixLightness(config.lightness)}
      uScale={FixUScale(config.scaleX)}
      vScale={FixVScale(config.scaleY)}
      textureIndex={FixTexture(config.texture)}
      position={[getRandomX(-viewport.width, viewport.width, idx), getRandomY(idx, currentState, viewport), getZ(idx)]}
      animIndex={animIndex}
      isAnimChanging={true}

      currentState={currentState}
      movementAnim={true}
      idx={idx}
      key={idx}
    />

  })

  return (
    <>
      <WaterLights />
      <ErrorBoundary>
        {models}
      </ErrorBoundary>
    </>
  )
}

let reload = false

export default function Water() {
  const [fishes, setFishes] = useState([])
  const [currentState, setCurrentState] = useState("WELCOME")

  const [animIndex, setAnimIndex] = useState(0)

  const connection = useRef(null)
  useEffect(() => {
    // start websocket client 
    const arduinoSocket = new WebSocket(`ws://${WS_SERVER}:9000`);
    arduinoSocket.onopen = (event) => {
      // send a message to server to request fish parameters
      arduinoSocket.send('gimme-fish')

      // update reference only when the connection is effectively updated
      connection.current = arduinoSocket
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
  }, []);
  // send fishes when new fish
  useEffect(() => {
    if (currentState === "DISPLAY") {
      connection.current?.send('gimme-fish')
    }
  }, [connection, currentState]);

  const [open, setOpen] = useState(false);
  const [configuratorVisible, setConfiguratorVisible] = useState(false)

  // read changes in state
  useEffect(() => {
    switch (currentState) {
      case "WELCOME": {
        reload = false
        break
      }
      case "CUSTOMIZE": {

        setOpen(true)
        setConfiguratorVisible(true);

        break
      }
      case "SAVE": {

        setConfiguratorVisible(false);

        break
      }
      case "DISPLAY": {
        reload = true
        setOpen(false)
        console.log(reload)

        break
      }
      default: {
        throw new Error('unknown state')
      }
    }
  }, [currentState])

  useEffect(() => {
    if (reload) {
      window.location.reload(false)
    }
  }, [reload])

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
          width={'100vw'}
          height={'100vh'}
        />
      </div>

      <div>
        <Modal
          open={open}
          sx={{
            backgroundColor: "rgb(255, 255, 255, 0.2)",
            backdropFilter: "blur(3px)"
          }}>
          <div>
            {
              configuratorVisible
                ? (
                  <Box id="configurator">
                    <App initialState={currentState} maxFishZoom={3} instructions={false} />
                  </Box>
                )
                : (
                  <div id="await-salmon">
                    <Lottie animationData={logo} loop={true} />
                  </div>
                )
            }
          </div>
        </Modal>
      </div >

      <Canvas
        id="canvas"
        // shadows
        camera={{
          // less fov, less perspective distortion
          fov: 30,
          position: [0, 0, 4],
          rotation: [0, 0, 0],
          zoom: 0.4
        }}
      >

        {/* to give the impression of something farther away */}
        <fog attach="fog" args={['#cecece', 0.1, 20]} />

        <Suspense fallback={<Loader />}>
          <Fish fishes={fishes} currentState={currentState} animIndex={animIndex} />
        </Suspense>
        <OrbitControls />

      </Canvas>
    </>
  )
}