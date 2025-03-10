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


const VIEWSTATE = parseInt(get_cookie('viewstate')) || 640;
document.body.style.width = VIEWSTATE + 'px';
document.body.style.height = VIEWSTATE + 'px';

window.nzxt = {
  v1: {
    onMonitoringDataUpdate: (data) => {
      const { cpus, gpus, ram, kraken } = data;

      update_cpu(cpus[0].temperature);
      update_gpu(gpus[0].temperature);
      update_ram(ram);

      /*esta parte es metida por mi*/
      use_cpu(cpus[0]);
      use_gpu(gpus[0]);
      use_ram(ram);

      use_kraken(kraken);
    },
  },
};

/*
no borrar, es de ejemplo
const ram_usage = document.getElementById('ram_usage');
function update_ram(ram) {
  // Response is in Mebibytes, convert the 'inUse' value to gigabytes. || https://github.com/NZXTCorp/web-integrations-types/blob/main/v1/index.d.ts
  const gbInUse = ram.inUse / 1024;
  ram_usage.innerHTML = `${gbInUse.toFixed(2)} GB`;
}*/


const cpu_temp = document.getElementById('cpu_temp');
function update_cpu(temp) {
  cpu_temp.innerHTML = `${Math.round(temp)} °C`;

  /*Barra de progreso*/

  let progress_cpu = Math.round(temp);

  function updateProgress_cpu(value) {
    const progressBar_cpu = document.getElementById('cpu_bar');
    progress_cpu = value;
    if (progress_cpu > 100) {
      progress_cpu = 100;
    }
    progressBar_cpu.style.width = progress_cpu + '%';
  }

  // Actualización de progreso
  setInterval(() => {
    const newValue = progress_cpu;
    updateProgress_cpu(newValue);
  }, 2000);

}

const ram_usage = document.getElementById('ram_usage');
function update_ram(ram) {
  const ramInUse1 = ram.modules[0].kind;
  /*const ramInUse2 = ram.modules[0].frequency;*/
  ram_usage.innerHTML =
    `${ramInUse1}`;
}

const gpu_temp = document.getElementById('gpu_temp');
function update_gpu(temp) {
  gpu_temp.innerHTML = `${Math.round(temp)} °C`;

  /*Barra de progreso*/

  let progress_gpu = Math.round(temp);

  function updateProgress_gpu(value) {
    const progressBar_gpu = document.getElementById('gpu_bar');
    progress_gpu = value;
    if (progress_gpu > 100) {
      progress_gpu = 100;
    }
    progressBar_gpu.style.width = progress_gpu + '%';
  }

  // Actualización de progreso
  setInterval(() => {
    const newValue = progress_gpu;
    updateProgress_gpu(newValue);
  }, 2000);
}

//-------------------------------
/*esta parte es metida por mi*/
/*nombre cpu*/

const cpu_usage_use_c = document.getElementById('cpu_usage_use');
function use_cpu(cpus_c) {

  let cpu_palabraParaQuitar = "core"
  const cpuInUse = cpus_c.name.replace(new RegExp(cpu_palabraParaQuitar, 'gi'), "");

  cpu_usage_use_c.innerHTML = `${cpuInUse}`;
}

/*nombre ram*/

const ram_usage_uso = document.getElementById('ram_usage_uso');
function use_ram(ram) {
  // Response is in Mebibytes, conve  rt the 'inUse' value to gigabytes. || https://github.com/NZXTCorp/web-integrations-types/blob/main/v1/index.d.ts
  const gbInUse_uso = ram.inUse / 1024;
  ram_usage_uso.innerHTML = `${gbInUse_uso.toFixed(2)} GB`;

  /*Barra de progreso*/
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

  // Actualización de progres
  
  setInterval(() => {
    const newValue = progress_ram;
    updateProgress_ram(newValue);
  }, 2000);
}


/*nombre gpu*/
const gpu_usage_use_c = document.getElementById('gpu_usage_use');
function use_gpu(gpus_c) {

  let gpu_palabraParaQuitar = "nvidia geforce"

  const gpuInUse = gpus_c.name.replace(new RegExp(gpu_palabraParaQuitar, 'gi'), "");

  gpu_usage_use_c.innerHTML = `${gpuInUse}`;

}
//----------

const kraken_usage_use_c = document.getElementById('kraken_usage_use');
function use_kraken(kraken_c) {

  const krakenInUse = kraken_c.liquidTemperature;

  kraken_usage_use_c.innerHTML = `${krakenInUse} °C`;

  /*Barra de progreso*/

  let progress_kraken = krakenInUse;

  function updateProgress_kraken(value) {
    const progressBar_kraken = document.getElementById('kraken_bar');
    progress_kraken = value;
    if (progress_kraken > 100) {
      progress_kraken = 100;
    }
    progressBar_kraken.style.width = progress_kraken + '%';
  }

  // Actualización de progreso
  setInterval(() => {
    const newValue = progress_kraken;
    updateProgress_kraken(newValue);
  }, 2000);
}
//-------
//fecha
function actualizarFecha() {

  let fecha = new Date();

  let dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']; // Días de la semana
  let meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']; // Primeras 3 letras de cada mes

  let dia = String(fecha.getDate()).padStart(2, '0');
  let mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
  let anio = fecha.getFullYear();

  let diaSemana = dias[fecha.getDay()]; // Obtenemos el día de la semana
  let mesLetra = meses[fecha.getMonth()]; // Obtenemos la primera letra del mes actual

  let fechaFormateada = `${dia}-${diaSemana} / ${mes}-${mesLetra} / ${anio}`;

  document.getElementById('hora_u_h').innerHTML = fechaFormateada;
}

// Actualiza la fecha inmediatamente
actualizarFecha()

//----
//hora

// Obtén el elemento HTML
var elemento = document.getElementById('hora_use');

// Función para actualizar la hora
function actualizarHora() {
  // Obtén la fecha y hora actual
  var ahora = new Date();

  // Obtén las horas y los minutos
  var horas = ahora.getHours();
  var minutos = ahora.getMinutes();

  //*****fecha*/
  //llama a la fecha para que tambien se actualice
  if (horas === 0 && minutos === 0) { //esta en formato normal, no 24h -> 16:01,18:04,...
    actualizarFecha()
  }
  //*******/

  // Determina si es AM o PM
  var ampm = horas >= 12 ? 'pm' : 'am';

  // Convierte las horas al formato de 12 horas
  horas = horas % 12;
  horas = horas ? horas : 12; // la hora '0' debería ser '12'

  // Asegúrate de que las horas y los minutos sean de dos dígitos
  horas = horas < 10 ? '0' + horas : horas;
  minutos = minutos < 10 ? '0' + minutos : minutos;

  // Formatea la hora en el formato hh:mm AM/PM
  var horaFormateada = horas + ':' + minutos + ' ' + ampm;

  // Asigna la hora formateada al elemento HTML
  elemento.textContent = horaFormateada;
}

// Actualiza la hora inmediatamente
actualizarHora();

// Configura setInterval para actualizar la hora cada 2 seg
setInterval(actualizarHora, 2000);




