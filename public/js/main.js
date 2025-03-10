// Función para obtener cookies
function get_cookie(cookie_name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.length > 0) {
      let [name, value] = cookie.split('=');
      if (name === cookie_name) return value;
    }
  }
  return null;
}

// Configuración de la vista
const VIEWSTATE = parseInt(get_cookie('viewstate')) || 640;
document.body.style.width = VIEWSTATE + 'px';
document.body.style.height = VIEWSTATE + 'px';

// Función para actualizar el contenido
function updateAll(data) {
  const { cpus, gpus, ram, kraken } = data;

  // Actualizar CPU
  if (cpus && cpus[0]) {
    const cpuTemp = cpus[0].temperature;
    const cpuName = cpus[0].name.replace(/core/gi, "").trim();
    updateTemperature('cpu_temp', cpuTemp);
    updateProgress('cpu_bar', Math.round(cpuTemp));
    const cpuElement = document.getElementById('cpu_usage_use');
    if (cpuElement) {
      cpuElement.innerHTML = cpuName;
    }
  }

  // Actualizar GPU
  if (gpus && gpus[0]) {
    const gpuTemp = gpus[0].temperature;
    const gpuName = gpus[0].name.replace(/nvidia geforce/gi, "").trim();
    updateTemperature('gpu_temp', gpuTemp);
    updateProgress('gpu_bar', Math.round(gpuTemp));
    const gpuElement = document.getElementById('gpu_usage_use');
    if (gpuElement) {
      gpuElement.innerHTML = gpuName;
    }
  }

  // Actualizar RAM
  if (ram) {
    const ramUsageElement = document.getElementById('ram_usage');
    if (ramUsageElement && ram.modules && ram.modules[0]) {
      ramUsageElement.innerHTML = ram.modules[0].kind;
    }
    const ramUsageUsoElement = document.getElementById('ram_usage_uso');
    const gbInUse = ram.inUse / 1024;
    const ramTotal = ram.totalSize / 1024;
    if (ramUsageUsoElement) {
      ramUsageUsoElement.innerHTML = `${gbInUse.toFixed(2)} GB`;
    }
    updateProgress('ram_bar', gbInUse, ramTotal);
  }

  // Actualizar Kraken
  if (kraken) {
    const krakenTemp = kraken.liquidTemperature;
    updateTemperature('kraken_usage_use', krakenTemp);
    updateProgress('kraken_bar', krakenTemp);
  }
}

// Función para actualizar temperatura
function updateTemperature(elementId, temp) {
  const tempElement = document.getElementById(elementId);
  if (tempElement) {
    tempElement.innerHTML = `${Math.round(temp)} °C`;
  } else {
    console.error(`Elemento ${elementId} no encontrado`);
  }
}

// Función para actualizar barra de progreso
function updateProgress(elementId, value, maxValue = 100) {
  const progressBar = document.getElementById(elementId);
  if (progressBar) {
    value = Math.min(value, maxValue); // Asegurar que no supere el máximo
    progressBar.style.width = (value / maxValue) * 100 + '%';
  } else {
    console.error(`Elemento ${elementId} no encontrado`);
  }
}

// Función para actualizar fecha y hora
function actualizarFechaYHora() {
  const fecha = new Date();
  const dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  const diaSemana = dias[fecha.getDay()];
  const fechaFormateada = `${dia}-${diaSemana} / ${mes} / ${anio}`;
  document.getElementById('hora_u_h').innerHTML = fechaFormateada;

  const ahora = new Date();
  let horas = ahora.getHours();
  let minutos = ahora.getMinutes();
  const ampm = horas >= 12 ? 'pm' : 'am';
  horas = horas % 12 || 12;
  minutos = minutos < 10 ? '0' + minutos : minutos;
  const horaFormateada = `${horas}:${minutos} ${ampm}`;
  document.getElementById('hora_use').textContent = horaFormateada;
}

// Configura la actualización periódica de fecha y hora
setInterval(actualizarFechaYHora, 2000);

// Vinculación de la nueva función en onMonitoringDataUpdate
window.nzxt = {
  v1: {
    onMonitoringDataUpdate: updateAll,
  },
};
