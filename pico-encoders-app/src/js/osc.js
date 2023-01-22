const OSC = require("osc-js");

module.exports = class OSCService {
  constructor(win) {
    this.host = "localhost";
    this.port = "8000";
    this.win = win;
    this.osc = new OSC({ plugin: new OSC.DatagramPlugin() });
  }

  sendOSC(address, value) {
    this.osc.send(new OSC.Message(address, value), {
      host: this.host,
      port: this.port,
    });
    this.logger(
      "OSC",
      `Sent '${address} ${value}' to ${this.host}:${this.port} `
    );
  }

  logger(type, message = "") {
    this.win.webContents.send(
      "log-message",
      `${new Date().toISOString()} ${type} ${message}\n`
    );
  }

  updateHost({ host, port }) {
    this.host = host;
    this.port = port;
    this.logger(
      "OSC",
      `Updated host to ${this.host}:${this.port} `
    );
  }
};
