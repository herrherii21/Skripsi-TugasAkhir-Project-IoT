// Pastikan Firebase telah diinisialisasi terlebih dahulu
var firebaseConfig = {
  apiKey: "AIzaSyDhckNigYyinZhdVHbKZTP17Vu-4Nt3dLs",
  authDomain: "smart-farming-apps.firebaseapp.com",
  databaseURL: "https://smart-farming-apps-default-rtdb.firebaseio.com",
  projectId: "smart-farming-apps",
  storageBucket: "smart-farming-apps.firebasestorage.app",
  messagingSenderId: "892869405795",
  appId: "1:892869405795:web:a459c8179e7945c9d7dc56"
};

// Inisialisasi Firebase jika belum dilakukan
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Jika sudah ada instance Firebase
}

// Sekarang Anda dapat menggunakan firebase.database() tanpa masalah
var database = firebase.database();

// ======= DATA MONITORING =======
const humidityElem = document.getElementById('humidity');
const temperatureElem = document.getElementById('temperature');
const plot1Elem = document.getElementById('plot1');
const plot2Elem = document.getElementById('plot2');

function updateMonitoringData() {
  const dbRef = firebase.database().ref("monitoring");
  dbRef.on("value", (snapshot) => {
    const data = snapshot.val();
    humidityElem.textContent = data?.humidity ?? 'N/A';
    temperatureElem.textContent = data?.temperature ?? 'N/A';
    plot1Elem.textContent = data?.plot1 ?? 'N/A';
    plot2Elem.textContent = data?.plot2 ?? 'N/A';
  });
}

updateMonitoringData();

// ======= KONTROL MANUAL =======
function toggleDevice(deviceName) {
  const ref = database.ref("control/" + deviceName);
  ref.once("value").then(snapshot => {
    const currentState = snapshot.val();
    ref.set(!currentState);
    console.log(`${deviceName} changed to ${!currentState}`);
  });
}

document.getElementById("control-lamp").addEventListener("click", () => toggleDevice("lamp"));
document.getElementById("control-plot1").addEventListener("click", () => toggleDevice("plot1"));
document.getElementById("control-plot2").addEventListener("click", () => toggleDevice("plot2"));

// ======= KONTROL OTOMATIS JADWAL =======
let autoPlot1 = false;
let autoPlot2 = false;
let autoLamp = false;

const btnPlot1 = document.getElementById("btn-auto-plot1");
const btnPlot2 = document.getElementById("btn-auto-plot2");
const btnLamp = document.getElementById("btn-auto-lamp");

btnPlot1.addEventListener("click", () => {
  autoPlot1 = !autoPlot1;
  btnPlot1.classList.toggle("active", autoPlot1);
  btnPlot1.textContent = autoPlot1 ? "Nonaktifkan Otomatis Pompa 1" : "Aktifkan Otomatis Pompa 1";

  database.ref("control").update({
    "auto-plot1": autoPlot1,
    state: "set-apply"
  }).then(() => {
    console.log("Mode otomatis Pompa 1 diperbarui.");
  }).catch(err => console.error("Gagal update auto-plot1:", err));
});

btnPlot2.addEventListener("click", () => {
  autoPlot2 = !autoPlot2;
  btnPlot2.classList.toggle("active", autoPlot2);
  btnPlot2.textContent = autoPlot2 ? "Nonaktifkan Otomatis Pompa 2" : "Aktifkan Otomatis Pompa 2";

  database.ref("control").update({
    "auto-plot2": autoPlot2,
    state: "set-apply"
  }).then(() => {
    console.log("Mode otomatis Pompa 2 diperbarui.");
  }).catch(err => console.error("Gagal update auto-plot2:", err));
});

btnLamp.addEventListener("click", () => {
  autoLamp = !autoLamp;
  btnLamp.classList.toggle("active", autoLamp);
  btnLamp.textContent = autoLamp ? "Nonaktifkan Otomatis Lampu" : "Aktifkan Otomatis Lampu";

  database.ref("control").update({
    "auto-lamp": autoLamp,
    state: "set-apply"
  }).then(() => {
    console.log("Mode otomatis Lampu diperbarui.");
  }).catch(err => console.error("Gagal update auto-lamp:", err));
});

