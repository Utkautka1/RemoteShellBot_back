// Сервис для работы с логами
export class LogService {
  // Получить системный лог (System)
  static async getSystemLog() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Get-EventLog -LogName System -Newest 100 | ConvertTo-Json"', (err: any, stdout: any) => {
        try { resolve(JSON.parse(stdout)); } catch { resolve([]); }
      });
    });
  }
  
  // Получить сетевой лог (Application)
  static async getNetworkLog() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Get-EventLog -LogName Application -Newest 100 | ConvertTo-Json"', (err: any, stdout: any) => {
        try { resolve(JSON.parse(stdout)); } catch { resolve([]); }
      });
    });
  }
  
  // Получить лог событий Windows (Security)
  static async getEventLog() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Get-EventLog -LogName Security -Newest 100 | ConvertTo-Json"', (err: any, stdout: any) => {
        try { resolve(JSON.parse(stdout)); } catch { resolve([]); }
      });
    });
  }
  
  // Получить лог ошибок (System, только Error)
  static async getErrorLog() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Get-EventLog -LogName System -EntryType Error -Newest 100 | ConvertTo-Json"', (err: any, stdout: any) => {
        try { resolve(JSON.parse(stdout)); } catch { resolve([]); }
      });
    });
  }
  
  // Получить лог входов/выходов из системы
  static async getLoginLog() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Get-EventLog -LogName Security -InstanceId 4624,4634 -Newest 100 | ConvertTo-Json"', (err: any, stdout: any) => {
        try { resolve(JSON.parse(stdout)); } catch { resolve([]); }
      });
    });
  }
  
  // Получить лог открытия файлов (Application, EventID 4656)
  static async getFileOpenLog() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Get-WinEvent -LogName Security | Where-Object {$_.Id -eq 4656} | Select-Object -First 100 | ConvertTo-Json"', (err: any, stdout: any) => {
        try { resolve(JSON.parse(stdout)); } catch { resolve([]); }
      });
    });
  }
} 