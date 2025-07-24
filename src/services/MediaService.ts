import path from 'path';
import fs from 'fs';

// @ts-ignore
// eslint-disable-next-line
declare module 'screenshot-desktop';

// Сервис для работы с медиа
export class MediaService {
  // Сделать скриншот экрана
  static async screenshot() {
    const screenshot = (await import('screenshot-desktop')).default;
    const tmpDir = require('os').tmpdir();
    const desktopDir = 'C:/Users/strig/Desktop';
    const fileName = `screenshot_${Date.now()}.png`;
    const tmpPath = require('path').join(tmpDir, fileName);
    const desktopPath = require('path').join(desktopDir, fileName);
    await screenshot({ filename: tmpPath });
    if (!require('fs').existsSync(tmpPath)) throw new Error('Скриншот не создан');
    // Копируем на Desktop
    require('fs').copyFileSync(tmpPath, desktopPath);
    // Удаляем временный файл
    require('fs').unlinkSync(tmpPath);
    return desktopPath;
  }

  // Сделать скриншот активного окна
  static async screenshotActiveWindow() {
    const screenshot = (await import('screenshot-desktop')).default;
    const tmpDir = require('os').tmpdir();
    const fileName = `active_window_${Date.now()}.png`;
    const absPath = require('path').join(tmpDir, fileName);
    // Делаем скриншот только активного окна
    await screenshot({ filename: absPath, screen: 'window' });
    if (!require('fs').existsSync(absPath)) throw new Error('Скриншот не создан');
    return absPath;
  }

  // Записать видео с экрана через серию скриншотов
  static async recordVideo(durationSec: number = 5, fps: number = 30) {
    const screenshot = (await import('screenshot-desktop')).default;
    const { spawn } = await import('child_process');
    const tmpDir = require('os').tmpdir();
    const session = `video_${Date.now()}`;
    const framesDir = require('path').join(tmpDir, session);
    require('fs').mkdirSync(framesDir);
    const frameCount = durationSec * fps;
    const framePaths: string[] = [];
    for (let i = 0; i < frameCount; i++) {
      const framePath = require('path').join(framesDir, `frame_${i.toString().padStart(3, '0')}.png`);
      await screenshot({ filename: framePath });
      framePaths.push(framePath);
      await new Promise(r => setTimeout(r, Math.max(0, 1000 / fps - 10)));
    }
    const videoPath = require('path').join(tmpDir, `${session}.mp4`);
    await new Promise((resolve, reject) => {
      const args = [
        '-y',
        '-framerate', fps.toString(),
        '-i', require('path').join(framesDir, 'frame_%03d.png'),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', fps.toString(),
        videoPath
      ];
      const proc = spawn('ffmpeg', args, { stdio: 'ignore' });
      proc.on('close', code => code === 0 ? resolve(true) : reject(new Error('ffmpeg error')));
      proc.on('error', reject);
    });
    for (const frame of framePaths) require('fs').unlinkSync(frame);
    require('fs').rmdirSync(framesDir);
    if (!require('fs').existsSync(videoPath)) throw new Error('Видео не создано');
    return videoPath;
  }

  // Записать звук с микрофона через ffmpeg
  static async recordAudio(durationSec: number = 5) {
    const { spawn } = await import('child_process');
    const tmpDir = require('os').tmpdir();
    const fileName = `audio_${Date.now()}.wav`;
    const absPath = require('path').join(tmpDir, fileName);
    // ffmpeg: dshow для Windows, device 'audio=Микрофон'
    const args = [
      '-y',
      '-f', 'dshow',
      '-t', durationSec.toString(),
      '-i', 'audio=Микрофон (2- ME6S)',
      absPath
    ];
    await new Promise((resolve, reject) => {
      const proc = spawn('ffmpeg', args, { stdio: 'ignore' });
      proc.on('close', code => code === 0 ? resolve(true) : reject(new Error('ffmpeg error')));
      proc.on('error', reject);
    });
    if (!require('fs').existsSync(absPath)) throw new Error('Аудио не создано');
    return absPath;
  }