// ======= SIMPAN SETTING POMPA 1 =======
document.getElementById("save-plot1-settings").addEventListener("click", () => {
  const settings = {
    time1: document.getElementById("plot1-time1").value,
    duration1: parseInt(document.getElementById("plot1-duration1").value) || 0,
    unit1: document.getElementById("plot1-unit1").value,
    time2: document.getElementById("plot1-time2").value,
    duration2: parseInt(document.getElementById("plot1-duration2").value) || 0,
    unit2: document.getElementById("plot1-unit2").value,
    day1: document.getElementById("plot1-day1").checked,
    day2: document.getElementById("plot1-day2").checked,
    day3: document.getElementById("plot1-day3").checked,
    day4: document.getElementById("plot1-day4").checked,
    day5: document.getElementById("plot1-day5").checked,
    day6: document.getElementById("plot1-day6").checked,
    day7: document.getElementById("plot1-day7").checked
  };

  if (!settings.time1 || !settings.unit1 || settings.duration1 <= 0) {
    console.error("Pompa 1 memiliki data yang tidak valid.");
    return;
  }

  database.ref("settings/plot1").set(settings)
    .then(() => simpanSetting("plot1"));
});

// ======= SIMPAN SETTING POMPA 2 =======
document.getElementById("save-plot2-settings").addEventListener("click", () => {
  const settings = {
    time1: document.getElementById("plot2-time1").value,
    duration1: parseInt(document.getElementById("plot2-duration1").value) || 0,
    unit1: document.getElementById("plot2-unit1").value,
    time2: document.getElementById("plot2-time2").value,
    duration2: parseInt(document.getElementById("plot2-duration2").value) || 0,
    unit2: document.getElementById("plot2-unit2").value,
    day1: document.getElementById("plot2-day1").checked,
    day2: document.getElementById("plot2-day2").checked,
    day3: document.getElementById("plot2-day3").checked,
    day4: document.getElementById("plot2-day4").checked,
    day5: document.getElementById("plot2-day5").checked,
    day6: document.getElementById("plot2-day6").checked,
    day7: document.getElementById("plot2-day7").checked
  };

  if (!settings.time1 || !settings.unit1 || settings.duration1 <= 0) {
    console.error("Pompa 2 memiliki data yang tidak valid.");
    return;
  }

  database.ref("settings/plot2").set(settings)
    .then(() => simpanSetting("plot2"));
});

// ======= SIMPAN SETTING LAMPU =======
document.getElementById("save-lamp-settings").addEventListener("click", () => {
  const settings = {
    "time-on": document.getElementById("lamp-time-on").value,
    "time-off": document.getElementById("lamp-time-off").value,
    day1: document.getElementById("lamp-day1").checked,
    day2: document.getElementById("lamp-day2").checked,
    day3: document.getElementById("lamp-day3").checked,
    day4: document.getElementById("lamp-day4").checked,
    day5: document.getElementById("lamp-day5").checked,
    day6: document.getElementById("lamp-day6").checked,
    day7: document.getElementById("lamp-day7").checked
  };

  if (!settings["time-on"] || !settings["time-off"]) {
    console.error("Lampu memiliki data yang tidak valid.");
    return;
  }

  database.ref("settings/lamp").set(settings)
    .then(() => simpanSetting("lamp"));
});

// ======= FUNGSI SIMPAN SETTING (set state) =======
function simpanSetting(device) {
  const stateRef = firebase.database().ref('control/state');
  stateRef.set('set-change')
    .then(() => {
      console.log(`${device} setting telah disimpan dan state berubah menjadi 'set-change'`);
    })
    .catch((error) => {
      console.error("Gagal menyimpan ke Firebase:", error);
    });
}

// Function to toggle button status
function toggleButton(buttonId) {
  const button = document.getElementById(buttonId);
  
  // Check if button is currently in active state
  if (button.classList.contains('btn-success') || button.classList.contains('btn-primary')) {
    // Change to active state (red color)
    button.classList.remove('btn-success', 'btn-primary');
    button.classList.add('btn-danger'); // Set the color to red
    // Change the text to 'Nonaktifkan Manual' version
    if (buttonId === 'control-plot1') {
      button.textContent = 'Nonaktifkan Manual Pompa 1';
    } else if (buttonId === 'control-plot2') {
      button.textContent = 'Nonaktifkan Manual Pompa 2';
    } else {
      button.textContent = 'Nonaktifkan Manual Lampu';
    }
  } else {
    // Change back to inactive state (green or blue color)
    button.classList.remove('btn-danger');
    if (buttonId === 'control-plot1') {
      button.classList.add('btn-success');
      button.textContent = 'Aktifkan Manual Pompa 1';
    } else if (buttonId === 'control-plot2') {
      button.classList.add('btn-success');
      button.textContent = 'Aktifkan Manual Pompa 2';
    } else {
      button.classList.add('btn-primary');
      button.textContent = 'Aktifkan Manual Lampu';
    }
  }
}

