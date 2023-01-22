const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("osc", {
  updateHost: (host, port) => ipcRenderer.invoke("updateHost", { host, port }),
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
    button.innerHTML = "Not Connected to Pico";
    button.classList.add("error");
    button.classList.remove("primary");
  }
});
