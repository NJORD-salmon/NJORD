const textureName = [
  "tulips",
  "leaf",
  "imprint",
  "cascade",
  "zinc",
  "plasma",
  "zebra",
  "waves",
  "microbe",
]

const randomIngredients = [
  "salt, Sicilian sea water, aquamarine, beryl extract, delphiniums flower, water from Cosenz, discolored blueberries.",
  "salt, Norwegian sea water, spirulina, iron extract, poppy flower, water from Cosenz, discolored strawberries.",
  "salt, Scottish sea water, beetroot, amethyst extract, lavender flower, water from Cosenz, discolored grapes.",
  "salt, Chilean sea water, capsanthin, seaweed extract, azalea flower, water from Cosenz, discolored mango.",
  "salt, Japanese sea water, canthaxanthin, sandalwood extract, sunflower flower, water from Cosenz, discolored watermelon.",
  "salt, Pacific Ocean sea water, charcoal, obsidian extract, gardenia flower, water from Cosenz, discolored watermelon.",
]

const randomIndex = Math.floor(Math.random() * randomIngredients.length);

export default function SalmonDescription({ salmonParams }) {
  const { h, s, l, u, v, t } = salmonParams

  return (
    <div id="overlay">
      <div>
        <p>the <span className="bold">Customized Njord Salmon</span> comes from the cold
          waters of the Norwegian fjords. every stage of
          processing, starting from the strictly fresh raw material,
          is the result of a long-standing tradition. Njord
          Norwegian Salmon is a source of OMEGA-3 fatty acids.
          <br></br>
        </p>
        <p>
          <br></br>
          <span className="bold">store at temperatures between 0°C and 4°C.</span>
          <br></br>
          cooking instructions: bake in the oven at 180°C for 15
          minutes or grill for 10 minutes on each side.
          <br></br>
        </p>
        <p>
          <br></br>
          ingredients: <span className="bold">Norwegian Salmon</span> (salmo salar) 97°10, {randomIngredients[randomIndex]} farmed in Norway.
          <br></br>
          to be consumed by: 31/12/2024
          <br></br>
        </p>
        <p>
          <br></br>
          <span className="bold">nutritional information</span> - average values per 100g</p>
        <div className="param-list">
          <ul className="param-names">
            <li>energy</li>
            <br></br>
            <br></br>
            <li>fats</li>
            <li>&#8627;saturated</li>
            <li>&#8627;monounsaturated</li>
            <li>&#8627;polyunsaturated</li>
            <br></br>
            <li>carbohydrates</li>
            <li>&#8627;of which sugars</li>
            <br></br>
            <li>proteins</li>
            <br></br>
            <li>salt</li>
            <br></br>
            <li>omega-3</li>
            <br></br>
            <li>fiber</li>
            <br></br>
            <li>sugar</li>
          </ul>
          <ul className="param-values">
            <li>709 kJ</li>
            <li>169 kcal</li>
            <br></br>
            <li>9,0 g</li>
            <li>1,3 g</li>
            <li>5,1 g</li>
            <li>2,7 g</li>
            <br></br>
            <li>&lt;0,5 g</li>
            <li>&lt;0,5 g</li>
            <br></br>
            <li>22 g</li>
            <br></br>
            <li>2,7 g</li>
            <br></br>
            <li>0,5 g</li>
            <br></br>
            <li>&lt;0,5 g</li>
            <br></br>
            <li>&lt;0,5 g</li>
            <br></br>
          </ul>
        </div>
        <p><span className="bold">color information</span> - values of your personal salmon</p>
        <div className="param-list">
          <ul className="param-names">
            <li>color</li>
            <li>&#8627;HSL</li>
          </ul>
          <ul className="param-values">
            <br></br>
            <li>H: {h}°</li>
            <li>S: {s}%</li>
            <li>L: {l}%</li>
            <br></br>
          </ul>
        </div>
        <p><span className="bold">texture information</span> - values of your personal salmon</p>
        <div className="param-list">
          <ul className="param-names">
            <li>texture</li>
            <li>&#8627;scaling X</li>
            <li>&#8627;scaling Y</li>
          </ul>
          <ul className="param-values">
            <li>{textureName[t]}</li>
            <li>{Number.parseFloat(u).toFixed(2)}</li>
            <li>{Number.parseFloat(v).toFixed(2)}</li>
            <br></br>
          </ul>
        </div>
        <div id="contact-info">
          <span>info@njord.no </span>
          <span><a href={"https://www.instagram.com/njord.colors?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="} target="_blank">instagram </a></span>
          <span>www.njord.com </span>
        </div>
      </div>
    </div >
  )
}