// Сервис для управления питанием и пользователями
export class PowerService {
  // Выключение компьютера
  static shutdown() {
    const { exec } = require('child_process');
    exec('shutdown /s /t 0');
  }
  
  // Перезагрузка
  static reboot() {
    const { exec } = require('child_process');
    exec('shutdown /r /t 0');
  }
  
  // Сон
  static sleep() {
    const { exec } = require('child_process');
    exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0');
  }
  
  // Блокировка экрана
  static lock() {
    const { exec } = require('child_process');
    exec('rundll32.exe user32.dll,LockWorkStation');
  }
  
  // Завершение сеанса
  static logout() {
    const { exec } = require('child_process');
    exec('shutdown /l');
  }
  
  // Получить текущего пользователя
  static getCurrentUser() {
    return require('os').userInfo().username;
  }
  
  // Смена пользователя
  static switchUser() {
    const { exec } = require('child_process');
    exec('tsdiscon');
  }
} 