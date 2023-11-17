import { Suspense, useState } from "react"
// OrbitControls to move the camera around
import { OrbitControls } from "@react-three/drei"
import { Canvas,/* useFrame, useLoader*/ } from "@react-three/fiber"
// load progress
import { Html, useProgress } from "@react-three/drei"
import Model from "./model"
// GUI template to debug the sliders
import { useControls } from 'leva'
import { Leva } from 'leva'

// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

// configuration of the HSL value and characteristics
const hueConfig = {
  value: 0,
  min: 0,
  max: 360,
  step: 1,
}

const saturationConfig = {
  value: 50,
  min: 0,
  max: 100,
  step: 1,
}

const lightnessConfig = {
  value: 50,
  min: 10,
  max: 90,
  step: 1,
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

// configuration of the type of texture
const textureConfig = {
  value: 0,
  min: 0,
  max: 2,
  step: 1
}

export default function App() {
  // TODO check useState and applications
  const [hue, setHue] = useState(6);
  const [saturation, setSaturation] = useState(93);
  // usestate 60 for lightness to have salmon color

  // slider to change color
  const { lightness } = useControls({
    // hue: hueConfig,
    // saturation: saturationConfig,
    lightness: lightnessConfig
  })

  // slider for scaling textures
  const { scaleX, scaleY } = useControls({
    scaleX: scaleXConfig,
    scaleY: scaleYConfig
  })

  // slider to change the texture to visualise
  const { texture } = useControls({
    texture: textureConfig
  })

  // TODO manage connection
  // start websocket client + change hue value
  const arduinoSocket = new WebSocket("ws://localhost:9000");
  arduinoSocket.onopen = (event) => {
    // document.querySelector("#root").innerHTML += '<p>Connection Opened</p>'
    console.log(event)
  };

  arduinoSocket.onmessage = (event) => {
    try {
      // parse JSON and set the parameters values
      const payload = JSON.parse(event.data);
      setHue(payload.hue * 360 / 255)
      setSaturation(payload.saturation * 100 / 255)
      console.log(payload)
    }
    catch (error) {
      console.log('Error parsing JSON:', error, event.data); /*✔️ Friendly message for debugging ! */
    }
  };

  return (
    <>

      <Leva collapsed={false} flat={false} hidden={false}></Leva>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={.9} />

        <Suspense fallback={<Loader />}>
          <Model
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            uScale={scaleX}
            vScale={scaleY}
            textureIndex={texture}
          />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </>
  )
}
