# Pico Encoders

The concept is to provide a low cost encoder/button user interface solution for control of ETC lighting consoles (and possibly other things?).

![Prototype Pico Encoder](/img/pico-prototype.jpg)
Prototype Pico Encoder - see hardware section below

The Pico plugs into a computer running the desktop application (see [Releases](https://github.com/blip2/picoencoders/releases)) which converts the Pico serial console output to the relevant OSC commands. The arrow keys on one encoder also control parameter selection and scrolling speed.

![Pico Encoder App](/img/app.jpg)
OSC Service Desktop Application

## Hardware

The current prototype uses a standard [Raspberry Pi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/) and the following components:
- 2x [ANO Directional Navigation and Scroll Wheel Rotary Encoders](https://shop.pimoroni.com/products/ano-directional-navigation-and-scroll-wheel-rotary-encoder?variant=39450092273747) - though any continuous pulse-based rotary encoder should work
- 2x [Encoder Breakout PCBs](https://shop.pimoroni.com/products/adafruit-ano-rotary-navigation-encoder-breakout-pcb?variant=39450097778771)
- Solderless breadboard and jumper wires

The current iteration has all pins on the left encoder/buttons and the right encoder connected to GPIO pins. The pins assumed/used are listed in [code.py](/pico-python/code.py) and can be easily changed in the code.

## Pico Setup

This projects uses [CircuitPython](https://circuitpython.org/). There is an easy guide to install the CircuitPython firmware onto the Pico [here](https://learn.adafruit.com/getting-started-with-raspberry-pi-pico-circuitpython/circuitpython).

Once installed the [code.py](/pico-python/code.py) file can be dropped into the CIRCUITPYTHON drive that should appear with the Pico plugged in.

If the app is running, it should then show as connected and any input received shown in the Debug Console. If it doesn't close the app and look at what is happening in the [Serial console](https://learn.adafruit.com/getting-started-with-raspberry-pi-pico-circuitpython/installing-mu-editor) for the Pico.

## App Usage

Download and install the desktop application from the [Releases](https://github.com/blip2/picoencoders/releases) page. This installers are not currently signed so you'll get lots of trust warnings and it may be blocked by anti-virus software. The builds for Mac and Linux have not yet been tested.

Once running the app it should automatically connect to the first Pico device connected, the IP address and port to send OSC to may need to be set to the ETC

If the directional buttons are not being used/setup, the speed and parameter mode can be set from the user interface of the app. The app can also be set to be 'on-top' so that you can see what parameters it's set to.

## App Development

The app uses [electron](https://www.electronjs.org/), with SerialPort for USB serial connection to the Pico and OSC-js to output OSC messages.

To make changes to the application, clone this repository from an environment with git and npm.

From within the `pico-encoders-app` folder, install all dependencies with `npm install`

Run the app in development mode with `npm run start` - changes are not currently auto-reloaded.

Github releases are automatically built for Windows/Mac/Linux and available on the [Releases](https://github.com/blip2/picoencoders/releases) page.

## Authors

Ben Hussey <ben@blip2.net>
