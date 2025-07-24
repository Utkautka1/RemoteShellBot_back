import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';

// Создаем роутер express
const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Получить всех пользователей
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Список пользователей
 *   post:
 *     summary: Создать пользователя
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               telegramId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *     responses:
 *       201:
 *         description: Пользователь создан
 */
// Получить всех пользователей
router.get('/users', async (req: Request, res: Response) => {
  // Получаем всех пользователей через сервис
  const users = await UserService.getAllUsers();
  // Отправляем ответ
  res.json(users);
});

// Создать нового пользователя
router.post('/users', async (req: Request, res: Response) => {
  // Получаем данные из тела запроса
  const data = req.body;
  // Создаем пользователя через сервис
  const user = await UserService.createUser(data);
  // Отправляем ответ
  res.status(201).json(user);
});

/**
 * @openapi
 * /api/users/admins:
 *   get:
 *     summary: Получить всех пользователей с ролью admin
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Список админов
 */
router.get('/users/admins', async (req, res) => {
  // Получаем всех пользователей с ролью admin
  const admins = await UserService.getUsersByRole('admin');
  // Отправляем ответ
  res.json(admins);
});

/**
 * @openapi
 * /api/users/{telegramId}/admin:
 *   post:
 *     summary: Назначить роль admin по telegramId
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: telegramId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Роль назначена
 */
router.post('/users/:telegramId/admin', async (req, res) => {
  // Получаем telegramId из параметров
  const { telegramId } = req.params;
  // Назначаем роль admin
  const user = await UserService.setAdminRole(telegramId);
  // Отправляем ответ
  res.json(user);
});

/**
 * @openapi
 * /api/users/{telegramId}:
 *   delete:
 *     summary: Удалить пользователя по telegramId
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: telegramId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь удалён
 */
router.delete('/users/:telegramId', async (req, res) => {
  // Получаем telegramId из параметров
  const { telegramId } = req.params;
  // Удаляем пользователя
  await UserService.deleteByTelegramId(telegramId);
  // Отправляем ответ
  res.json({ message: 'Пользователь удалён' });
});

/**
 * @openapi
 * /api/users/{telegramId}:
 *   patch:
 *     summary: Редактировать пользователя по telegramId
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: telegramId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Пользователь обновлён
 */
router.patch('/users/:telegramId', async (req, res) => {
  // Получаем telegramId из параметров
  const { telegramId } = req.params;
  // Получаем данные для обновления
  const data = req.body;
  // Обновляем пользователя
  const user = await UserService.updateByTelegramId(telegramId, data);
  // Отправляем ответ
  res.json(user);
});

// Экспортируем роутер
export default router; 