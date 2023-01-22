const oscButton = document.getElementById("osc-button");
let host = document.getElementById("osc_server").value;
let port = document.getElementById("osc_port").value;

async function valuesChanged() {
  oscButton.innerHTML = "Update";
  oscButton.classList.add("primary");
}

// Send OSC server information to main process
async function updateValues() {
  host = document.getElementById("osc_server").value;
  port = document.getElementById("osc_port").value;
  oscButton.innerHTML = "Saved";
  oscButton.classList.remove("primary");
  window.app.updateHost(host, port);
}

// Set OSC server component actions
document.getElementById("osc_server").oninput = function () {
  valuesChanged();
};
document.getElementById("osc_port").oninput = function () {
  valuesChanged();
};
document.getElementById("osc-button").onclick = function () {
  updateValues();
};

// Send onTop checkbox state to main process
document.getElementById("onTop").addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    window.app.setOnTop(true);
  } else {
    window.app.setOnTop(false);
  }
})

// Set mode/speed component actions
document.getElementById("push-left").onclick = function () {
  window.app.userInput("push-left");
};
document.getElementById("push-right").onclick = function () {
  window.app.userInput("push-right");
};
document.getElementById("push-up").onclick = function () {
  window.app.userInput("push-up");
};
document.getElementById("push-down").onclick = function () {
  window.app.userInput("push-down");
};

updateValues();
