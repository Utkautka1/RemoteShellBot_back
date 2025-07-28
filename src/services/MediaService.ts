import path from 'path';
import fs from 'fs';

// @ts-ignore
// eslint-disable-next-line
declare module 'screenshot-desktop';

// Сервис для работы с медиа
export class MediaService {
  // Сделать скриншот экрана
  static async screenshot() {
    const screenshot = (await import('screenshot-desktop')).default;
    const tmpDir = require('os').tmpdir();
    const desktopDir = 'C:/Users/strig/Desktop';
    const fileName = `screenshot_${Date.now()}.png`;
    const tmpPath = require('path').join(tmpDir, fileName);
    const desktopPath = require('path').join(desktopDir, fileName);
    await screenshot({ filename: tmpPath });
    if (!require('fs').existsSync(tmpPath)) throw new Error('Скриншот не создан');
    // Копируем на Desktop
    require('fs').copyFileSync(tmpPath, desktopPath);
    // Удаляем временный файл
    require('fs').unlinkSync(tmpPath);
    return desktopPath;
  }

  // Сделать скриншот активного окна
  static async screenshotActiveWindow() {
    const screenshot = (await import('screenshot-desktop')).default;
    const tmpDir = require('os').tmpdir();
    const fileName = `active_window_${Date.now()}.png`;
    const absPath = require('path').join(tmpDir, fileName);
    // Делаем скриншот только активного окна
    await screenshot({ filename: absPath, screen: 'window' });
    if (!require('fs').existsSync(absPath)) throw new Error('Скриншот не создан');
    return absPath;
  }

  // Записать видео с экрана через серию скриншотов
  static async recordVideo(durationSec: number = 5, fps: number = 30) {
    const screenshot = (await import('screenshot-desktop')).default;
    const { spawn } = await import('child_process');
    const tmpDir = require('os').tmpdir();
    const session = `video_${Date.now()}`;
    const framesDir = require('path').join(tmpDir, session);
    require('fs').mkdirSync(framesDir);
    const frameCount = durationSec * fps;
    const framePaths: string[] = [];
    for (let i = 0; i < frameCount; i++) {
      const framePath = require('path').join(framesDir, `frame_${i.toString().padStart(3, '0')}.png`);
      await screenshot({ filename: framePath });
      framePaths.push(framePath);
      await new Promise(r => setTimeout(r, Math.max(0, 1000 / fps - 10)));
    }
    const videoPath = require('path').join(tmpDir, `${session}.mp4`);
    await new Promise((resolve, reject) => {
      const args = [
        '-y',
        '-framerate', fps.toString(),
        '-i', require('path').join(framesDir, 'frame_%03d.png'),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', fps.toString(),
        videoPath
      ];
      const proc = spawn('ffmpeg', args, { stdio: 'ignore' });
      proc.on('close', code => code === 0 ? resolve(true) : reject(new Error('ffmpeg error')));
      proc.on('error', reject);
    });
    for (const frame of framePaths) require('fs').unlinkSync(frame);
    require('fs').rmdirSync(framesDir);
    if (!require('fs').existsSync(videoPath)) throw new Error('Видео не создано');
    return videoPath;
  }

  // Записать звук с микрофона через ffmpeg
  static async recordAudio(durationSec: number = 5) {
    const { spawn } = await import('child_process');
    const tmpDir = require('os').tmpdir();
    const fileName = `audio_${Date.now()}.wav`;
    const absPath = require('path').join(tmpDir, fileName);
    // ffmpeg: dshow для Windows, device 'audio=Микрофон'
    const args = [
      '-y',
      '-f', 'dshow',
      '-t', durationSec.toString(),
      '-i', 'audio=Микрофон (2- ME6S)',
      absPath
    ];
    await new Promise((resolve, reject) => {
      const proc = spawn('ffmpeg', args, { stdio: 'ignore' });
      proc.on('close', code => code === 0 ? resolve(true) : reject(new Error('ffmpeg error')));
      proc.on('error', reject);
    });
    if (!require('fs').existsSync(absPath)) throw new Error('Аудио не создано');
    return absPath;
  }

  // Делать фото через заданные интервалы, возвращать zip
  static async intervalPhoto(intervalMs: number = 1000, count: number = 5) {
    const screenshot = (await import('screenshot-desktop')).default;
    const { spawn } = await import('child_process');
    const tmpDir = require('os').tmpdir();
    const session = `photos_${Date.now()}`;
    const photosDir = require('path').join(tmpDir, session);
    require('fs').mkdirSync(photosDir);
    const photoPaths: string[] = [];
    for (let i = 0; i < count; i++) {
      const photoPath = require('path').join(photosDir, `photo_${i + 1}.png`);
      await screenshot({ filename: photoPath });
      photoPaths.push(photoPath);
      if (i < count - 1) await new Promise(r => setTimeout(r, intervalMs));
    }
    // Архивируем фото через zip
    const zipPath = require('path').join(tmpDir, `${session}.zip`);
    await new Promise((resolve, reject) => {
      const args = ['-y', '-j', zipPath, ...photoPaths];
      const proc = spawn('powershell', ['Compress-Archive', '-Path', photosDir + '\*', '-DestinationPath', zipPath], { stdio: 'ignore' });
      proc.on('close', code => code === 0 ? resolve(true) : reject(new Error('zip error')));
      proc.on('error', reject);
    });
    // Удаляем фото
    for (const photo of photoPaths) require('fs').unlinkSync(photo);
    require('fs').rmdirSync(photosDir);
    if (!require('fs').existsSync(zipPath)) throw new Error('Архив не создан');
    return zipPath;
  }
}