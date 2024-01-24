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

const cpu_temp = document.getElementById('cpu_temp');
function update_cpu(temp) {
  cpu_temp.innerHTML = `${Math.round(temp)} °C`;
}
/*
no borrar, es de ejemplo
const ram_usage = document.getElementById('ram_usage');
function update_ram(ram) {
  // Response is in Mebibytes, convert the 'inUse' value to gigabytes. || https://github.com/NZXTCorp/web-integrations-types/blob/main/v1/index.d.ts
  const gbInUse = ram.inUse / 1024;
  ram_usage.innerHTML = `${gbInUse.toFixed(2)} GB`;
}*/


const ram_usage = document.getElementById('ram_usage');
function update_ram(ram) {
  // Response is in Mebibytes, convert the 'inUse' value to gigabytes. || https://github.com/NZXTCorp/web-integrations-types/blob/main/v1/index.d.ts
  const ramInUse = ram.modules[0].kind;
  //  const ramInUse = ram.modules[0].model;
  ram_usage.innerHTML = `RAM-${ramInUse}`;
}


const gpu_temp = document.getElementById('gpu_temp');
function update_gpu(temp) {
  gpu_temp.innerHTML = `${Math.round(temp)} °C`;
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
  // Response is in Mebibytes, convert the 'inUse' value to gigabytes. || https://github.com/NZXTCorp/web-integrations-types/blob/main/v1/index.d.ts
  const gbInUse_uso = ram.inUse / 1024;
  ram_usage_uso.innerHTML = `${gbInUse_uso.toFixed(2)} GB`;
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

}

//----
// Obtén el elemento HTML
var elemento = document.getElementById('hora_use');

// Función para actualizar la hora
function actualizarHora() {
  // Obtén la fecha y hora actual
  var ahora = new Date();

  // Obtén las horas y los minutos
  var horas = ahora.getHours();
  var minutos = ahora.getMinutes();

  // Determina si es AM o PM
  var ampm = horas >= 12 ? 'PM' : 'AM';

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

// Configura setInterval para actualizar la hora cada 30 seg
setInterval(actualizarHora, 30000);


//---------
//imagenes
let element = document.getElementById('imagen1'); // Reemplaza 'myElement' con el ID de tu elemento

setInterval(() => {
  let randomNum = Math.random();
  let newImage = new Image();
  newImage.src = `https://picsum.photos/200/300?random=${randomNum}`;
  newImage.onload = () => {
    element.style.backgroundImage = `url('${newImage.src}')`;
  };
}, 2000); //60000