// Сервис для мониторинга системы
export class MonitorService {
  // Получить использование ЦП
  static async getCpuUsage() {
    const os = require('os');
    const cpus = os.cpus();
    let idle = 0, total = 0;
    for (const cpu of cpus) {
      for (const type in cpu.times) {
        total += cpu.times[type];
      }
      idle += cpu.times.idle;
    }
    return 1 - idle / total;
  }
  
  // Получить использование ОЗУ
  static getRamUsage() {
    const os = require('os');
    return 1 - os.freemem() / os.totalmem();
  }
  
  // Получить использование диска (C:)
  static async getDiskUsage() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Get-PSDrive -Name C | Select-Object Used,Free,Capacity | ConvertTo-Json"', (err: any, stdout: any) => {
        try {
          const obj = JSON.parse(stdout);
          resolve(obj);
        } catch (e) {
          resolve(null);
        }
      });
    });
  }
} 