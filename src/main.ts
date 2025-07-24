import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import { AppDataSource } from './config/ormconfig';
import userRouter from './controllers/UserController';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import filesRouter from './controllers/FilesController';
import mediaRouter from './controllers/MediaController';

// Загружаем переменные окружения
dotenv.config();

// Создаем экземпляр express
const app = express();
// Включаем парсинг JSON
app.use(express.json());

// Подключаем роутер пользователей к express
app.use('/api', userRouter);
app.use('/api', filesRouter);
app.use('/api', mediaRouter);

// Подключаем Swagger UI по маршруту /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Подключаемся к базе данных через AppDataSource
AppDataSource.initialize().then(() => {
  // Запускаем сервер после успешного подключения к БД
  app.listen(process.env.PORT || 3000, () => {
    // Логируем успешный запуск
    console.log('Server started');
  });
// Обработка ошибок подключения к БД
}).catch((error) => console.error(error)); 