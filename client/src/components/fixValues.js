export function FixHue(hue) {
  return hue * 360 / 255
}

export function FixSaturation(sat) {
  return sat * 100 / 255
}

export function FixLightness(lit) {
  return 10 + lit * 90 / 255
}

export function FixUScale() {

}

export function FixVScale() {

}