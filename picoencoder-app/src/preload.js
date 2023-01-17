const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("osc", {
  send: (host, port, address, value) => ipcRenderer.invoke("sendOSC", {host, port, address, value}),
});
