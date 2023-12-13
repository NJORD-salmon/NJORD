export default function Floor({ sizeX = 30, sizeY = 30, ...props }) {
  // floor for debugging aquarium
  return (
    <mesh castShadow receiveShadow {...props}>
      <planeGeometry args={[sizeX, sizeY, 256, 256]} />
      <meshPhysicalMaterial color={"gray"}
      />
    </mesh>
  )
}
