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
  ram_usage.innerHTML = `RAM ${ramInUse}`;
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