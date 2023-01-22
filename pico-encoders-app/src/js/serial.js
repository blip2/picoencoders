const { SerialPort } = require("serialport");

const MODES = [
  {
    name: "Pan / Tilt",
    encoderMap: {
      encoder1: "/eos/wheel/pan",
      encoder2: "/eos/wheel/tilt",
    },
  },
  {
    name: "Zoom / Edge",
    encoderMap: {
      encoder1: "/eos/wheel/zoom",
      encoder2: "/eos/wheel/edge",
    },
  },
  {
    name: "Hue / Sat",
    encoderMap: {
      encoder1: "/eos/wheel/hue",
      encoder2: "/eos/wheel/saturation",
    },
  },
];

module.exports = class SerialService {
  constructor(win, osc) {
    this.win = win;
    this.osc = osc;
    this.detectPico();
    this.connected = false;
    this.speed = 2;
    this.mode = 0;
  }

  async detectPico() {
    await SerialPort.list().then((ports, err) => {
      const pico = ports.filter((device) => {
        return device.vendorId == "239A" && device.productId == "80F4";
      });
      this.logger("CONNECT", `Looking for Pico Devices`);

      if (pico.length > 0) {
        this.logger("CONNECT", `Found Pico Device at ${pico[0].path}`);
        this.port = pico[0].path;
        this.connect();
      } else {
        setTimeout(() => {
          this.detectPico();
        }, 2000);
      }
    });
  }

  mapMessage(data) {
    if (data.includes("encoder")) {
      if (data.substring(0, 8) in MODES[this.mode].encoderMap) {
        this.osc.sendOSC(
          String(MODES[this.mode].encoderMap[data.substring(0, 8)]),
          data.includes("inc") ? `${this.speed}.0` : `-${this.speed}.0`
        );
      }
    } else if (data.includes("push")) {
      if (data == "push-up") {
        this.speed = this.speed + 1;
        if (this.speed > 4) this.speed = 1;
        this.speedChanged();
      }
      if (data == "push-down") {
        this.speed = this.speed - 1;
        if (this.speed < 1) this.speed = 4;
        this.speedChanged();
      }
      if (data == "push-left") {
        this.mode = this.mode - 1;
        if (this.mode < 0) this.mode = MODES.length - 1;
        this.modeChanged();
      }
      if (data == "push-right") {
        this.mode = this.mode + 1;
        if (this.mode >= MODES.length) this.mode = 0;
        this.modeChanged();
      }
    }
  }

  modeChanged() {
    this.win.webContents.send("encoder-mode", MODES[this.mode].name);
    this.logger("MODE", `Mode set to ${MODES[this.mode].name}`);
  }

  speedChanged() {
    this.win.webContents.send("encoder-speed", this.speed);
    this.logger("SPEED", `Speed set to ${this.speed}`);
  }

  close() {
    if (this.connected) {
      this.connected = false;
      this.win.webContents.send("serial-state");
      this.logger("DISCONNECT", "Pico Disconnected");
    }
    setTimeout(() => {
      this.detectPico();
    }, 2000);
  }

  async connect() {
    this.serialport = await new SerialPort({
      path: this.port,
      baudRate: 9600,
    });

    this.connected = true;
    this.logger("CONNECT", "Pico Connected");
    this.win.webContents.send("serial-state", "OK");

    const that = this;
    this.serialport.on("data", function (data) {
      const message = new TextDecoder().decode(data).trim();
      if (message) {
        that.mapMessage(message);
      }
    });

    this.serialport.on("close", function (error) {
      that.close();
    });
  }

  logger(type, message) {
    this.win.webContents.send(
      "log-message",
      `${new Date().toISOString()} ${type} ${message}\n`
    );
  }
};
