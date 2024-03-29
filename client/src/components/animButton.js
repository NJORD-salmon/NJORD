export default function AnimButton({ index, setAnimIndex, activeButton, setActiveButton }) {

  const className = activeButton === index
    ? `change-swim active-button${index}`
    : "change-swim"

  return (
    <div
      className={className}
      id={`swim${index}`}
      onClick={() => {
        setActiveButton(index)
        setAnimIndex(index)
      }}>
      swim {index + 1}
    </div >
  )
}