export default function Lights() {
  // lights for the configurator
  return (
    <>
      <ambientLight intensity={Math.PI} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} castShadow shadow-mapSize={1024} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={.9} />
    </>
  )
}