function toggleAutoButton(buttonId) {
  const button = document.getElementById(buttonId);

  const isLamp = buttonId === 'btn-auto-lamp';
  const isPlot1 = buttonId === 'btn-auto-plot1';
  const isPlot2 = buttonId === 'btn-auto-plot2';

  if (button.classList.contains('btn-success') || button.classList.contains('btn-primary')) {
    // Aktifkan (ubah ke merah)
    button.classList.remove('btn-success', 'btn-primary');
    button.classList.add('btn-danger');

    if (isPlot1) {
      button.textContent = 'Nonaktifkan Otomatis Pompa 1';
    } else if (isPlot2) {
      button.textContent = 'Nonaktifkan Otomatis Pompa 2';
    } else if (isLamp) {
      button.textContent = 'Nonaktifkan Otomatis Lampu';
    }
  } else {
    // Nonaktifkan (ubah ke hijau/biru)
    button.classList.remove('btn-danger');

    if (isPlot1) {
      button.classList.add('btn-success');
      button.textContent = 'Aktifkan Otomatis Pompa 1';
    } else if (isPlot2) {
      button.classList.add('btn-success');
      button.textContent = 'Aktifkan Otomatis Pompa 2';
    } else if (isLamp) {
      button.classList.add('btn-primary');
      button.textContent = 'Aktifkan Otomatis Lampu';
    }
  }
}

// Function to show pop-up alert when settings are saved
function saveSettings(device) {
alert(device + ' setting saved successfully!');
}

window.onload = function () {
  // Pastikan elemen-elemen sudah dimuat
  var tempValue = document.getElementById("tempValue");
  var humValue = document.getElementById("humValue");
  var moisture1Value = document.getElementById("moisture1Value");
  var moisture2Value = document.getElementById("moisture2Value");

  // Inisialisasi gauge
  var gTemp = new JustGage({
    id: "gaugeTemp",
    value: 0,
    min: 0,
    max: 100,
    pointer: true,
    gaugeWidthScale: 0.6,
    counter: true,
    hideInnerShadow: true
  });

  var gHum = new JustGage({
    id: "gaugeHum",
    value: 0,
    min: 0,
    max: 100,
    pointer: true,
    gaugeWidthScale: 0.6,
    counter: true,
    hideInnerShadow: true
  });

  var gM1 = new JustGage({
    id: "gaugeM1",
    value: 0,
    min: 0,
    max: 100,
    pointer: true,
    gaugeWidthScale: 0.6,
    counter: true,
    hideInnerShadow: true
  });

  var gM2 = new JustGage({
    id: "gaugeM2",
    value: 0,
    min: 0,
    max: 100,
    pointer: true,
    gaugeWidthScale: 0.6,
    counter: true,
    hideInnerShadow: true
  });

  // Ambil data dari Firebase Realtime Database
  const sensorRef = database.ref("monitoring"); // Ambil data dari path 'monitoring'
  sensorRef.on("value", function(snapshot) {
    const data = snapshot.val();

    // Pastikan data tersedia sebelum memperbarui
    if (data) {
      const temp = data.temperature || 0;
      const hum = data.humidity || 0;
      const moisture1 = data.plot1 || 0;
      const moisture2 = data.plot2 || 0;

      // Perbarui nilai gauge dengan data dari Firebase
      gTemp.refresh(temp);
      gHum.refresh(hum);
      gM1.refresh(moisture1);
      gM2.refresh(moisture2);

      // Perbarui teks yang ditampilkan di bawah gauge
      if (tempValue) tempValue.innerText = temp;
      if (humValue) humValue.innerText = hum;
      if (moisture1Value) moisture1Value.innerText = moisture1;
      if (moisture2Value) moisture2Value.innerText = moisture2;
    }
  });
};

