const BREAK = "\r\n";
let connected = false;
const button = document.getElementById("serial-button");

function logger(type, message) {
  const con = document.getElementById("console");
  con.insertAdjacentHTML(
    "afterbegin",
    `${new Date().toISOString()} ${type} ${message}\n`
  );
}

navigator.serial.addEventListener("connect", () => {
  fetchSerialPorts();
});

navigator.serial.addEventListener("disconnect", () => {
  connected = false;
  button.innerHTML = "Connect";
  button.classList.add("primary");
  logger("DISCONNECT", "Pico Serial Connection Disconnected");
  fetchSerialPorts();
});

async function readFromSerial(port) {
  await port.open({ baudRate: 9600 });
  connected = true;
  button.innerHTML = "Connected to Pico";
  button.classList.remove("primary");
  logger("CONNECT", "Pico Serial Connection Connected");
  while (port.readable) {
    const reader = port.readable.getReader();
    let buffer = "";
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        buffer = buffer.concat(new TextDecoder().decode(value));
        while (buffer.includes(BREAK)) {
          let start = buffer.indexOf(BREAK);
          let data = buffer.substring(0, start);
          buffer = buffer.substring(start + 2);
          logger("READ", data);
          sendOSCMessage(String(data));
        }
      }
    } catch (error) {
      logger("ERROR", error);
    } finally {
      reader.releaseLock();
    }
  }
}

async function fetchSerialPorts() {
  button.addEventListener("click", () => {
    const filters = [{ usbVendorId: 0x239a, usbProductId: 0x80f4 }];
    try {
      navigator.serial.requestPort({ filters: filters }).then((port) => {
        if (!connected) {
          readFromSerial(port);
        }
      });
    } catch (error) {
      logger("ERROR", error);
    }
  });
}

fetchSerialPorts();
