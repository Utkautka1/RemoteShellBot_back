import { Router, Request, Response } from 'express';
import { ProcessService } from '../services/ProcessService';

const router = Router();

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
  res.json(await ProcessService.listProcesses());
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
  await ProcessService.killProcess(req.body.pid);
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
  const pid = await ProcessService.getPid(req.query.name as string);
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
  await ProcessService.startProcess(req.body.path);
  res.json({ ok: true });
});

export default router; 