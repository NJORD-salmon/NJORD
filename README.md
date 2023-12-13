# NJÖRD

## Overview

Farmed salmon have traditionally been fed colorants to maintain their characteristic hue. This is typically done to replicate the natural color of wild fish, which is influenced by their diet rich in krill.

NJÖRD is a Norwegian company specializing in the production and distribution of colored salmon meat, offering a diverse range of products. Recently, NJÖRD introduced a new premium service that allows clients to control all visual characteristics of the fish. This service is accessible through dedicated machines installed in each store.

## Purpose

The provided repository contains the code for the NJÖRD machine's operation. It includes a configurator that enables users to create their own avatar, representing the fish they wish to purchase. The visualizer displays a summary of the choices made by the client. Additionally, an aquarium feature showcases the fishes purchased by all clients, facilitating comparison and sharing of experiences with others.

## Requirements

- NodeJs
- npm (server)
- yarn (client)
- Arduino board and IDE

## Components

### Tangible interface (Arduino)

Use your Arduino IDE to load the program found in `arduino_code`.

### Server

The server is located under _server_ folder and can be launched with the following commands:

    npm install
    npm run start

> **Note:** the Server is designed to connect to a serial port. Currently, the USB port identifier is hardcoded and therefore you may need to change it. In case the serial port is not available, the client still works but fishes can not be configured.

### Client

The client is located under _client_ folder and can be launched with the following commands:

    yarn install
    yarn start

Then, there are multiple sections that can be accessed with the following links:

- [Aquarium](http://localhost:3000/)
- [App (Configurator)](http://localhost:3000/configurator)
- [Visualizer](http://localhost:3000/visualizer?h=212&s=82&l=50&t=2)

## Credits

This is a work of Speculative Design for the course Final Synthesis Design Studio for the Bachelor's Degree in Communication Design.

### Group members

- Bissoli Miriam
- Capozza Andrea
- Casadei Giorgia
- Coroneo Giovanni
- Le Bras Lili May
- Lucini Francesco
- Sicignano Lorenzo

_Polytechnic University of Milan </br>
School of Design </br>
Final Synthesis Design Studio </br>
AY 2023 — 2024_
