import WebSocket, { WebSocketServer } from 'ws'
import { SerialPort } from 'serialport'
import { ReadlineParser } from 'serialport'
import { join } from 'path'
import { writeFile, readFile, readdir } from "node:fs/promises"
import { statSync } from 'fs'

import { STATES, StateMachine } from './stateMachine.js'


const COMMANDS = {
  NEXT: 'next',
  BACK: 'back',
  DATA: 'data'
}

const BASEPATH = './customizedSalmons'

let fishNumber = await loadInitialSalmonId(BASEPATH)

function main() {
  console.log('initial fish number:', fishNumber)

  // set up websocket for client (webpage) and server communication
  const wss = setupWSS({
    port: 9000,
    fn: async (ws, data) => {
      if (data.toString() === 'gimme-fish') {
        console.log('catch them')
        const response = {
          fishes: await readSalmonParameters(0, 25),
          currentState: automa.currentState  // include current state in the response
        }
        ws.send(JSON.stringify(response))
      }
      console.log('received: %s', data);
    }
  })

  console.log('server started')

  const automa = new StateMachine(STATES.WELCOME)

  // set up serialport for server and arduino communication
  let port
  try {
    port = setupSerialPort(wss, automa)
  } catch (error) {
    console.error('impossible to connect to Arduino', error)
  }

  // signal interrupted
  process.on('SIGINT', () => {
    if (port?.isOpen) {
      port.close()
    }

    wss.close()
  })
}

function heartbeat() {
  this.isAlive = true;
}

function setupWSS({ port, fn }) {
  if (fn !== undefined && typeof fn !== 'function') {
    throw new Error('provided fn parameter is not a function')
  }

  // define which websocket port
  const wss = new WebSocketServer({ port: port });

  wss.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('error', console.error);

    ws.on('message', (data) => fn(ws, data));
  });

  const interval = setInterval(function ping() {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) {
        console.info('client disconnected')
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('error', error => {
    console.error(`websocket issue: ${error.message}`)
    this.close()
  })

  wss.on('close', function close() {
    clearInterval(interval);

    wss.clients.forEach(ws => {
      ws.terminate();
      console.info('client disconnected')
    });

    console.log(`closing websocket server`)
  });

  return wss
}

function setupSerialPort(wss, automa) {
  // serial communication - path depends on the computer and port where Arduino board is connected to
  const port = new SerialPort({ path: '/dev/cu.usbmodem1101', baudRate: 9600 })

  // use delimiter because arduino files uses println
  // parser is the data that comes from arduino
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

  let previousValue = null
  // to prevent changes in the parameters when saving
  let lastChosenParameters = {}

  // Read the port data
  port.on("open", () => {
    console.log('serial port open')
  })

  port.on('error', err => {
    console.error('port - error:', err.message)
    if (port.isOpen) {
      port.end()
    }
  })

  port.on('close', () => {
    if (port.isOpen) {
      port.flush()
    }
    console.log('serial port closed')
    parser.end()
  })

  parser.on('data', async (data) => {
    // if data is the same as before, stop sending until it changes
    if (data !== previousValue) {
      let payload
      try {
        payload = JSON.parse(data)
      } catch (error) {
        console.error('failed to parse message payload', error.message)
        return
      }

      const {
        currentState,
        notifyClients,
        parameters
      } = await processArduinoSignal(automa, payload, lastChosenParameters)

      // update parameters to be saved when returned by the processing function
      if (parameters) {
        lastChosenParameters = parameters
      }

      if (notifyClients) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const augmentedData = JSON.stringify({
              ...payload,
              currentState
            })
            client.send(augmentedData, { binary: false })
          }
        })
      }

      // this is for comparing values coming from Arduino,
      // so that unchanged values are not forwarded to the client
      previousValue = data
    }
  })

  parser.on('error', err => {
    console.error(err.message)
  })

  parser.on('close', () => {
    console.log('serial port parser closed')
  })

  return port
}

async function processArduinoSignal(automa, payload, lastParameters) {
  const output = { notifyClients: false, parameters: null }

  switch (automa.currentState) {
    case STATES.WELCOME: {
      if (payload.type === COMMANDS.NEXT) {
        automa.changeState(STATES.CUSTOMIZE)
        output.notifyClients = true
      }

      break
    }
    case STATES.CUSTOMIZE: {
      if (payload.type === COMMANDS.DATA) {
        console.info(payload.values);
        // tell the client that parameters have changed
        output.notifyClients = true
      } else if (payload.type === COMMANDS.NEXT) {
        // we want to stop collecting parameter changes
        automa.changeState(STATES.SAVE)
        output.notifyClients = true
        output.parameters = payload.values
      }

      break
    }
    case STATES.SAVE: {
      if (payload.type === COMMANDS.BACK) {
        automa.changeState(STATES.CUSTOMIZE)
        output.notifyClients = true
      } else if (payload.type === COMMANDS.NEXT) {
        // save salmon parameters and move the next UI
        await writeSalmonParameters(lastParameters)

        automa.changeState(STATES.DISPLAY)
        output.notifyClients = true
      }

      break
    }
    case STATES.DISPLAY: {
      if (payload.type === COMMANDS.NEXT) {
        // send salmon in the aquarium
        output.notifyClients = true
        automa.changeState(STATES.WELCOME)
      }

      break
    }
    default: {
      throw new Error('unknown state')
    }
  }

  // return the state after the change
  return { ...output, currentState: automa.currentState }
}

