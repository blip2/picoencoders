const { SerialPort } = require("serialport");

const MAPPING = {
  "encoder1-inc": "/eos/wheel/pan",
  "encoder1-dec": "/eos/wheel/pan",
  "encoder2-inc": "/eos/wheel/tilt",
  "encoder2-dec": "/eos/wheel/tilt",
};

module.exports = class SerialService {
  constructor(win, osc) {
    this.win = win;
    this.osc = osc;
    this.detectPico();
    this.connected = false;
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
    if (data in MAPPING) {
      if (data.includes("encoder")) {
        this.osc.sendOSC(
          String(MAPPING[data]),
          data.includes("inc") ? "1.0" : "-1.0"
        );
      } else {
        this.osc.sendOSC(String(MAPPING[data]));
      }
    }
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