// Sinkronisasi real-time status manual dari Firebase
const manualControlRef = database.ref("control");

manualControlRef.on("value", (snapshot) => {
  const controlData = snapshot.val();

  // Lamp
  const lampBtn = document.getElementById("control-lamp");
  if (controlData?.lamp) {
    lampBtn.classList.remove('btn-primary');
    lampBtn.classList.add('btn-danger');
    lampBtn.textContent = 'Nonaktifkan Manual Lampu';
  } else {
    lampBtn.classList.remove('btn-danger');
    lampBtn.classList.add('btn-primary');
    lampBtn.textContent = 'Aktifkan Manual Lampu';
  }

  // Plot1
  const plot1Btn = document.getElementById("control-plot1");
  if (controlData?.plot1) {
    plot1Btn.classList.remove('btn-success');
    plot1Btn.classList.add('btn-danger');
    plot1Btn.textContent = 'Nonaktifkan Manual Pompa 1';
  } else {
    plot1Btn.classList.remove('btn-danger');
    plot1Btn.classList.add('btn-success');
    plot1Btn.textContent = 'Aktifkan Manual Pompa 1';
  }

  // Plot2
  const plot2Btn = document.getElementById("control-plot2");
  if (controlData?.plot2) {
    plot2Btn.classList.remove('btn-success');
    plot2Btn.classList.add('btn-danger');
    plot2Btn.textContent = 'Nonaktifkan Manual Pompa 2';
  } else {
    plot2Btn.classList.remove('btn-danger');
    plot2Btn.classList.add('btn-success');
    plot2Btn.textContent = 'Aktifkan Manual Pompa 2';
  }
});

// Sinkronisasi real-time status otomatis dari Firebase
const autoControlRef = database.ref("control");

autoControlRef.on("value", (snapshot) => {
  const controlData = snapshot.val();

  const btnAutoLamp = document.getElementById("btn-auto-lamp");
  const btnAutoPlot1 = document.getElementById("btn-auto-plot1");
  const btnAutoPlot2 = document.getElementById("btn-auto-plot2");

  if (controlData?.["auto-lamp"]) {
    btnAutoLamp.classList.remove("btn-primary");
    btnAutoLamp.classList.add("btn-danger");
    btnAutoLamp.textContent = "Nonaktifkan Otomatis Lampu";
    autoLamp = true;
  } else {
    btnAutoLamp.classList.remove("btn-danger");
    btnAutoLamp.classList.add("btn-primary");
    btnAutoLamp.textContent = "Aktifkan Otomatis Lampu";
    autoLamp = false;
  }

  if (controlData?.["auto-plot1"]) {
    btnAutoPlot1.classList.remove("btn-success");
    btnAutoPlot1.classList.add("btn-danger");
    btnAutoPlot1.textContent = "Nonaktifkan Otomatis Pompa 1";
    autoPlot1 = true;
  } else {
    btnAutoPlot1.classList.remove("btn-danger");
    btnAutoPlot1.classList.add("btn-success");
    btnAutoPlot1.textContent = "Aktifkan Otomatis Pompa 1";
    autoPlot1 = false;
  }

  if (controlData?.["auto-plot2"]) {
    btnAutoPlot2.classList.remove("btn-success");
    btnAutoPlot2.classList.add("btn-danger");
    btnAutoPlot2.textContent = "Nonaktifkan Otomatis Pompa 2";
    autoPlot2 = true;
  } else {
    btnAutoPlot2.classList.remove("btn-danger");
    btnAutoPlot2.classList.add("btn-success");
    btnAutoPlot2.textContent = "Aktifkan Otomatis Pompa 2";
    autoPlot2 = false;
  }
});

// Sinkronisasi real-time settings dari Firebase
const settingsRef = database.ref("settings");

