import { useRef,/* useState, useEffect,*/ Suspense } from "react"
// OrbitControls to move the camera around
import { OrbitControls } from "@react-three/drei"
import { Canvas, /* useFrame, useLoader*/ } from "@react-three/fiber"
// load progress
import { Html, useProgress } from "@react-three/drei"
import Model from "./model"
import { useControls } from 'leva'
import { Leva } from 'leva'

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

const hueConfig = {
  value: 0,
  min: 0,
  max: 360,
  step: 1,
}

const saturarionConfig = {
  value: 100,
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

export default function App() {
  const { hue, saturarion, lightness } = useControls({
    hue: hueConfig,
    saturarion: saturarionConfig,
    lightness: lightnessConfig
  })

  const { scaleX, scaleY } = useControls({
    scaleX: scaleXConfig,
    scaleY: scaleYConfig
  })

  return (
    <>
      <Leva collapsed={true} flat={false} ></Leva>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={.9} />

        <Suspense fallback={<Loader />}>
          <Model hue={hue} saturation={saturarion} lightness={lightness} uScale={scaleX} vScale={scaleY} />
        </Suspense>

        <OrbitControls />
      </Canvas>
    </>
  )
}