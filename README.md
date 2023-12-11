# NJÖRD

## Overview

TBD

## Requirements

- NodeJs
- npm (server)
- yarn (client)
- Arduino board and IDE

## Components

### Tangible interface (Arduino)

Use your Arduino IDE to load the program found in `arduino_code`

### Server

The server is located under server folder and can be launched with the following commands:

    npm install
    npm run start

> **Note:** the Server is designed to connect to a serial port. Currently, the USB port identifier is hardcoded and therefore you may need to change it. In case serial port is not available the client still works but fishes can't be configured.

### Client

The client is located under client folder and can be launched with the following commands:

    yarn install
    yarn start

Then, there are multiple sections that can be accessed with the following links:

- [Aquarium](http://localhost:3000/)
- [App (Configurator)](http://localhost:3000/configurator)
- [Visualizer](http://localhost:3000/visualizer?h=212&s=82&l=50&t=2)