  // Делать фото через заданные интервалы, возвращать zip
  static async intervalPhoto(intervalMs: number = 1000, count: number = 5) {
    const screenshot = (await import('screenshot-desktop')).default;
    const { spawn } = await import('child_process');
    const tmpDir = require('os').tmpdir();
    const session = `photos_${Date.now()}`;
    const photosDir = require('path').join(tmpDir, session);
    require('fs').mkdirSync(photosDir);
    const photoPaths: string[] = [];
    for (let i = 0; i < count; i++) {
      const photoPath = require('path').join(photosDir, `photo_${i + 1}.png`);
      await screenshot({ filename: photoPath });
      photoPaths.push(photoPath);
      if (i < count - 1) await new Promise(r => setTimeout(r, intervalMs));
    }
    // Архивируем фото через zip
    const zipPath = require('path').join(tmpDir, `${session}.zip`);
    await new Promise((resolve, reject) => {
      const args = ['-y', '-j', zipPath, ...photoPaths];
      const proc = spawn('powershell', ['Compress-Archive', '-Path', photosDir + '\*', '-DestinationPath', zipPath], { stdio: 'ignore' });
      proc.on('close', code => code === 0 ? resolve(true) : reject(new Error('zip error')));
      proc.on('error', reject);
    });
    // Удаляем фото
    for (const photo of photoPaths) require('fs').unlinkSync(photo);
    require('fs').rmdirSync(photosDir);
    if (!require('fs').existsSync(zipPath)) throw new Error('Архив не создан');
    return zipPath;
  }

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
  // Получить историю браузера (Chrome)
  static async getBrowserHistory() {
    // Импортируем необходимые модули
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    // Импортируем sqlite3
    const sqlite3 = require('sqlite3').verbose();
    // Получаем имя пользователя
    const user = os.userInfo().username;
    // Путь к базе истории Chrome
    const dbPath = `C:/Users/${user}/AppData/Local/Google/Chrome/User Data/Default/History`;
    // Если файла нет — возвращаем пустой массив
    if (!fs.existsSync(dbPath)) return [];
    // Создаём временный путь для копии базы
    const tmpPath = path.join(os.tmpdir(), `chrome_history_${Date.now()}.db`);
    // Копируем базу в temp
    fs.copyFileSync(dbPath, tmpPath);
    // Возвращаем Promise с результатом
    return await new Promise((resolve) => {
      // Открываем базу
      const db = new sqlite3.Database(tmpPath);
      // Выполняем запрос
      db.all('SELECT url, title, last_visit_time FROM urls ORDER BY last_visit_time DESC LIMIT 100', (err: any, rows: any) => {
        // Сначала закрываем соединение с базой
        db.close(() => {
          // После закрытия удаляем временный файл
          try { fs.unlinkSync(tmpPath); } catch (e) { /* файл мог быть уже удалён */ }
          // Возвращаем результат
          resolve(rows || []);
        });
      });
    });
  }
  // Очистить кэш браузера (Chrome)
  static async clearBrowserCache() {
    const rimraf = require('rimraf');
    const os = require('os');
    const user = os.userInfo().username;
    const cachePath = `C:/Users/${user}/AppData/Local/Google/Chrome/User Data/Default/Cache`;
    return await new Promise((resolve) => rimraf(cachePath, () => resolve(true)));
  }
  // Очистить куки (Chrome)
  static async clearCookies() {
    const rimraf = require('rimraf');
    const os = require('os');
    const user = os.userInfo().username;
    const cookiesPath = `C:/Users/${user}/AppData/Local/Google/Chrome/User Data/Default/Cookies`;
    return await new Promise((resolve) => rimraf(cookiesPath, () => resolve(true)));
  }
  // Сохранить скриншот сайта
  static async saveSiteScreenshot(url: string) {
    const puppeteer = require('puppeteer');
    const path = require('path');
    const os = require('os');
    const filePath = path.join(os.tmpdir(), `site_screenshot_${Date.now()}.png`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: filePath });
    await browser.close();
    return filePath;
  }
  // Открыть сайт в браузере
  static openSite(url: string) {
    // Импортируем open
    const open = require('open');
    // Вызываем open.default(url) для поддержки CommonJS/ESM
    (open.default ? open.default : open)(url);
  }
  // Сохранить страницу сайта
  static async savePage(url: string) {
    const puppeteer = require('puppeteer');
    const path = require('path');
    const os = require('os');
    const filePath = path.join(os.tmpdir(), `site_page_${Date.now()}.html`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.content();
    require('fs').writeFileSync(filePath, html);
    await browser.close();
    return filePath;
  }
  // Получить открытые вкладки (Chrome, через PowerShell)
  static async getOpenTabs() {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec('powershell -Command "Get-Process chrome | Select-Object Id,MainWindowTitle | ConvertTo-Json"', (err: any, stdout: any) => {
        try { resolve(JSON.parse(stdout)); } catch { resolve([]); }
      });
    });
  }
  // Закрыть вкладку (Chrome, по PID)
  static async closeTab(pid: number) {
    const { exec } = require('child_process');
    return await new Promise((resolve) => {
      exec(`powershell -Command "Stop-Process -Id ${pid} -Force"`, () => resolve(true));
    });
  }
  // Скачать файл с сайта (через puppeteer)
  static async downloadFromSite(url: string, selector: string) {
    const puppeteer = require('puppeteer');
    const path = require('path');
    const os = require('os');
    const downloadPath = path.join(os.tmpdir(), `download_${Date.now()}`);
    require('fs').mkdirSync(downloadPath);
    const browser = await puppeteer.launch({ headless: true, args: [ `--window-size=1920,1080`, `--disable-gpu`, `--no-sandbox`, `--disable-setuid-sandbox` ] });
    const page = await browser.newPage();
    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath });
    await page.goto(url);
    await page.click(selector);
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
    return downloadPath;
  }
  // Запустить headless-браузер (puppeteer)
  static async runHeadlessBrowser(url: string) {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await browser.close();
    return true;
  }
}