import { Router, Request, Response } from 'express';
import { MonitorService } from '../services/MonitorService';

const router = Router();

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
  res.json({ usage: await MonitorService.getCpuUsage() });
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
  res.json({ usage: MonitorService.getRamUsage() });
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
  res.json(await MonitorService.getDiskUsage());
});

export default router; 