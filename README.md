<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Наименование

Приложение агрегатор отелей

## Запуск

Удобнее всего запустить через docker compose

```bash
$ docker compose --env-file .env up
```

Так же можно запустить в dev режиме

```bash
$ docker compose --env-file .env -f docker-compose.dev.yml up
```

Должен быть файл .env (заполнить как в .env.example)

## Краткое описание

По ссылке можно посмотреть ТЗ
https://github.com/netology-code/ndjs-diplom

В приложении реализуются модули:
- Пользователи
- Авторизация
- Управление отелями
- Управление номерами в отелях
- Бронирование отелей
- Поддержки с чатом

## Использованные технологии
- Backend на NestJS
  - Валидация через class-validator
  - Хеширование паролей bcrypt
  - Авторизация через сессии (passport local)
  - Система ролей NestJS Guard
- Загрузка файлов multer
- База MongoDB с библиотекой Mongoose
  - Использовал feature Mongo populate (связанные коллекции)
- Для чата Socket.io

