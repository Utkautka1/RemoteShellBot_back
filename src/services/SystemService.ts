// Сервис для системных операций
export class SystemService {
  // Получить версию ОС
  static getOsVersion() {
    return require('os').release();
  }
  
  // Получить архитектуру системы
  static getArch() {
    return require('os').arch();
  }
  
  // Очистить временные файлы
  static async clearTemp() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Remove-Item -Path $env:TEMP\* -Recurse -Force"', () => resolve(true));
    });
  }
  
  // Очистить корзину
  static async clearRecycleBin() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Clear-RecycleBin -Force"', () => resolve(true));
    });
  }
} 