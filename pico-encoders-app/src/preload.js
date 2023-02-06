const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("app", {
  updateHost: (host, port) => ipcRenderer.invoke("updateHost", { host, port }),
  setOnTop: (bool) => ipcRenderer.invoke("setOnTop", bool),
  userInput: (data) => ipcRenderer.invoke("userInput", data),
});

ipcRenderer.on("log-message", function (evt, message) {
  document.getElementById("console").insertAdjacentHTML("afterbegin", message);
});

ipcRenderer.on("serial-state", function (evt, message) {
  const button = document.getElementById("serial-button");

  if (message) {
    button.innerHTML = "Connected to Pico";
    button.classList.remove("error");
    button.classList.add("primary");
  } else {
    button.innerHTML = "Disconnected from Pico";
    button.classList.add("error");
    button.classList.remove("primary");
  }
});

ipcRenderer.on("encoder-mode", function (evt, message) {
  document.getElementById("mode").innerHTML = message;
});

ipcRenderer.on("encoder-speed", function (evt, message) {
  document.getElementById("speed").innerHTML = message;
});

ipcRenderer.on("osc-server", function (evt, message) {
  document.getElementById("osc_server").value = message;
});

ipcRenderer.on("osc-port", function (evt, message) {
  document.getElementById("osc_port").value = message;
});