async function writeSalmonParameters(parameters) {
  // write saved salmon file
  try {
    await writeFile(join(BASEPATH, `fish_${fishNumber}.json`), JSON.stringify(parameters) + "\n");
    // change the fish number to write up to 30 json files
    fishNumber++

    console.info("salmon saved correctly")
  } catch (error) {
    console.error("failed to save salmon", error)
  }
}

async function readSalmonParameters(min, max) {
  let fishFiles

  try {
    fishFiles = (await readdir(BASEPATH)).filter(elem => elem.endsWith('.json'))
  } catch (error) {
    console.error('impossible to load directory content')
  }
  sortFishFiles(fishFiles)

  const fishes = []

  for (const fishFile of fishFiles) {
    try {
      // read each fishFile content and push it in the array fishes
      const fish = await readFile(join(BASEPATH, fishFile), { encoding: 'utf8' })
      fishes.push(JSON.parse(fish?.trim()))
    } catch (error) {
      console.error("failed reading files", error);
    }
  }

  // calculate parameters of all the files
  FishAverages(fishes)
  TextureMode(fishes)
  HueMode(fishes)

  // get last 25 created files
  return (
    fishes.slice(min, max)
  )
}

async function loadInitialSalmonId(directoryPath) {
  if (!directoryPath) {
    return 0
  }

  try {
    const salmonFiles = (await readdir(directoryPath)).filter(fname => fname.startsWith('fish_'))
    sortFishFiles(salmonFiles)
    const salmonFileName = salmonFiles[0]
    const index = Number.parseInt(
      salmonFileName.slice(salmonFileName.indexOf('_') + 1, salmonFileName.indexOf('.'))
    )
    // in case we fail into parsing the salmon filename
    if (Number.isNaN(index)) {
      return 0
    }

    return index
  } catch (error) {
    // just ignore the error and return the first
    return 0
  }
}

async function sortFishFiles(fishFiles) {
  let sorted = await fishFiles.sort((a, b) => {
    let aStat = statSync(`${BASEPATH}/${a}`);
    let bStat = statSync(`${BASEPATH}/${b}`);

    return new Date(bStat.birthtime).getTime() - new Date(aStat.birthtime).getTime();
  })

  return sorted
}

// function to calculate the average salmon of all the saved json 
async function FishAverages(fishes) {
  const sum = fishes.reduce((totals, fish) => {
    totals.hue += fish.hue;
    totals.saturation += fish.saturation;
    totals.lightness += fish.lightness;
    totals.texture += fish.texture;
    totals.scaleX += fish.scaleX;
    totals.scaleY += fish.scaleY;
    return totals;
  }, {
    hue: 0,
    saturation: 0,
    lightness: 0,
    texture: 0,
    scaleX: 0,
    scaleY: 0
  });

  const length = fishes.length;

  const averages = {
    hue: (sum.hue / length).toFixed(0),
    saturation: (sum.saturation / length).toFixed(0),
    lightness: (sum.lightness / length).toFixed(0),
    texture: (sum.texture / length).toFixed(0),
    scaleX: (sum.scaleX / length).toFixed(3),
    scaleY: (sum.scaleY / length).toFixed(3)
  };

  console.log(averages);
  return averages;
}

async function TextureMode(fishes) {
  // extract raw texture values and convert them from 0 to 8
  const textures = fishes.map(fish => FixTexture(fish.texture));

  // create a frequency map to keep track of how many times each texture value appears in the array
  const frequencyMap = {};
  textures.forEach(texture => {
    if (frequencyMap[texture]) {
      frequencyMap[texture]++;
    } else {
      frequencyMap[texture] = 1;
    }
  });

  // find the mode
  let maxFrequency = 0;
  let mode = null;
  for (const texture in frequencyMap) {
    if (frequencyMap[texture] > maxFrequency) {
      maxFrequency = frequencyMap[texture];
      mode = Number(texture);
    }
  }

  console.log(`Mode of textures: ${mode}`);
  return mode;
}

// fix parameter to match the number of textures
function FixTexture(texture) {
  const numberOfTextures = 9
  const textureRangeSize = 256 / numberOfTextures

  return Math.floor(texture / textureRangeSize)
}

async function HueMode(fishes) {
  const sectorSize = 255 / 12; // Calculate the size of each sector
  const hues = fishes.map(fish => fish.hue);

  // Map each hue value to its corresponding sector
  const sectors = hues.map(hue => Math.floor(hue / sectorSize));

  // Create a frequency map for sectors
  const frequencyMap = {};
  sectors.forEach(sector => {
    if (frequencyMap[sector]) {
      frequencyMap[sector]++;
    } else {
      frequencyMap[sector] = 1;
    }
  });

  // Find the mode sector
  let maxFrequency = 0;
  let modeSector = null;
  for (const sector in frequencyMap) {
    if (frequencyMap[sector] > maxFrequency) {
      maxFrequency = frequencyMap[sector];
      modeSector = Number(sector);
    }
  }

  console.log(`Mode sector of hues: ${modeSector}`);
  return modeSector;
}



main()