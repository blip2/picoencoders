const oscButton = document.getElementById("osc-button");
let host = document.getElementById("osc_server").value;
let port = document.getElementById("osc_port").value;

async function valuesChanged() {
  oscButton.innerHTML = "Update";
  oscButton.classList.add("primary");
}

async function updateValues() {
  host = document.getElementById("osc_server").value;
  port = document.getElementById("osc_port").value;
  oscButton.innerHTML = "Saved";
  oscButton.classList.remove("primary");
  window.osc.updateHost(host, port);
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
