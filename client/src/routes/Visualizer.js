import React, { Suspense, useRef } from "react"
// OrbitControls to move the camera around
import { OrbitControls, ContactShadows, Html, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import { useDrag, useGesture } from "@use-gesture/react"
import { useSpring, useSprings, useTransition, animated, config, to } from 'react-spring'


import Lights from "../components/light"
import Model from "../components/model"
import logo from '../assets/video/logo.json'
import summary from '../assets/img/prova2.png'


// view the load progress
function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

const BOTTOM_POINT = window.innerHeight - 40;

export default function Visualizer() {
  const [searchParams] = useSearchParams();
  // here it is not necessary to fix the values since they don't change 
  // and they have already been managed before
  const { h, s, l, u, v, t } = Object.fromEntries(searchParams.entries())

  // max height
  // const height = Math.round(window.innerHeight * 0.9)

  // const draggingYRef = useRef(false)
  // const lockYRef = useRef(false)

  // sheet position by y axis
  // const [{ y }, setY] = useSpring(() => ({ y: height }))




  // const open = ({ canceled }) => {
  //   // when cancel is true, it means that the user passed the upwards threshold
  //   // so we change the spring config to create a nice wobbly effect
  //   setY({ y: 0, config: canceled ? config.wobbly : config.stiff })
  // }
  // const close = (velocity = 0) => {
  //   setY({ y: height, config: { ...config.stiff, velocity } })
  // }

  // const bindY = useDrag(
  //   ({ first, last, vxvy: [, vy], movement: [, my], cancel, canceled }) => {
  //     if (first) {
  //       draggingYRef.current = true
  //     } else if (last) {
  //       // If this is not the first or last frame, it's a moving frame
  //       // then it means the user is dragging
  //       draggingYRef.current = false
  //     }

  //     // Cancel drag if already dragging in other direction
  //     if (lockYRef.current) {
  //       cancel()
  //       return
  //     }

  //     // If the user drags up passed a threshold, then we cancel
  //     // the drag so that the sheet resets to its open position
  //     if (my < -70) {
  //       cancel()
  //     }

  //     // When the user releases the sheet, we check whether it passed
  //     // the threshold for it to close, or if we reset it to its open positino
  //     if (last) {
  //       if (my > height * 0.75 || vy > 0.5) {
  //         close(vy)
  //       } else {
  //         open({ canceled })
  //       }
  //     } else {
  //       // When the user keeps dragging, we just move the sheet according to
  //       // the cursor position
  //       setY({ y: my, immediate: true, config: config.stiff })
  //     }
  //   },
  //   { from: () => [0, y.get()], bounds: { top: 0 }, rubberband: true, axis: 'y' }
  // )

  // const display = y.to(py => (py < height ? 'block' : 'none'))

  const posHandle = useSpring({ y: BOTTOM_POINT })
  const bindHandle = useDrag((params) => {
    if (params.dragging) {
      if (params.xy[1] > 0 && params.xy[1] < BOTTOM_POINT) {
        posHandle.y.set(params.xy[1]);
      }
    } else {
      if (params.xy[1] < BOTTOM_POINT / 2) {
        posHandle.y.start(0);
      } else {
        posHandle.y.start(BOTTOM_POINT);
      }
    }
  }, {
    bounds: { top: 0, bottom: BOTTOM_POINT },
  });

  return (
    <>
      <div id="logo">
        <Lottie animationData={logo} loop={true} id="lottie" />
      </div>

      {/*      <animated.div id="summary" {...bindY()} style={{
        touchAction: "none",
        MozUserSelect: "none",
        WebkitUserSelect: "none",
        userSelect: "none"
      }}>
        <img src={summary} alt="order summary" />
      </animated.div> */}

      <animated.div {...bindHandle()} style={{
        touchAction: "none",
        y: posHandle.y
      }}
        className="handle-container" >
        <div className="handle" />
      </animated.div>
      <animated.div id="overlay" style={{
        y: posHandle.y,
        opacity: posHandle.y.to([0, BOTTOM_POINT], [1, 0.8])
      }} />

      <Canvas shadows >
        <Lights />

        <Suspense fallback={<Loader />}>
          <Model
            hue={h ?? 6}
            saturation={s ?? 93}
            lightness={l ?? 60}
            uScale={u ?? 1}
            vScale={v ?? 1}
            textureIndex={t ?? 4}
            modelScale={3.5}
            position={[0.5, 0, 0]}
            rotation={[0, 0.95, 0]}
            animIndex={0}
          />
        </Suspense>

        {/* <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={1.5} far={2} /> */}

        <OrbitControls
          enableZoom={true}
          minDistance={2.5}
          maxDistance={10}
          enablePan={false}
        />
      </Canvas>
    </>
  )
}
