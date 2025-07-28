// Сервис для работы с браузером
export class BrowserService {
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