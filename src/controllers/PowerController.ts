import { Router, Request, Response } from 'express';
import { PowerService } from '../services/PowerService';

const router = Router();

/**
 * @openapi
 * /api/power/shutdown:
 *   post:
 *     summary: Выключение компьютера
 *     tags: [Power]
 *     responses: { 200: { description: OK } }
 */
router.post('/power/shutdown', (req, res) => {
  PowerService.shutdown();
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
  PowerService.reboot();
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
  PowerService.sleep();
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
  PowerService.lock();
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
  PowerService.logout();
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
  res.json({ user: PowerService.getCurrentUser() });
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
  PowerService.switchUser();
  res.json({ ok: true });
});

export default router; 