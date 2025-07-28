import { Router, Request, Response } from 'express';
import { SystemService } from '../services/SystemService';

const router = Router();

/**
 * @openapi
 * /api/system/version:
 *   get:
 *     summary: Получить версию ОС
 *     tags: [System]
 *     responses: { 200: { description: OK } }
 */
router.get('/system/version', (req, res) => {
  res.json({ version: SystemService.getOsVersion() });
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
  res.json({ arch: SystemService.getArch() });
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
  await SystemService.clearTemp();
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
  await SystemService.clearRecycleBin();
  res.json({ ok: true });
});

export default router; 