settingsRef.on("value", (snapshot) => {
  const settings = snapshot.val();
  console.log("Data yang diterima dari Firebase:", settings);  // Verifikasi data yang diterima

  if (settings) {
    // Lamp settings
    if (settings.lamp) {
      document.getElementById("lamp-time-on").value = settings.lamp["time-on"] || "";
      document.getElementById("lamp-time-off").value = settings.lamp["time-off"] || "";
      setDayCheckboxes("lamp", settings.lamp);
    }

    // Plot 1 settings
    if (settings.plot1) {
      document.getElementById("plot1-time1").value = settings.plot1.time1 || "";
      document.getElementById("plot1-duration1").value = settings.plot1.duration1 || "";
      document.getElementById("plot1-unit1").value = settings.plot1.unit1 || "minute";
      document.getElementById("plot1-time2").value = settings.plot1.time2 || "";
      document.getElementById("plot1-duration2").value = settings.plot1.duration2 || "";
      document.getElementById("plot1-unit2").value = settings.plot1.unit2 || "second";
      setDayCheckboxes("plot1", settings.plot1);
    }

    // Plot 2 settings
    if (settings.plot2) {
      document.getElementById("plot2-time1").value = settings.plot2.time1 || "";
      document.getElementById("plot2-duration1").value = settings.plot2.duration1 || "";
      document.getElementById("plot2-unit1").value = settings.plot2.unit1 || "minute";
      document.getElementById("plot2-time2").value = settings.plot2.time2 || "";
      document.getElementById("plot2-duration2").value = settings.plot2.duration2 || "";
      document.getElementById("plot2-unit2").value = settings.plot2.unit2 || "second";
      setDayCheckboxes("plot2", settings.plot2);
    }
  }
});

// Fungsi bantu untuk set checkbox hari aktif berdasarkan prefix ID (plot1, plot2, lamp)
function setDayCheckboxes(prefix, setting) {
  for (let i = 1; i <= 7; i++) {
    const checkbox = document.getElementById(`${prefix}-day${i}`);
    if (checkbox) {
      checkbox.checked = !!setting[`day${i}`];
    }
  }
}

// Fungsi bantu untuk ambil data hari aktif dari prefix ID
function getCheckedDays(prefix) {
  const days = {};
  for (let i = 1; i <= 7; i++) {
    const checkbox = document.getElementById(`${prefix}-day${i}`);
    if (checkbox) {
      days[`day${i}`] = checkbox.checked;
    }
  }
  return days;
}


// Flag mode otomatis
let modeOtomatis = false;

// Referensi Firebase path (contoh)
const sensorRef = firebase.database().ref('sensor');
const controlRef = firebase.database().ref('control');

// Fungsi untuk aktifkan mode otomatis
function aktifkanModeOtomatis() {
  modeOtomatis = true;
  console.log('Mode otomatis aktif');

  // Listen data sensor realtime
  sensorRef.on('value', snapshot => {
    if (!modeOtomatis) return; // kalau mode otomatis mati, ignore

    const sensorData = snapshot.val();
    if (!sensorData) return;

    // Ambil data sensor
    const kelembabanTanah = sensorData.kelembabanTanah;
    const suhu = sensorData.suhu;

    // Log data sensor (optional)
    console.log(`Data sensor - Kelembaban: ${kelembabanTanah}, Suhu: ${suhu}`);

    // Cek kondisi untuk pompa (misal jika kelembaban tanah < threshold)
    if (kelembabanTanah < threshold.kelembabanTanah) {
      // Kirim instruksi ON pompa
      controlRef.child('pompa').set(true);
      console.log('Pompa ON (otomatis karena kelembaban rendah)');
    }
    // Kalau tidak sesuai syarat, tidak kirim ON (tidak ganti status pompa)

    // Cek kondisi untuk lampu (misal suhu < threshold)
    if (suhu < threshold.suhu) {
      controlRef.child('lampu').set(true);
      console.log('Lampu ON (otomatis karena suhu rendah)');
    }
    // Kalau tidak sesuai syarat, tidak kirim ON

  });
}

// Fungsi untuk matikan mode otomatis
function matikanModeOtomatis() {
  modeOtomatis = false;
  sensorRef.off('value');
  console.log('Mode otomatis dimatikan');
}

// ======= KONTROL OTOMATIS SENSOR =======
const listeners = {};

