import { useState } from "react"

import AnimButton from "./animButton"
import SalmonDescription from "./salmonDescription"


export default function VisualizerUI({ salmonParams, animationInfo, swimAnimations = 3 }) {
  const { setAnimIndex } = animationInfo

  // set which button is active
  const [activeButton, setActiveButton] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  const buttons = []
  for (let i = 0; i < swimAnimations; i++) {
    buttons.push(
      <AnimButton
        index={i}
        setAnimIndex={setAnimIndex}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />)
  }

  return (
    <>
      {/* if salmon data are closed, then buttons position is absolute */}
      {showDetails
        ? null
        : <div id="buttons-closed-details">
          <div id="swims">
            {buttons}
          </div>

          <div id={"info"}>
            <div id={"change-info"}
              onClick={() => {
                setShowDetails(!showDetails)
              }}>

              {showDetails
                ? "click to view your salmon"
                : "click to view your salmon data"
              }
            </div>
          </div>
        </div>
      }

      {/* if salmon data are open, then buttons becomes the container's child */}
      <div className={showDetails
        ? "viz-ui-container"
        : "no-overlay"
      }>
        {showDetails
          ? <SalmonDescription salmonParams={salmonParams} />
          : null
        }

        <div id={
          showDetails
            ? "buttons"
            : "no-buttons"}>
          <div id="swims">
            {buttons}
          </div>

          <div id={"info"}>
            <div id={"change-info"}
              onClick={() => {
                setShowDetails(!showDetails)
              }}>

              {showDetails
                ? "click to view your salmon"
                : "click to view your salmon data"
              }
            </div>
          </div>
        </div>
      </div >
    </>
  )
}