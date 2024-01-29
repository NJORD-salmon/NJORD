import { forwardRef, useRef } from 'react'
import { useThree } from "@react-three/fiber"
import { Object3D, SpotLight } from 'three'
import { light } from '@mui/material/styles/createPalette'

const lightPositions = [4, 0, -4, -8, -12, -16, -20, -24]

// lights for the aquarium
const WaterLights = forwardRef((props, ref) => {
  const { viewport } = useThree()

  /* const spotlights = [];
   for (let i = 0; i < lightPositions.length; i++) {
       const spotlight = (
       <spotLight
         key={`spotlight-${i}`}
         position={[viewport.width - 4, viewport.height + 4, lightPositions[i]]}
         angle={M.9h.PI / 4}
         penumbra={0.75}
         intensity={1}
         castShadow
       />
     );
     spotlights.push(spotlight);
   }
 
   for (let i = 0; i < lightPositions.length; i++) {
      const targetObject = new Object3D()
      targetObject.position.set([-viewport.width, 4, lightPositions[i]])
  
      const light = new SpotLight()
      light.intensity = 5
      light.castShadow = true
      light.decay = 0
      light.angle = .98
      light.penumbra = 1
      light.position = [viewport.width - 1, viewport.height + 4, lightPositions]
      light.target = targetObject
      spotLights.push(light)
    }
    
      for (let i = 0; i < lightPositions.length; i++) {
        const obj = new Object3D()
        obj.position
        targetObject.push(obj)
      }
     */

  const target = new Object3D([-viewport.width, 0, lightPositions[0]])
  const target1 = new Object3D([-viewport.width, 0, lightPositions[1]])
  const target2 = new Object3D([-viewport.width, 0, lightPositions[2]])
  const target3 = new Object3D([-viewport.width, 0, lightPositions[3]])
  const target4 = new Object3D([-viewport.width, 0, lightPositions[4]])
  const target5 = new Object3D([-viewport.width, 0, lightPositions[5]])
  const target6 = new Object3D([-viewport.width, 0, lightPositions[6]])
  const target7 = new Object3D([-viewport.width, 0, lightPositions[7]])

  return (
    <>
      <hemisphereLight
        intensity={Math.PI / 4}
        position={[1, 1, 1]}
        scale={5}
        rotation={[Math.PI / 4, Math.PI / 5, Math.PI / 4]}
        args={[0xffffff, 0xffffff, 1.0]}
        color={0x7095c1}
        groundColor={0xcbc1b2}
      />
      <spotLight
        intensity={5}
        position={[viewport.width - 4, viewport.height + 4, lightPositions[0]]}
        castShadow
        decay={0}
        angle={1}
        penumbra={1}
        target={target}
      />
      <spotLight
        intensity={5}
        position={[viewport.width - 4, viewport.height + 2, lightPositions[1]]}
        castShadow
        decay={0}
        angle={1}
        penumbra={1}
        target={target1}
      />
      <spotLight
        intensity={5}
        position={[viewport.width - 2.5, viewport.height + 2, lightPositions[2]]}
        castShadow
        decay={0}
        angle={1}
        penumbra={1}
        target={target2}
      />
      <spotLight
        intensity={5}
        position={[viewport.width - 2.5, viewport.height + 2, lightPositions[3]]}
        castShadow
        decay={0}
        angle={1}
        penumbra={1}
        target={target3}
      />
      <spotLight
        intensity={5}
        position={[viewport.width - 2.5, viewport.height + 2, lightPositions[4]]}
        castShadow
        decay={0}
        angle={1}
        penumbra={1}
        target={target4}
      />
      <spotLight
        intensity={5}
        position={[viewport.width - 2.5, viewport.height + 2, lightPositions[5]]}
        castShadow
        decay={0}
        angle={1}
        penumbra={1}
        target={target5}
      />
      <spotLight
        intensity={5}
        position={[viewport.width - 2.5, viewport.height + 2, lightPositions[6]]}
        castShadow
        decay={0}
        angle={1}
        penumbra={1}
        target={target6}
      />
      <spotLight
        intensity={5}
        position={[viewport.width - 2.5, viewport.height + 2, lightPositions[7]]}
        castShadow
        decay={0}
        angle={1}
        penumbra={1}
        target={target7}
      />
      <pointLight
        position={[-viewport.width, -viewport.height, 3]}
        decay={0.8}
        intensity={1}
        castShadow
      />
      <pointLight
        position={[-viewport.width, -viewport.height, -7]}
        decay={0.8}
        intensity={1}
        castShadow
      />
      <pointLight
        position={[-viewport.width, -viewport.height, -19]}
        decay={0.8}
        intensity={1}
        castShadow
      />
      {/* {spotlights} */}
    </>
  )
})

export default WaterLights