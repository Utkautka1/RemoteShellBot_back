import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';

// Сервис для работы с пользователями
export class UserService {
  // Получить всех пользователей
  static async getAllUsers() {
    // Получаем репозиторий User
    const userRepo = AppDataSource.getRepository(User);
    // Возвращаем всех пользователей
    return userRepo.find();
  }

  // Создать нового пользователя
  static async createUser(data: Partial<User>) {
    // Получаем репозиторий User
    const userRepo = AppDataSource.getRepository(User);
    // Создаем нового пользователя
    const user = userRepo.create(data);
    // Сохраняем пользователя в БД
    return userRepo.save(user);
  }

  // Получить всех пользователей по роли
  static async getUsersByRole(role: 'admin' | 'user') {
    // Получаем репозиторий User
    const userRepo = AppDataSource.getRepository(User);
    // Возвращаем пользователей с нужной ролью
    return userRepo.find({ where: { role } });
  }

  // Назначить роль admin по telegramId
  static async setAdminRole(telegramId: string) {
    // Получаем репозиторий User
    const userRepo = AppDataSource.getRepository(User);
    // Находим пользователя по telegramId
    const user = await userRepo.findOneBy({ telegramId });
    // Если не найден — выбрасываем ошибку
    if (!user) throw new Error('User not found');
    // Меняем роль на admin
    user.role = 'admin';
    // Сохраняем пользователя
    return userRepo.save(user);
  }

  // Удалить пользователя по telegramId
  static async deleteByTelegramId(telegramId: string) {
    // Получаем репозиторий User
    const userRepo = AppDataSource.getRepository(User);
    // Удаляем пользователя
    await userRepo.delete({ telegramId });
  }

  // Обновить пользователя по telegramId
  static async updateByTelegramId(telegramId: string, data: Partial<User>) {
    // Получаем репозиторий User
    const userRepo = AppDataSource.getRepository(User);
    // Находим пользователя
    const user = await userRepo.findOneBy({ telegramId });
    // Если не найден — выбрасываем ошибку
    if (!user) throw new Error('User not found');
    // Обновляем поля
    Object.assign(user, data);
    // Сохраняем пользователя
    return userRepo.save(user);
  }
} 