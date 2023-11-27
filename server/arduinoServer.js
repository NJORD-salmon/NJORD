import WebSocket, { WebSocketServer } from 'ws'
import { SerialPort } from 'serialport'
import { ReadlineParser } from 'serialport'
import { join } from 'path'
import { writeFile } from "node:fs/promises"

function main() {
  // set up websocket for client (webpage) and server communication
  const wss = setupWSS({
    port: 9000,
    fn: (data) => {
      console.log('received: %s', data);
    }
  })

  // TODO: return when receive message from acqurium -> return array of salmon configs

  /* currently return just two preconfigured salmons
  websocket code

  onMessage => return [
    {"hue":0,"saturation":209,"lightness":71,"texture":255},
    {"hue":149,"saturation":189,"lightness":81,"texture":0}
  ]
  */

  console.log('server started')

  // set up serialport for server and arduino communication
  const port = setupSerialPort(wss)

  // signal interrupted
  process.on('SIGINT', () => {
    port.close()
    wss.close()

    console.log('server terminated')
  })
}

function setupWSS({ port, fn }) {
  // define which websocket port
  const wss = new WebSocketServer({ port: port });

  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', fn);

    ws.on('close', () => {
      console.log(`connection terminated on port ${port}`)
    })
  });

  return wss
}

function setupSerialPort(wss) {
  // serial communication - path depends on the computer and port where Arduino board is connected to
  const port = new SerialPort({ path: '/dev/cu.usbmodem1101', baudRate: 9600 })

  // use delimiter because arduino files uses println
  // parser is the data that comes from arduino
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

  let previousValue = null

  // Read the port data
  port.on("open", () => {
    console.log('serial port open');
  });
  parser.on('data', async (data) => {
    // if data is the same as before, stop sending untill it changes
    if (data !== previousValue) {
      console.info(data);

      const payload = JSON.parse(data)
      // when you send the salmon in the acquarium, it saves the configuration in a file
      if (payload.type === "ok") {
        try {
          await writeFile(join('./customizedSalmons', 'obj.json'), data + "\n");
          console.info("file saved correctly")
        } catch (error) {
          console.error("failed to save salmon", error)
        }
      }

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: false });
        }
      });
      previousValue = data
    }
  });
  parser.on('close', () => {
    console.log('serial port closed')
  })

  return port
}

main()