// Fungsi update UI tombol (warna, label, dll)
function updateButtonUI(id, isActive) {
  const btn = document.getElementById(id);
  if (!btn) return;

  btn.classList.toggle("active", isActive);
  btn.style.border = "none";
  btn.style.color = "white";

  const labelMap = {
    "auto-lamp": ["Aktifkan Otomatis Lampu", "Nonaktifkan Otomatis Lampu"],
    "auto-plot1": ["Aktifkan Otomatis Pompa 1", "Nonaktifkan Otomatis Pompa 1"],
    "auto-plot2": ["Aktifkan Otomatis Pompa 2", "Nonaktifkan Otomatis Pompa 2"],
  };

  const colorMap = {
    "auto-lamp": "#0d6efd",
    "auto-plot1": "#198754",
    "auto-plot2": "#198754",
  };

  const activeColor = "#dc3545";
  btn.textContent = isActive ? labelMap[id][1] : labelMap[id][0];
  btn.style.backgroundColor = isActive ? activeColor : colorMap[id];
}

function setupListener(id) {
  const ref = firebase.database().ref("monitoring");

  const callback = snapshot => {
    const data = snapshot.val();
    if (!data) return;

    const { temperature, humidity, plot1, plot2 } = data;

    const threshold = {
      temp: { min: 28, max: 30 },
      humid: { min: 60, max: 90 },
      soil: { min: 60, max: 90 }
    };

    // Cek apakah keluar dari threshold
    const isTempHigh = temperature > threshold.temp.max;
    const isTempLow = temperature < threshold.temp.min;
    const isHumidOut = humidity < threshold.humid.min || humidity > threshold.humid.max;
    const isSoilOut1 = plot1 < threshold.soil.min || plot1 > threshold.soil.max;
    const isSoilOut2 = plot2 < threshold.soil.min || plot2 > threshold.soil.max;

    let sensorKey = "";
    let controlKey = "";
    let status = false;

    if (id === "auto-plot1") {
      sensorKey = "sensor_plot1";
      controlKey = "plot1";

      // Jika suhu terlalu panas + kelembaban udara/soil di luar threshold → nyalakan pompa 1
      if (isTempHigh && (isHumidOut || isSoilOut1)) {
        status = true;
      }

    } else if (id === "auto-plot2") {
      sensorKey = "sensor_plot2";
      controlKey = "plot2";

      if (isTempHigh && (isHumidOut || isSoilOut2)) {
        status = true;
      }

    } else if (id === "auto-lamp") {
      sensorKey = "sensor_lamp";
      controlKey = "lamp";

      // Jika suhu terlalu dingin + kelembaban udara/soil di luar threshold → nyalakan lampu
      if (isTempLow && (isHumidOut || (isSoilOut1 && isSoilOut2))) {
        status = true;
      }
    }

    // Update aktuator hanya jika mode otomatis aktif
    firebase.database().ref(`control/${sensorKey}`).once("value").then(snap => {
      if (snap.val() === true) {
        firebase.database().ref(`control/${controlKey}`).set(status);
      }
    });
  };

  ref.on("value", callback);
  listeners[id] = { ref, callback };
}

function removeListener(id) {
  if (listeners[id]) {
    listeners[id].ref.off("value", listeners[id].callback);
    delete listeners[id];
  }
}

// Toggle otomatis sensor, update Firebase dan UI, setup/remove listener
function toggleAutoSensor(id) {
  const btn = document.getElementById(id);
  if (!btn) return;

  const isActive = btn.classList.contains("active");

  const sensorKeyMap = {
    "auto-lamp": "sensor_lamp",
    "auto-plot1": "sensor_plot1",
    "auto-plot2": "sensor_plot2",
  };

  const controlKeyMap = {
    "sensor_lamp": "lamp",
    "sensor_plot1": "plot1",
    "sensor_plot2": "plot2",
  };

  const sensorKey = sensorKeyMap[id];
  const controlKey = controlKeyMap[sensorKey];

  const statusRef = firebase.database().ref(`control/${sensorKey}`);

  if (!isActive) {
    // Aktifkan otomatis sensor
    statusRef.set(true).then(() => {
      updateButtonUI(id, true);
      setupListener(id);
    });
  } else {
    // Nonaktifkan otomatis sensor
    statusRef.set(false).then(() => {
      updateButtonUI(id, false);
      removeListener(id);

      // Matikan aktuator terkait juga
      firebase.database().ref(`control/${controlKey}`).set(false);
    });
  }
}

