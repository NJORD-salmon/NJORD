import WebSocket, { WebSocketServer } from 'ws';
import { SerialPort } from 'serialport'
import { ReadlineParser } from 'serialport';

function main() {
  // set up websocket for client (webpage) and server communication
  const wss = setupWSS()

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

function setupWSS() {
  // define which websocket port
  const wss = new WebSocketServer({ port: 9000 });

  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);


    ws.on('message', (data) => {
      console.log('received: %s', data);
    });

    ws.on('close', () => {
      console.log('connection terminated')
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
  parser.on('data', console.log)

  let previousValue = null

  // Read the port data
  port.on("open", () => {
    console.log('serial port open');
  });
  parser.on('data', data => {
    console.log('got word from arduino:', data);

    // with json it continues to send data
    if (data !== previousValue) {
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