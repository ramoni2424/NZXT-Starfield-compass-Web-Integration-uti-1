// Función para obtener cookies
function get_cookie(cookie_name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.length > 0) {
          let name, value;
          [name, value] = cookie.split('=');
          if (name === cookie_name) return value;
      }
  }
  return null;
}

// Configuración de la vista
const VIEWSTATE = parseInt(get_cookie('viewstate')) || 640;
document.body.style.width = VIEWSTATE + 'px';
document.body.style.height = VIEWSTATE + 'px';

// Función para actualizar la barra de progreso
function updateProgress(elementId, value, maxValue = 100) {
  const progressBar = document.getElementById(elementId);
  if (value > maxValue) {
      value = maxValue;
  }
  progressBar.style.width = (value / maxValue) * 100 + '%';
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

// Actualización de CPU
function update_cpu(temp) {
  updateTemperature('cpu_temp', temp);
  updateProgress('cpu_bar', Math.round(temp));
}

// Actualización de GPU
function update_gpu(temp) {
  updateTemperature('gpu_temp', temp);
  updateProgress('gpu_bar', Math.round(temp));
}

// Actualización de RAM
function update_ram(ram) {
  const ram_usage = document.getElementById('ram_usage');
  const ramInUse1 = ram.modules[0].kind;
  ram_usage.innerHTML = `${ramInUse1}`;
  const gbInUse = ram.inUse / 1024;
  const ram_total = ram.totalSize / 1024;
  updateProgress('ram_bar', gbInUse, ram_total);
}

// Actualización del uso de RAM
function use_ram(ram) {
  const ram_usage_uso = document.getElementById('ram_usage_uso');
  const gbInUse_uso = ram.inUse / 1024;
  ram_usage_uso.innerHTML = `${gbInUse_uso.toFixed(2)} GB`;

  // Barra de progreso
  const ram_total = ram.totalSize / 1024;
  let progress_ram = gbInUse_uso;

  function updateProgress_ram(value) {
      const progressBar_ram = document.getElementById('ram_bar');
      progress_ram = value;
      if (progress_ram > ram_total) {
          progress_ram = ram_total;
      }
      progressBar_ram.style.width = (progress_ram / ram_total * 100) + '%';
  }

  // Actualización de progreso
  setInterval(() => {
      const newValue = progress_ram;
      updateProgress_ram(newValue);
  }, 2000);
}

// Actualización de nombres
function use_cpu(cpus_c) {
  let cpu_palabraParaQuitar = "core"; // Palabra para quitar
  const cpu_usage_use_c = document.getElementById('cpu_usage_use');
  const cpuInUse = cpus_c.name.replace(new RegExp(cpu_palabraParaQuitar, 'gi'), "");
  cpu_usage_use_c.innerHTML = `${cpuInUse}`;
}

function use_gpu(gpus_c) {
  let gpu_palabraParaQuitar = "nvidia geforce"; // Palabra para quitar
  const gpu_usage_use_c = document.getElementById('gpu_usage_use');
  const gpuInUse = gpus_c.name.replace(new RegExp(gpu_palabraParaQuitar, 'gi'), "");
  gpu_usage_use_c.innerHTML = `${gpuInUse}`;
}

function use_kraken(kraken_c) {
  const kraken_usage_use_c = document.getElementById('kraken_usage_use');
  const krakenInUse = kraken_c.liquidTemperature;
  kraken_usage_use_c.innerHTML = `${krakenInUse} °C`;
  updateProgress('kraken_bar', krakenInUse);
}

// Función para actualizar fecha
function actualizarFecha() {
  const fecha = new Date();
  const dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
  const anio = fecha.getFullYear();
  const diaSemana = dias[fecha.getDay()]; // Obtenemos el día de la semana
  const mesLetra = meses[fecha.getMonth()]; // Obtenemos la primera letra del mes actual
  const fechaFormateada = `${dia}-${diaSemana} / ${mes}-${mesLetra} / ${anio}`;
  document.getElementById('hora_u_h').innerHTML = fechaFormateada;
}

// Actualiza la fecha inmediatamente
actualizarFecha();

// Función para actualizar hora
function actualizarHora() {
  const ahora = new Date();
  let horas = ahora.getHours();
  let minutos = ahora.getMinutes();
  // Llama a la fecha para que también se actualice
  if (horas === 0 && minutos === 0) {
      actualizarFecha();
  }
  const ampm = horas >= 12 ? 'pm' : 'am';
  horas = horas % 12 || 12;
  horas = horas < 10 ? '0' + horas : horas;
  minutos = minutos < 10 ? '0' + minutos : minutos;
  const horaFormateada = `${horas}:${minutos} ${ampm}`;
  document.getElementById('hora_use').textContent = horaFormateada;
}

// Actualiza la hora inmediatamente
actualizarHora();

// Configura setInterval para actualizar la hora cada 2 seg
setInterval(actualizarHora, 2000);

window.nzxt = {
  v1: {
      onMonitoringDataUpdate: (data) => {
          const { cpus, gpus, ram, kraken } = data;
          update_cpu(cpus[0].temperature);
          update_gpu(gpus[0].temperature);
          update_ram(ram);
          use_cpu(cpus[0]);
          use_gpu(gpus[0]);
          use_ram(ram);
          use_kraken(kraken);
      },
  },
};
