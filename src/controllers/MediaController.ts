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

export default router; 