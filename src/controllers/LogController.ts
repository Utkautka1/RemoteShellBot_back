import { Router, Request, Response } from 'express';
import { LogService } from '../services/LogService';

const router = Router();

/**
 * @openapi
 * /api/logs/system:
 *   get:
 *     summary: Получить системный лог
 *     tags: [Logs]
 *     responses: { 200: { description: OK } }
 */
router.get('/logs/system', async (req, res) => {
  res.json(await LogService.getSystemLog());
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
  res.json(await LogService.getNetworkLog());
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
  res.json(await LogService.getEventLog());
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
  res.json(await LogService.getErrorLog());
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
  res.json(await LogService.getLoginLog());
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
  res.json(await LogService.getFileOpenLog());
});

export default router; 