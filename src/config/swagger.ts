import swaggerJSDoc from 'swagger-jsdoc';

// Опции для swagger-jsdoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RemoteShellBot API',
      version: '1.0.0',
      description: 'Документация API для RemoteShellBot',
    },
  },
  apis: ['src/controllers/*.ts'], // Путь к контроллерам для автогенерации
};

// Экспортируем спецификацию swagger
export const swaggerSpec = swaggerJSDoc(options); 