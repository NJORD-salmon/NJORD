import { useHelper } from '@react-three/drei'
import { forwardRef, useRef } from 'react'
import { DirectionalLightHelper } from 'three'

// lights for the aquarium
const WaterLights = forwardRef((props, ref) => {
  const dirLight = useRef()

  useHelper(dirLight.current, DirectionalLightHelper, 5)

  return (
    <>
      <hemisphereLight
        intensity={Math.PI / 5}
        position={[1, 1, 1]}
        scale={5}
        rotation={[Math.PI / 4, Math.PI / 5, Math.PI / 4]}
        args={[0xffffff, 0xffffff, 1.0]}
        color={0x7095c1}
        groundColor={0xcbc1b2}
      />
      <directionalLight
        intensity={1}
        ref={dirLight}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-22}
        shadow-camera-bottom={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
      />
      <pointLight
        position={[-9, 3, 2]}
        decay={0}
        intensity={0.8}
        castShadow
      />
      <pointLight
        position={[9, 3, 2]}
        decay={0}
        intensity={0.8}
        castShadow
      />
      <pointLight
        position={[0, 3, 4]}
        decay={0}
        intensity={0.8}
        castShadow
      />
    </>
  )
})

export default WaterLights