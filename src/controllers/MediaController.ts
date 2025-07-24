import { Router, Request, Response } from 'express';
import { MediaService } from '../services/MediaService';

const router = Router();
const { randomUUID } = require('crypto');
const activeStreams: Record<string, boolean> = {};

/**
 * @openapi
 * /api/media/screenshot:
 *   get:
 *     summary: Сделать скриншот экрана и сразу скачать
 *     tags:
 *       - Media
 *     responses:
 *       200:
 *         description: Скриншот скачан
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/media/screenshot', async (req, res) => {
  try {
    const absPath = await MediaService.screenshot();
    res.download(absPath, 'screenshot.png', err => {
      // После отправки файла — удаляем файл с Desktop
      if (!err && require('fs').existsSync(absPath)) require('fs').unlink(absPath, () => {});
    });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка создания скриншота' });
  }
});

/**
 * @openapi
 * /api/media/record-video:
 *   get:
 *     summary: Записать видео с экрана и скачать
 *     tags:
 *       - Media
 *     parameters:
 *       - in: query
 *         name: duration
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Видео скачано
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/media/record-video', async (req, res) => {
  try {
    // Получаем длительность и fps из query
    const duration = parseInt(req.query.duration as string) || 5;
    const fps = parseInt(req.query.fps as string) || 60;
    // Записываем видео через сервис
    const absPath = await MediaService.recordVideo(duration, fps);
    // Отправляем файл на скачивание
    res.download(absPath, 'video.mp4', err => {
      if (!err && require('fs').existsSync(absPath)) require('fs').unlink(absPath, () => {});
    });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка записи видео' });
  }
});

/**
 * @openapi
 * /api/media/record-audio:
 *   get:
 *     summary: Записать звук с микрофона и скачать
 *     tags:
 *       - Media
 *     parameters:
 *       - in: query
 *         name: duration
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Аудио скачано
 *         content:
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/media/record-audio', async (req, res) => {
  try {
    // Получаем длительность из query
    const duration = parseInt(req.query.duration as string) || 5;
    // Записываем аудио через сервис
    const absPath = await MediaService.recordAudio(duration);
    // Отправляем файл на скачивание
    res.download(absPath, 'audio.wav', err => {
      if (!err && require('fs').existsSync(absPath)) require('fs').unlink(absPath, () => {});
    });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка записи аудио' });
  }
});

/**
 * @openapi
 * /api/media/screenshot-active:
 *   get:
 *     summary: Сделать скриншот активного окна
 *     tags:
 *       - Media
 *     responses:
 *       200:
 *         description: Скриншот скачан
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/media/screenshot-active', async (req, res) => {
  try {
    const absPath = await MediaService.screenshotActiveWindow();
    res.download(absPath, 'active_window.png', err => {
      if (!err && require('fs').existsSync(absPath)) require('fs').unlink(absPath, () => {});
    });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка создания скриншота' });
  }
});

/**
 * @openapi
 * /api/media/interval-photo:
 *   get:
 *     summary: Делать фото через интервалы и скачать архив
 *     tags:
 *       - Media
 *     parameters:
 *       - in: query
 *         name: interval
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1000
 *       - in: query
 *         name: count
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Архив с фото
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/media/interval-photo', async (req, res) => {
  try {
    const interval = parseInt(req.query.interval as string) || 1000;
    const count = parseInt(req.query.count as string) || 5;
    const zipPath = await MediaService.intervalPhoto(interval, count);
    res.download(zipPath, 'photos.zip', err => {
      if (!err && require('fs').existsSync(zipPath)) require('fs').unlink(zipPath, () => {});
    });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка создания фото' });
  }
});

/**
 * @openapi
 * /api/power/shutdown:
 *   post:
 *     summary: Выключение компьютера
 *     tags: [Power]
 *     responses: { 200: { description: OK } }
 */
