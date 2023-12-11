import WebSocket, { WebSocketServer } from 'ws'
import { SerialPort } from 'serialport'
import { ReadlineParser } from 'serialport'
import { join } from 'path'
import { writeFile, readFile, readdir } from "node:fs/promises"

import { STATES, StateMachine } from './stateMachine.js'

const COMMANDS = {
  OK: 'ok',
  NEXT: 'next',
  BACK: 'back',
  DATA: 'DATA'
}

const PAGES = {
  TUTORIAL: 'tutorial',
  APP: 'app'
}

let fishNumber = 0

function main() {
  // set up websocket for client (webpage) and server communication
  const wss = setupWSS({
    port: 9000,
    fn: async (ws, data) => {
      if (data.toString() === 'gimme-fish') {
        console.log('catch aah')
        const response = {
          fishes: await readSalmonParameters()
        }
        ws.send(JSON.stringify(response))
      }
      console.log('received: %s', data);
    }
  })

  // TODO: return when receive message from aqurium -> return array of salmon configs

  /* currently return just two preconfigured salmons
  websocket code

  onMessage => return [
    {"hue":0,"saturation":209,"lightness":71,"texture":255},
    {"hue":149,"saturation":189,"lightness":81,"texture":0}
  ]
  */

  console.log('server started')

  // TODO: change initial state (page) to TUTORIAL in the future
  const automa = new StateMachine(STATES.CUSTOMIZE)

  // set up serialport for server and arduino communication
  const port = setupSerialPort(wss, automa)

  // signal interrupted
  process.on('SIGINT', () => {
    port.close()
    wss.close()

    console.log('server terminated')
  })
}

function setupWSS({ port, fn }) {
  if (fn !== undefined && typeof fn !== 'function') {
    throw new Error('provided fn parameter is not a function')
  }

  // define which websocket port
  const wss = new WebSocketServer({ port: port });

  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', (data) => fn(ws, data));

    ws.on('close', () => {
      console.log(`connection terminated on port ${port}`)
    })
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
  // to prevent changings in the parameters when saving
  let lastChosenParameters = {}

  // Read the port data
  port.on("open", () => {
    console.log('serial port open')
  })

  parser.on('data', async (data) => {
    // if data is the same as before, stop sending until it changes
    if (data !== previousValue) {
      const payload = JSON.parse(data)
      const {
        currentState,
        notifyClients,
        parameters
      } = await processArduinoSignal(automa, payload, lastChosenParameters)

      // update parameters to be saved when retured by the processing function
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

  parser.on('close', () => {
    console.log('serial port closed')
  })

  return port
}

async function processArduinoSignal(automa, payload, lastParameters) {
  const output = { notifyClients: false, parameters: null }

  switch (automa.currentState) {
    case STATES.TUTORIAL: {
      automa.changeState(STATES.CUSTOMIZE)
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
        // TODO: tell the client to close the saving modal
        automa.changeState(STATES.CUSTOMIZE)
        output.notifyClients = true
      } else if (payload.type === COMMANDS.OK) {
        // save salmon parameters and move the next UI
        await writeSalmonParameters(lastParameters)

        automa.changeState(STATES.DISPLAY)
        output.notifyClients = true
      }
      break
    }
    case STATES.DISPLAY: {
      // TODO: generate QR code 
      if (payload.type === COMMANDS.OK) {
        // send salmon in the aquarium

        automa.changeState(STATES.TUTORIAL)
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
  try {
    await writeFile(join('./customizedSalmons', `fish_${fishNumber}.json`), JSON.stringify(parameters) + "\n");
    // change the fish number to write up to 30 json files
    if (fishNumber < 29) {
      fishNumber++
    } else fishNumber = 0
    console.info("salmon saved correctly")
  } catch (error) {
    console.error("failed to save salmon", error)
  }
}

async function readSalmonParameters() {
  let fishFiles
  try {
    fishFiles = (await readdir('./customizedSalmons')).filter(elem => elem.endsWith('.json'))
  } catch (error) {
    console.error('impossible to load directory content')
  }

  const fishes = []

  for (const fishFile of fishFiles) {
    try {
      const fish = await readFile(join('./customizedSalmons', fishFile), { encoding: 'utf8' })
      fishes.push(JSON.parse(fish?.trim()))
    } catch (error) {
      console.error("failed reading files", error);
    }
  }

  return fishes
}

main()