// Сервис для управления процессами
export class ProcessService {
  // Список процессов
  static async listProcesses() {
    const { exec } = require('child_process');
    return await new Promise((resolve, reject) => {
      exec('powershell -Command "Get-Process | Select-Object Id,ProcessName,CPU,WS | ConvertTo-Json"', (err: any, stdout: any) => {
        if (err) return reject(err);
        try {
          const arr = JSON.parse(stdout);
          resolve(Array.isArray(arr) ? arr : [arr]);
        } catch (e) {
          resolve([]);
        }
      });
    });
  }
  
  // Завершить процесс
  static async killProcess(pid: number) {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec(`powershell -Command "Stop-Process -Id ${pid} -Force"`, () => resolve(true));
    });
  }
  
  // Получить PID процесса по имени
  static async getPid(name: string) {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec(`powershell -Command "Get-Process -Name \"${name}\" | Select-Object -First 1 Id | ConvertTo-Json"`, (err: any, stdout: any) => {
        try {
          const obj = JSON.parse(stdout);
          resolve(obj?.Id || null);
        } catch (e) {
          resolve(null);
        }
      });
    });
  }
  
  // Запустить процесс
  static async startProcess(path: string) {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec(`start "" "${path}"`, () => resolve(true));
    });
  }
} 