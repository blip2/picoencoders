# Pico Encoders

The concept is to provide a low cost encoder/other user interface solution for lighting consoles/interactive exhibits. More documentation for both software and hardware to follow.

## App Development

The app uses electron, using SerialPort for USB serial connection to the Pico and OSC-js to output OSC messages.

From within the `pico-encoders-app` folder, install all dependencies with `npm install`

Run the app in development mode with `npm run start` changes are not currently auto-reloaded.

Releases are automatically built and available on the releases page.

## Pico Development

Uses CircuitPython

More to follow

## Authors

Ben Hussey <ben@blip2.net>
