const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("osc", {
  send: (host, port, message) => ipcRenderer.invoke("sendOSC", {host, port, message}),
});