router.post('/power/shutdown', (req, res) => {
  MediaService.shutdown();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/power/reboot:
 *   post:
 *     summary: Перезагрузка компьютера
 *     tags: [Power]
 *     responses: { 200: { description: OK } }
 */
router.post('/power/reboot', (req, res) => {
  MediaService.reboot();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/power/sleep:
 *   post:
 *     summary: Сон
 *     tags: [Power]
 *     responses: { 200: { description: OK } }
 */
router.post('/power/sleep', (req, res) => {
  MediaService.sleep();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/power/lock:
 *   post:
 *     summary: Блокировка экрана
 *     tags: [Power]
 *     responses: { 200: { description: OK } }
 */
router.post('/power/lock', (req, res) => {
  MediaService.lock();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/power/logout:
 *   post:
 *     summary: Завершение сеанса
 *     tags: [Power]
 *     responses: { 200: { description: OK } }
 */
router.post('/power/logout', (req, res) => {
  MediaService.logout();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/power/current-user:
 *   get:
 *     summary: Получить текущего пользователя
 *     tags: [Power]
 *     responses:
 *       200:
 *         description: Имя пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { type: string }
 */
router.get('/power/current-user', (req, res) => {
  res.json({ user: MediaService.getCurrentUser() });
});

/**
 * @openapi
 * /api/power/switch-user:
 *   post:
 *     summary: Смена пользователя
 *     tags: [Power]
 *     responses: { 200: { description: OK } }
 */
router.post('/power/switch-user', (req, res) => {
  MediaService.switchUser();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/processes/list:
 *   get:
 *     summary: Получить список процессов
 *     tags: [Processes]
 *     responses:
 *       200:
 *         description: Список процессов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/processes/list', async (req, res) => {
  res.json(await MediaService.listProcesses());
});

/**
 * @openapi
 * /api/processes/kill:
 *   post:
 *     summary: Завершить процесс по PID
 *     tags: [Processes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pid: { type: integer }
 *     responses: { 200: { description: OK } }
 */
router.post('/processes/kill', async (req, res) => {
  await MediaService.killProcess(req.body.pid);
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/processes/pid:
 *   get:
 *     summary: Получить PID процесса по имени
 *     tags: [Processes]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PID процесса
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pid: { type: integer }
 */
router.get('/processes/pid', async (req, res) => {
  const pid = await MediaService.getPid(req.query.name as string);
  res.json({ pid });
});

/**
 * @openapi
 * /api/processes/start:
 *   post:
 *     summary: Запустить процесс
 *     tags: [Processes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path: { type: string }
 *     responses: { 200: { description: OK } }
 */
router.post('/processes/start', async (req, res) => {
  await MediaService.startProcess(req.body.path);
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/monitor/cpu:
 *   get:
 *     summary: Получить загрузку CPU
 *     tags: [Monitor]
 *     responses:
 *       200:
 *         description: Загрузка CPU
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usage: { type: number }
 */
router.get('/monitor/cpu', async (req, res) => {
  res.json({ usage: await MediaService.getCpuUsage() });
});

/**
 * @openapi
 * /api/monitor/ram:
 *   get:
 *     summary: Получить загрузку ОЗУ
 *     tags: [Monitor]
 *     responses:
 *       200:
 *         description: Загрузка ОЗУ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usage: { type: number }
 */
router.get('/monitor/ram', (req, res) => {
  res.json({ usage: MediaService.getRamUsage() });
});

/**
 * @openapi
 * /api/monitor/disk:
 *   get:
 *     summary: Получить использование диска
 *     tags: [Monitor]
 *     responses:
 *       200:
 *         description: Использование диска
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/monitor/disk', async (req, res) => {
  res.json(await MediaService.getDiskUsage());
});

/**
 * @openapi
 * /api/logs/system:
 *   get:
 *     summary: Получить системный лог
 *     tags: [Logs]
 *     responses: { 200: { description: OK } }
 */
router.get('/logs/system', async (req, res) => {
  res.json(await MediaService.getSystemLog());
});

/**
 * @openapi
 * /api/logs/network:
 *   get:
 *     summary: Получить сетевой лог
 *     tags: [Logs]
 *     responses: { 200: { description: OK } }
 */
router.get('/logs/network', async (req, res) => {
  res.json(await MediaService.getNetworkLog());
});

/**
 * @openapi
 * /api/logs/events:
 *   get:
 *     summary: Получить лог событий Windows
 *     tags: [Logs]
 *     responses: { 200: { description: OK } }
 */
router.get('/logs/events', async (req, res) => {
  res.json(await MediaService.getEventLog());
});

/**
 * @openapi
 * /api/logs/errors:
 *   get:
 *     summary: Получить лог ошибок
 *     tags: [Logs]
 *     responses: { 200: { description: OK } }
 */
router.get('/logs/errors', async (req, res) => {
  res.json(await MediaService.getErrorLog());
});

/**
 * @openapi
 * /api/logs/login:
 *   get:
 *     summary: Получить лог входов/выходов
 *     tags: [Logs]
 *     responses: { 200: { description: OK } }
 */
router.get('/logs/login', async (req, res) => {
  res.json(await MediaService.getLoginLog());
});

/**
 * @openapi
 * /api/logs/file-open:
 *   get:
 *     summary: Получить лог открытия файлов
 *     tags: [Logs]
 *     responses: { 200: { description: OK } }
 */
router.get('/logs/file-open', async (req, res) => {
  res.json(await MediaService.getFileOpenLog());
});

/**
 * @openapi
 * /api/system/version:
 *   get:
 *     summary: Получить версию ОС
 *     tags: [System]
 *     responses: { 200: { description: OK } }
 */
router.get('/system/version', (req, res) => {
  res.json({ version: MediaService.getOsVersion() });
});

/**
 * @openapi
 * /api/system/arch:
 *   get:
 *     summary: Получить архитектуру системы
 *     tags: [System]
 *     responses: { 200: { description: OK } }
 */
router.get('/system/arch', (req, res) => {
  res.json({ arch: MediaService.getArch() });
});

/**
 * @openapi
 * /api/system/clear-temp:
 *   post:
 *     summary: Очистить временные файлы
 *     tags: [System]
 *     responses: { 200: { description: OK } }
 */
router.post('/system/clear-temp', async (req, res) => {
  await MediaService.clearTemp();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/system/clear-recycle:
 *   post:
 *     summary: Очистить корзину
 *     tags: [System]
 *     responses: { 200: { description: OK } }
 */
router.post('/system/clear-recycle', async (req, res) => {
  await MediaService.clearRecycleBin();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/browser/history:
 *   get:
 *     summary: Получить историю браузера (Chrome)
 *     tags: [Browser]
 *     responses: { 200: { description: OK } }
 */
router.get('/browser/history', async (req, res) => {
  res.json(await MediaService.getBrowserHistory());
});

/**
 * @openapi
 * /api/browser/clear-cache:
 *   post:
 *     summary: Очистить кэш браузера (Chrome)
 *     tags: [Browser]
 *     responses: { 200: { description: OK } }
 */
router.post('/browser/clear-cache', async (req, res) => {
  await MediaService.clearBrowserCache();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/browser/clear-cookies:
 *   post:
 *     summary: Очистить куки (Chrome)
 *     tags: [Browser]
 *     responses: { 200: { description: OK } }
 */
router.post('/browser/clear-cookies', async (req, res) => {
  await MediaService.clearCookies();
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/browser/site-screenshot:
 *   post:
 *     summary: Сохранить скриншот сайта
 *     tags: [Browser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url: { type: string }
 *     responses: { 200: { description: OK } }
 */
router.post('/browser/site-screenshot', async (req, res) => {
  const filePath = await MediaService.saveSiteScreenshot(req.body.url);
  res.json({ file: filePath });
});

/**
 * @openapi
 * /api/browser/open-site:
 *   post:
 *     summary: Открыть сайт в браузере
 *     tags: [Browser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url: { type: string }
 *     responses: { 200: { description: OK } }
 */
router.post('/browser/open-site', (req, res) => {
  MediaService.openSite(req.body.url);
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/browser/save-page:
 *   post:
 *     summary: Сохранить страницу сайта
 *     tags: [Browser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url: { type: string }
 *     responses: { 200: { description: OK } }
 */
router.post('/browser/save-page', async (req, res) => {
  const filePath = await MediaService.savePage(req.body.url);
  res.json({ file: filePath });
});

/**
 * @openapi
 * /api/browser/open-tabs:
 *   get:
 *     summary: Получить открытые вкладки (Chrome)
 *     tags: [Browser]
 *     responses: { 200: { description: OK } }
 */
router.get('/browser/open-tabs', async (req, res) => {
  res.json(await MediaService.getOpenTabs());
});

/**
 * @openapi
 * /api/browser/close-tab:
 *   post:
 *     summary: Закрыть вкладку (по PID)
 *     tags: [Browser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pid: { type: integer }
 *     responses: { 200: { description: OK } }
 */
router.post('/browser/close-tab', async (req, res) => {
  await MediaService.closeTab(req.body.pid);
  res.json({ ok: true });
});

/**
 * @openapi
 * /api/browser/download:
 *   post:
 *     summary: Скачать файл с сайта (puppeteer)
 *     tags: [Browser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url: { type: string }
 *               selector: { type: string }
 *     responses: { 200: { description: OK } }
 */
router.post('/browser/download', async (req, res) => {
  const downloadPath = await MediaService.downloadFromSite(req.body.url, req.body.selector);
  res.json({ path: downloadPath });
});

/**
 * @openapi
 * /api/browser/headless:
 *   post:
 *     summary: Запустить headless-браузер (puppeteer)
 *     tags: [Browser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url: { type: string }
 *     responses: { 200: { description: OK } }
 */
router.post('/browser/headless', async (req, res) => {
  await MediaService.runHeadlessBrowser(req.body.url);
  res.json({ ok: true });
});

export default router; 