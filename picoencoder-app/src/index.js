const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
const OSCService = require("./js/osc");
const SerialService = require("./js/serial");

if (require("electron-squirrel-startup")) {
  app.quit();
}

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

  osc = new OSCService(mainWindow);
  serial = new SerialService(mainWindow, osc);

  ipcMain.handle("updateHost", (event, args) => {
    osc.updateHost(args);
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
