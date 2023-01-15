const oscButton = document.getElementById("osc-button");
let host = document.getElementById("osc_server").value;
let port = document.getElementById("osc_port").value;

function logger(type, message) {
  const con = document.getElementById("console");
  con.insertAdjacentHTML(
    "afterbegin",
    `${new Date().toISOString()} ${type} ${message}\n`
  );
}

async function valuesChanged() {
  oscButton.innerHTML = "Update";
  oscButton.classList.add("primary");
}

function sendOSCMessage(message) {
    if (window.osc.send(host, port, message)) {
      logger("OSC", `Sent '${message}' to ${host}:${port} `);
    }
}

async function updateValues() {
  host = document.getElementById("osc_server").value;
  port = document.getElementById("osc_port").value;
  oscButton.innerHTML = "Saved";
  oscButton.classList.remove("primary");
}

document.getElementById("osc_server").oninput = function () {
  valuesChanged();
};
document.getElementById("osc_port").oninput = function () {
  valuesChanged();
};
document.getElementById("osc-button").onclick = function () {
  updateValues();
};

updateValues();
