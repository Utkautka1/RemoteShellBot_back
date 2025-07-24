import { Router, Request, Response } from 'express';
import { FilesService } from '../services/FilesService';

// Создаём роутер express
const router = Router();

/**
 * @openapi
 * /api/files:
 *   get:
 *     summary: Получить список файлов в директории
 *     tags:
 *       - Files
 *     parameters:
 *       - in: query
 *         name: dir
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список файлов
 */
router.get('/files', async (req: Request, res: Response) => {
  // Получаем путь к директории из query
  const dir = req.query.dir as string;
  // Получаем список файлов через сервис
  const files = await FilesService.listFiles(dir);
  // Отправляем ответ
  res.json(files);
});

/**
 * @openapi
 * /api/files/download:
 *   get:
 *     summary: Скачать файл
 *     tags:
 *       - Files
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Файл скачан
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/files/download', async (req, res) => {
  try {
    // Получаем путь к файлу из query
    const filePath = req.query.path as string;
    // Получаем абсолютный путь через сервис
    const absPath = await FilesService.downloadFile(filePath);
    // Отправляем файл на скачивание с корректным именем
    res.download(absPath, encodeURIComponent(require('path').basename(absPath)));
  } catch (e) {
    res.status(404).json({ error: 'Файл не найден или ошибка доступа' });
  }
});

/**
 * @openapi
 * /api/files:
 *   delete:
 *     summary: Удалить файл
 *     tags:
 *       - Files
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Файл удалён
 */
router.delete('/files', async (req: Request, res: Response) => {
  // Получаем путь к файлу из query
  const filePath = req.query.path as string;
  // Удаляем файл через сервис
  await FilesService.deleteFile(filePath);
  // Отправляем ответ
  res.json({ message: 'Файл удалён' });
});

/**
 * @openapi
 * /api/files/rename:
 *   post:
 *     summary: Переименовать файл
 *     tags:
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPath:
 *                 type: string
 *               newPath:
 *                 type: string
 *     responses:
 *       200:
 *         description: Файл переименован
 */
router.post('/files/rename', async (req: Request, res: Response) => {
  try {
    // Получаем старый и новый путь из тела запроса
    const { oldPath, newPath } = req.body;
    // Переименовываем файл через сервис
    await FilesService.renameFile(oldPath, newPath);
    // Отправляем ответ
    res.json({ message: 'Файл переименован' });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка переименования файла' });
  }
});

/**
 * @openapi
 * /api/files/move:
 *   post:
 *     summary: Переместить файл
 *     tags:
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               srcPath:
 *                 type: string
 *               destPath:
 *                 type: string
 *     responses:
 *       200:
 *         description: Файл перемещён
 */
router.post('/files/move', async (req: Request, res: Response) => {
  try {
    // Получаем исходный и целевой путь из тела запроса
    const { srcPath, destPath } = req.body;
    // Перемещаем файл через сервис
    await FilesService.moveFile(srcPath, destPath);
    // Отправляем ответ
    res.json({ message: 'Файл перемещён' });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка перемещения файла' });
  }
});

/**
 * @openapi
 * /api/files/copy:
 *   post:
 *     summary: Копировать файл
 *     tags:
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               srcPath:
 *                 type: string
 *               destPath:
 *                 type: string
 *     responses:
 *       200:
 *         description: Файл скопирован
 */
router.post('/files/copy', async (req: Request, res: Response) => {
  try {
    // Получаем исходный и целевой путь из тела запроса
    const { srcPath, destPath } = req.body;
    // Копируем файл через сервис
    await FilesService.copyFile(srcPath, destPath);
    // Отправляем ответ
    res.json({ message: 'Файл скопирован' });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка копирования файла' });
  }
});

/**
 * @openapi
 * /api/files:
 *   post:
 *     summary: Создать новый файл
 *     tags:
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Файл создан
 */
router.post('/files', async (req: Request, res: Response) => {
  try {
    // Получаем путь и содержимое из тела запроса
    const { path: filePath, content } = req.body;
    // Создаём файл через сервис
    await FilesService.createFile(filePath, content);
    // Отправляем ответ
    res.status(201).json({ message: 'Файл создан' });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка создания файла' });
  }
});

/**
 * @openapi
 * /api/files:
 *   patch:
 *     summary: Изменить содержимое файла
 *     tags:
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Файл обновлён
 */
router.patch('/files', async (req: Request, res: Response) => {
  try {
    // Получаем путь и новое содержимое из тела запроса
    const { path: filePath, content } = req.body;
    // Обновляем файл через сервис
    await FilesService.updateFile(filePath, content);
    // Отправляем ответ
    res.json({ message: 'Файл обновлён' });
  } catch (e) {
    res.status(400).json({ error: 'Ошибка обновления файла' });
  }
});

/**
 * @openapi
 * /api/folders:
 *   delete:
 *     summary: Удалить папку рекурсивно
 *     tags:
 *       - Folders
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Папка удалена
 */
router.delete('/folders', async (req: Request, res: Response) => {
  // Получаем путь к папке из query
  const dirPath = req.query.path as string;
  // Удаляем папку через сервис
  await FilesService.removeFolder(dirPath);
  // Отправляем ответ
  res.json({ message: 'Папка удалена' });
});

/**
 * @openapi
 * /api/folders:
 *   post:
 *     summary: Создать новую папку
 *     tags:
 *       - Folders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *     responses:
 *       201:
 *         description: Папка создана
 */
router.post('/folders', async (req: Request, res: Response) => {
  // Получаем путь к папке из тела запроса
  const { path: dirPath } = req.body;
  // Создаём папку через сервис
  await FilesService.createFolder(dirPath);
  // Отправляем ответ
  res.status(201).json({ message: 'Папка создана' });
});

/**
 * @openapi
 * /api/folders/open:
 *   post:
 *     summary: Открыть папку в проводнике (Windows)
 *     tags:
 *       - Folders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *     responses:
 *       200:
 *         description: Папка открыта
 */
router.post('/folders/open', async (req: Request, res: Response) => {
  // Получаем путь к папке из тела запроса
  const { path: dirPath } = req.body;
  // Открываем папку через сервис
  await FilesService.openFolder(dirPath);
  // Отправляем ответ
  res.json({ message: 'Папка открыта' });
});

// Экспортируем роутер
export default router; 