// Load status otomatis sensor dari Firebase dan update UI + setup listener
function loadAutoSensorStatus() {
  firebase.database().ref("control").once("value").then(snapshot => {
    const control = snapshot.val() || {};

    const map = {
      "auto-lamp": control.sensor_lamp,
      "auto-plot1": control.sensor_plot1,
      "auto-plot2": control.sensor_plot2,
    };

    for (const [id, isActive] of Object.entries(map)) {
      updateButtonUI(id, isActive === true);
      if (isActive === true) setupListener(id);
    }
  });
}

// Pasang event listener tombol
window.addEventListener("load", () => {
  ["auto-lamp", "auto-plot1", "auto-plot2"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => toggleAutoSensor(id));
    }
  });

  loadAutoSensorStatus();
});

// ======= LIHAT RIWAYAT PEMANTAUAN =======
const dataRef = firebase.database().ref("data");
const container = document.getElementById("dataKomulatifCards");

dataRef.on("value", (snapshot) => {
  if (!snapshot.exists()) {
    container.innerHTML = `<p class="text-center">Data tidak tersedia.</p>`;
    return;
  }

  let dataList = Object.values(snapshot.val());

  // Sort descending berdasarkan tanggal + waktu
  dataList.sort(
    (a, b) =>
      new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
  );

  const top3 = dataList.slice(0, 3);

  container.innerHTML = top3
    .map(
      (item) => `
    <div class="col-md-4">
      <div class="card h-100 bg-light shadow-sm border-0">
        <div class="card-body">
          <h5 class="card-title mb-3">
          <i class="fas fa-database fa-lg mb-2" style="color:#3c4b64;"></i>
            <span class="date-badge">${item.date}</span>
            <span class="time-badge">${item.time}</span>
          </h5>

          <div class="data-row">
            <div class="key">Temperature</div>
            <div class="value">${item.temperature} °C</div>
          </div>
          <div class="data-row">
            <div class="key">Humidity</div>
            <div class="value">${item.humidity} %</div>
          </div>
          <div class="data-row">
            <div class="key">Moisture Plot 1</div>
            <div class="value">${item.plot1} %</div>
          </div>
          <div class="data-row">
            <div class="key">Moisture Plot 2</div>
            <div class="value">${item.plot2} %</div>
          </div>
        </div>
        <button
          class="btn btn-primary w-100"
          onclick="goToDetail('${item.date}', '${item.time}')"
        >
          Detail
        </button>
      </div>
    </div>
  `
    )
    .join("");
});

// ======= LIHAT DETAIL RIWAYAT PEMANTAUAN =======
let detailDataRef = null;

