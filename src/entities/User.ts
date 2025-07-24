import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Описываем сущность User
@Entity()
export class User {
  // Уникальный идентификатор пользователя
  @PrimaryGeneratedColumn()
  id!: number;

  // Имя пользователя
  @Column()
  username!: string;

  // Telegram ID
  @Column({ unique: true })
  telegramId!: string;

  // Роль пользователя (admin или user)
  @Column({ default: 'user' })
  role!: 'admin' | 'user';
} 