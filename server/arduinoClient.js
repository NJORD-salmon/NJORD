import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:9000');

ws.on('error', console.error);

ws.on('open', function open() {
  console.log('connection ready...')
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});