function goToDetail() {
  const db = firebase.database();
  const dataRef = db.ref('data'); // sesuaikan dengan path di Firebase kamu
  detailDataRef = dataRef;

  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';

  // Pasang listener real-time
  dataRef.on('value', (snapshot) => {
    container.innerHTML = ''; // Bersihkan isi sebelum render ulang

    snapshot.forEach((childSnap) => {
      const item = childSnap.val();

      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.innerHTML = `
        <div class="card h-100 bg-light shadow-sm border-0 card-detail">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-database fa-lg mb-2" style="color:#3c4b64;"></i>
              <span class="date-badge">${item.date || ''}</span>
              <span class="time-badge">${item.time || ''}</span>
            </h5>
            <div class="data-row">
              <div class="key">Temperature</div>
              <div class="value">${item.temperature || '-'} °C</div>
            </div>
            <div class="data-row">
              <div class="key">Humidity</div>
              <div class="value">${item.humidity || '-'} %</div>
            </div>
            <div class="data-row">
              <div class="key">Moisture Plot 1</div>
              <div class="value">${item.plot1 || '-'} %</div>
            </div>
            <div class="data-row">
              <div class="key">Moisture Plot 2</div>
              <div class="value">${item.plot2 || '-'} %</div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  });

  // Tampilkan modal
  new bootstrap.Modal(document.getElementById('detailModal')).show();
}

function closeModal() {
  bootstrap.Modal.getInstance(document.getElementById('detailModal')).hide();

  // Hapus listener real-time agar tidak dobel
  if (detailDataRef) {
    detailDataRef.off();
    detailDataRef = null;
  }
}

// ======= GRAFIK TREND DATA SENSOR =======
let sensorChart; // Global Chart.js instance

function initSensorChart() {
  const ctx = document.getElementById('sensorChart').getContext('2d');
  sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // waktu atau timestamp
      datasets: [
        {
          label: 'Temperature (°C)',
          data: [],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3
        },
        {
          label: 'Humidity (%)',
          data: [],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3
        },
        {
          label: 'Moisture Plot 1 (%)',
          data: [],
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          tension: 0.3
        },
        {
          label: 'Moisture Plot 2 (%)',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Sensor Data Trend'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Waktu'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Nilai Sensor'
          }
        }
      }
    }
  });
}

function updateSensorChartRealtime() {
  const db = firebase.database();
  const dataRef = db.ref('data');

  dataRef.on('value', (snapshot) => {
    const labels = [];
    const temperatureData = [];
    const humidityData = [];
    const plot1Data = [];
    const plot2Data = [];

    snapshot.forEach(childSnap => {
      const item = childSnap.val();
      const label = `${item.date || ''} ${item.time || ''}`;
      labels.push(label);
      temperatureData.push(parseFloat(item.temperature) || 0);
      humidityData.push(parseFloat(item.humidity) || 0);
      plot1Data.push(parseFloat(item.plot1) || 0);
      plot2Data.push(parseFloat(item.plot2) || 0);
    });

    sensorChart.data.labels = labels;
    sensorChart.data.datasets[0].data = temperatureData;
    sensorChart.data.datasets[1].data = humidityData;
    sensorChart.data.datasets[2].data = plot1Data;
    sensorChart.data.datasets[3].data = plot2Data;
    sensorChart.update();
  });
}

// ======= AUTO REFRESH / LOAD HALAMAN =======
document.addEventListener('DOMContentLoaded', function () {
  initSensorChart();
  updateSensorChartRealtime();
});

// ======= FITUR LOGIN / LOGOUT AKUN =======
document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("authButton");

  firebase.auth().onAuthStateChanged((user) => {
    if (authBtn) {
      if (user) {
        authBtn.innerText = "Logout";
        authBtn.href = "#";
        authBtn.onclick = (e) => {
          e.preventDefault();
          firebase.auth().signOut().then(() => {
            window.location.href = "index.html";
          });
        };
      } else {
        authBtn.innerText = "Login";
        authBtn.href = "index.html";
        authBtn.onclick = null;
      }
    }
  });
});

// ======= FITUR MANAJEMEN DATA PROFILE =======
document.addEventListener("DOMContentLoaded", function () {
  firebase.auth().onAuthStateChanged(function(user) {
    const profileLink = document.getElementById("profileLink");
    const authBtn = document.getElementById("authButton");

    if (user) {
      if (profileLink) {
        profileLink.style.display = "inline-block";
        profileLink.href = "profil.html";
        profileLink.classList.add("profile-btn");  // Tambah efek hover dari JS
      }

      if (authBtn) {
        authBtn.innerText = "Logout";
        authBtn.href = "#";
        authBtn.onclick = function (e) {
          e.preventDefault();
          firebase.auth().signOut().then(() => {
            window.location.href = "index.html";
          });
        };
      }
    } else {
      if (authBtn) {
        authBtn.innerText = "Login";
        authBtn.href = "index.html";
      }
    }
  });
});


document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const newName = nameInput.value.trim();
  const newEmail = emailInput.value.trim();
  const newPassword = passwordInput.value;
  const currentPassword = document.getElementById("currentPassword").value;

  if (!currentPassword) {
    alert("Masukkan password saat ini untuk menyimpan perubahan.");
    return;
  }

  const credentials = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

  user.reauthenticateWithCredential(credentials).then(() => {
    const updates = [];

    // Update nama di database
    updates.push(firebase.database().ref("users/" + uid + "/name").set(newName));

    // Update email jika berubah
    if (newEmail !== user.email) {
      updates.push(user.updateEmail(newEmail));
      updates.push(firebase.database().ref("users/" + uid + "/email").set(newEmail));
    }

    // Update password jika diisi
    if (newPassword && newPassword.length >= 6) {
      updates.push(user.updatePassword(newPassword));
    }

    return Promise.all(updates);
  })
  .then(() => {
    alert("Profil berhasil diperbarui.");
    passwordInput.value = "";
    document.getElementById("currentPassword").value = "";
  })
  .catch(error => {
    console.error("Gagal menyimpan:", error);
    alert("Gagal menyimpan: " + error.message);
  });
});

















