import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import dotenv from 'dotenv';

dotenv.config();

// Экспортируем DataSource для подключения к БД
export const AppDataSource = new DataSource({
  type: 'postgres', // Тип БД
  host: process.env.DB_HOST, // Хост
  port: Number(process.env.DB_PORT), // Порт
  username: process.env.DB_USERNAME, // Имя пользователя
  password: process.env.DB_PASSWORD, // Пароль
  database: process.env.DB_DATABASE, // Имя БД
  entities: [User], // Сущности
  synchronize: true, // Синхронизация схемы (только для dev)
}); 