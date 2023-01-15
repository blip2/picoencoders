const { app, BrowserWindow, ipcMain } = require("electron");
const OSC = require("osc-js");
const path = require("path");

if (require("electron-squirrel-startup")) {
  app.quit();
}

const osc = new OSC({ plugin: new OSC.DatagramPlugin() })
sendOSC = (object, {host, port, message}) => {
  osc.send(new OSC.Message(message), { host: host, port: port });
  return true;
};

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 700,
    height: 350,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "serial") {
        return true;
      }
      return false;
    }
  );

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "serial") {
      return true;
    }
    return false;
  });

  mainWindow.webContents.session.on(
    "select-serial-port",
    (event, portList, webContents, callback) => {
      event.preventDefault();
      const selectedPort = portList.find((device) => {
        return device.vendorId === "9114" && device.productId === "33012";
      });
      if (!selectedPort) {
        callback("");
      } else {
        callback(selectedPort.portId);
      }
    }
  );

  mainWindow.webContents.openDevTools();

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  const portSelected = await mainWindow.webContents.executeJavaScript(
    `navigator.serial.requestPort({ filters: [{ usbVendorId: 0x239a, usbProductId: 0x80f4 }] }).then((port) => { readFromSerial(port) }).catch(error => logger('ERROR', error));`,
    true
  );
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(() => {
  ipcMain.handle("sendOSC", sendOSC);
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
