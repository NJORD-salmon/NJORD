
// import { RepeatWrapping } from 'three'

export function Floor({ size = 30, ...props }) {
  /*const textureRepeat = size / 2 / 2
 const tex = useTexture(
   'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@latest/prototype/light/texture_08.png',
   (t) => {
     t.wrapS = t.wrapT = RepeatWrapping
     t.repeat.set(textureRepeat, textureRepeat)
   }
 ) */

  return (
    <mesh castShadow receiveShadow {...props}>
      <planeGeometry args={[size, size, 256, 256]} />
      <meshPhysicalMaterial color={"gray"}
      />
    </mesh>
  )
}
