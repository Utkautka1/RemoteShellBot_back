import { Router, Request, Response } from 'express';
import { BrowserService } from '../services/BrowserService';

const router = Router();

/**
 * @openapi
 * /api/browser/history:
 *   get:
 *     summary: Получить историю браузера (Chrome)
 *     tags: [Browser]
 *     responses: { 200: { description: OK } }
 */
router.get('/browser/history', async (req, res) => {
  res.json(await BrowserService.getBrowserHistory());
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
  await BrowserService.clearBrowserCache();
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
  await BrowserService.clearCookies();
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
  const filePath = await BrowserService.saveSiteScreenshot(req.body.url);
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
  BrowserService.openSite(req.body.url);
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
  const filePath = await BrowserService.savePage(req.body.url);
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
  res.json(await BrowserService.getOpenTabs());
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
  await BrowserService.closeTab(req.body.pid);
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
  const downloadPath = await BrowserService.downloadFromSite(req.body.url, req.body.selector);
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
  await BrowserService.runHeadlessBrowser(req.body.url);
  res.json({ ok: true });
});

export default router; 