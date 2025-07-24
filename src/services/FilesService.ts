import fs from 'fs';
import path from 'path';

// Сервис для работы с файлами
export class FilesService {
  // Получить список файлов в директории
  static async listFiles(dirPath: string) {
    // Проверяем, что путь абсолютный
    const absPath = path.isAbsolute(dirPath) ? dirPath : path.resolve(dirPath);
    // Читаем содержимое директории
    return fs.promises.readdir(absPath);
  }

  // Получить абсолютный путь к файлу для скачивания
  static async downloadFile(filePath: string) {
    // Проверяем, что путь абсолютный
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    // Проверяем, существует ли файл
    await fs.promises.access(absPath, fs.constants.F_OK);
    // Возвращаем абсолютный путь
    return absPath;
  }

  // Удалить файл по абсолютному пути
  static async deleteFile(filePath: string) {
    // Проверяем, что путь абсолютный
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    // Удаляем файл
    await fs.promises.unlink(absPath);
  }

  // Переименовать файл
  static async renameFile(oldPath: string, newPath: string) {
    // Получаем абсолютные пути
    const absOldPath = path.isAbsolute(oldPath) ? oldPath : path.resolve(oldPath);
    const absNewPath = path.isAbsolute(newPath) ? newPath : path.resolve(newPath);
    // Переименовываем файл
    await fs.promises.rename(absOldPath, absNewPath);
  }

  // Переместить файл
  static async moveFile(srcPath: string, destPath: string) {
    // Получаем абсолютные пути
    const absSrcPath = path.isAbsolute(srcPath) ? srcPath : path.resolve(srcPath);
    const absDestPath = path.isAbsolute(destPath) ? destPath : path.resolve(destPath);
    // Перемещаем файл
    await fs.promises.rename(absSrcPath, absDestPath);
  }

  // Копировать файл
  static async copyFile(srcPath: string, destPath: string) {
    // Получаем абсолютные пути
    const absSrcPath = path.isAbsolute(srcPath) ? srcPath : path.resolve(srcPath);
    const absDestPath = path.isAbsolute(destPath) ? destPath : path.resolve(destPath);
    // Копируем файл
    await fs.promises.copyFile(absSrcPath, absDestPath);
  }

  // Создать новый файл
  static async createFile(filePath: string, content: string = '') {
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    // Создаём файл с содержимым
    await fs.promises.writeFile(absPath, content, { flag: 'wx' });
  }

  // Изменить содержимое файла
  static async updateFile(filePath: string, content: string) {
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    // Перезаписываем содержимое файла
    await fs.promises.writeFile(absPath, content, { flag: 'w' });
  }

  // Найти файлы по маске
  static async searchFiles(dirPath: string, mask: string) {
    // Импортируем glob только здесь, чтобы не тянуть в основной бандл
    const glob = (await import('glob')).glob;
    // Получаем абсолютный путь
    const absDir = path.isAbsolute(dirPath) ? dirPath : path.resolve(dirPath);
    // Формируем паттерн
    const pattern = path.join(absDir, mask);
    // Ищем файлы по маске
    return glob(pattern, { nodir: true });
  }

  // Получить размер файла
  static async getFileSize(filePath: string) {
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    // Получаем статистику файла
    const stats = await fs.promises.stat(absPath);
    // Возвращаем размер файла в байтах
    return stats.size;
  }

  // Получить список скрытых файлов в директории
  static async getHiddenFiles(dirPath: string) {
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(dirPath) ? dirPath : path.resolve(dirPath);
    // Получаем список файлов
    const files = await fs.promises.readdir(absPath, { withFileTypes: true });
    // Фильтруем скрытые файлы (начинаются с .)
    return files.filter(f => f.name.startsWith('.') && f.isFile()).map(f => f.name);
  }

  // Получить права доступа к файлу
  static async getFilePermissions(filePath: string) {
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    // Получаем статистику файла
    const stats = await fs.promises.stat(absPath);
    // Возвращаем права доступа (восьмеричный вид)
    return (stats.mode & 0o777).toString(8);
  }

  // Изменить права доступа к файлу
  static async setFilePermissions(filePath: string, mode: string) {
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    // Преобразуем строку в восьмеричное число
    const octalMode = parseInt(mode, 8);
    // Меняем права доступа
    await fs.promises.chmod(absPath, octalMode);
  }

  // Получить дату создания и изменения файла
  static async getFileDates(filePath: string) {
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    // Получаем статистику файла
    const stats = await fs.promises.stat(absPath);
    // Возвращаем даты
    return {
      created: stats.birthtime,
      modified: stats.mtime
    };
  }

  // Удалить папку рекурсивно
  static async removeFolder(dirPath: string) {
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(dirPath) ? dirPath : path.resolve(dirPath);
    // Удаляем папку рекурсивно
    await fs.promises.rm(absPath, { recursive: true, force: true });
  }

  // Создать новую папку
  static async createFolder(dirPath: string) {
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(dirPath) ? dirPath : path.resolve(dirPath);
    // Создаём папку
    await fs.promises.mkdir(absPath, { recursive: true });
  }

  // Открыть папку в проводнике (Windows)
  static async openFolder(dirPath: string) {
    // Импортируем child_process только здесь
    const { exec } = await import('child_process');
    // Получаем абсолютный путь
    const absPath = path.isAbsolute(dirPath) ? dirPath : path.resolve(dirPath);
    // Логируем путь и существование папки
    // eslint-disable-next-line no-console
    // Открываем папку через cmd/start
    exec(`cmd /c start "" "${absPath}"`);
  }
}

// @ts-ignore
// eslint-disable-next-line
declare module 'archiver';
// @ts-ignore
// eslint-disable-next-line
declare module 'unzipper'; 