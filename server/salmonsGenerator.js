'use strict'

import { randomInt } from 'crypto'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const BASEPATH = './customizedSalmons'
const NUM_SALMONS = 15

async function main() {
  for (let i = 0; i < NUM_SALMONS; i++) {
    const salmonData = JSON.stringify({
      hue: randomInt(0, 256),
      saturation: randomInt(128, 230),
      lightness: randomInt(10, 180),
      texture: randomInt(0, 256),
      scaleX: randomInt(0, 256),
      scaleY: randomInt(0, 256),
      next: 1,
      back: 0
    }) + '\n'

    await writeFile(join(BASEPATH, `fish_${i}.json`), salmonData)
  }
}

main()