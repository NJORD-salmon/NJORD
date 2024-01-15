// functions to get the right range of values of the data received from Arduino

export function FixHue(hue) {
  return hue * 360 / 255
}

export function FixSaturation(sat) {
  return sat * 100 / 255
}

export function FixLightness(lit) {
  return 10 + lit * 90 / 255
}

export function FixTexture(texture) {
  const numberOfTextures = 9
  const textureRangeSize = 256 / numberOfTextures

  return Math.floor(texture / textureRangeSize)
}

export function FixUScale(scaleX) {
  return 0.4 + scaleX * 2.6 / 255
}

export function FixVScale(scaleY) {
  return 0.4 + scaleY * 4.6 / 255
}