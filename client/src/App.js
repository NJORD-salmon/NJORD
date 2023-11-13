import { Suspense } from "react"
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




// start websocket client + change hue value
// const arduinoSocket = new WebSocket("ws://localhost:9000");

// arduinoSocket.onopen = (event) => {
//   document.querySelector("#root").innerHTML += '<p>Connection Opened</p>'
// };



// arduinoSocket.onmessage = (event) => {
//   document.querySelector("#root").innerHTML += `<p>${event.data}</p>`
//   // TODO
//   const payload = JSON.parse(event.data)

//   console.log(payload.hue)
// };





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
  // slider to change color
  const { hue, saturation, lightness } = useControls({
    hue: hueConfig,
    saturation: saturationConfig,
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

  return (
    <>

      <Leva collapsed={false} flat={false} ></Leva>
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
