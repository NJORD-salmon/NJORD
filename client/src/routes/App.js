import { Suspense, useState, useEffect } from "react"
// OrbitControls to move the camera around
import { OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
// load progress
import { Html, useProgress } from "@react-three/drei"
import Lights from "../components/light"
import Model from "../components/model"
// GUI template to debug the sliders
import { Leva, useControls } from 'leva'
import { isTypedArray } from "three/src/animation/AnimationUtils"

const numberOfTextures = 4
const textureRangeSize = 256 / numberOfTextures

// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

function getTexture(texture, divider) {
  return Math.floor(texture / divider)
}

// configuration of the HSL value and characteristics
/* const hueConfig = {
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
  value: 60,
  min: 10,
  max: 90,
  step: 1,
}

// configuration of the type of texture
const textureConfig = {
  value: 0,
  min: 0,
  max: 3,
  step: 1
}*/

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

export default function App() {
  const [hue, setHue] = useState(6);
  const [saturation, setSaturation] = useState(93);
  const [lightness, setLightness] = useState(60);
  const [texture, setTexture] = useState(0);
  // const [scaleX, setScaleX] = useState(1);
  // const [scaleY, setScaleY] = useState(0); 

  const [nextButton, setNextButton] = useState(false);
  const [okButton, setOkButton] = useState(false);
  const [prevButton, setPrevButton] = useState(false);

  // const { texture } = useControls({
  //   texture: textureConfig
  // })

  // slider for scaling textures
  const { scaleX, scaleY } = useControls({
    scaleX: scaleXConfig,
    scaleY: scaleYConfig
  })

  useEffect(() => {
    if (nextButton === 1) {
      return () => alert("Do you want this salmon?")
    }
  }, [nextButton])

  // TODO manage connection
  // TODO understand why it continues to flick => that's because 1) it is not attached correctly; 2) it continues to get values

  // read changes of button
  // TODO add a delay to stop from asking or debounce?
  useEffect(() => {
    // start websocket client + change hue value
    const arduinoSocket = new WebSocket("ws://localhost:9000");
    arduinoSocket.onopen = (event) => {
      // if it works, then connection opened
      // console.log(event)
    };

    // TODO UNDERSTAND WHY IT FLICKS => imposta intervallo oppure invia meno valori da arduino
    arduinoSocket.onmessage = (event) => {
      try {
        // parse JSON and set the parameters values
        const payload = JSON.parse(event.data);

        setHue((payload.values.hue) * 360 / 255);
        setSaturation((payload.values.saturation) * 100 / 255);
        setLightness(10 + (payload.values.lightness) * 90 / 255);
        setTexture(payload.values.texture);
        //  TODO fix scale payload
        // setScaleX(payload.scaleX);
        // setScaleX(payload.scaleX);

        setNextButton(payload.values.next);
        setOkButton(payload.values.ok);
        setPrevButton(payload.values.prev);
        console.log(payload)
      }
      catch (error) {
        // Friendly message for debugging
        console.log('Error parsing JSON:', error, event.data);
      }
    };

    return () => arduinoSocket.close()
  }, []);

  return (
    <>
      <Leva collapsed={false} flat={false} hidden={false}></Leva>
      {/* TODO: add modal for saving ?? */}
      {/* <div style={{ zIndex: 100, textAlign: "center" }}><h1>Ciaone</h1></div> */}
      <Canvas>
        <Lights />

        <Suspense fallback={<Loader />}>
          <Model
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            uScale={scaleX}
            vScale={scaleY}
            // TODO da ottimizzare
            textureIndex={getTexture(texture, textureRangeSize)}
          />
        </Suspense>

        <OrbitControls
          autoRotate
          autoRotateSpeed={1.5}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          enableZoom={false}
          enablePan={true}
        />
        <Stats />
      </Canvas>
    </>
  )
}
