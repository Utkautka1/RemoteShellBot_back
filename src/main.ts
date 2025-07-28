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
import powerRouter from './controllers/PowerController';
import processRouter from './controllers/ProcessController';
import monitorRouter from './controllers/MonitorController';
import logRouter from './controllers/LogController';
import systemRouter from './controllers/SystemController';
import browserRouter from './controllers/BrowserController';

// Загружаем переменные окружения
dotenv.config();

// Создаем экземпляр express
const app = express();
// Включаем парсинг JSON
app.use(express.json());

// Подключаем роутеры к express
app.use('/api', userRouter);
app.use('/api', filesRouter);
app.use('/api', mediaRouter);
app.use('/api', powerRouter);
app.use('/api', processRouter);
app.use('/api', monitorRouter);
app.use('/api', logRouter);
app.use('/api', systemRouter);
app.use('/api', browserRouter);

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