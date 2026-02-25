# Roadmap — WooCP

## Этап 1: Анализ текущей логики ✅
- [x] Изучить n8n webhooks (order.updated, subscription lifecycle)
- [x] Изучить CloudPayments интеграцию (виджет + рекуррентные платежи)
- [x] Изучить Casdoor API (управление группами пользователей)
- [x] Изучить структуру Supabase (users, neurohub_users, course_USD2RUB)

## Этап 2: Проектирование ✅
- [x] Архитектура сервиса (Express.js + Supabase + CloudPayments + Casdoor)
- [x] API endpoints для pay.neuro-hub.pro/pay/woocp/
- [x] Схема обработки платежей и подписок

## Этап 3: Разработка ✅
- [x] Инициализация проекта (package.json, .env.example, .gitignore)
- [x] Миграции Supabase (таблицы orders, subscriptions)
- [x] Config + Express entry point
- [x] Сервисы интеграций (supabase, cloudpayments, casdoor, exchange)
- [x] Бизнес-логика подписок (subscription.js)
- [x] API routes (create-order, cancel-order, cp-callback)
- [x] Рекуррентные платежи (cron)
- [x] Docker (Dockerfile + docker-compose.yml)

## Этап 4: Тестирование и деплой ⬜
- [ ] Заполнить .env реальными ключами
- [ ] Собрать и запустить `docker-compose up --build`
- [ ] Протестировать create-order через curl
- [ ] Протестировать cp-callback
- [ ] Обновить фронтенд скрипт (URL → pay.neuro-hub.pro/pay/woocp/create-order)
- [ ] Настроить nginx reverse proxy
- [ ] Настроить CloudPayments notification URL → pay.neuro-hub.pro/pay/woocp/cp-callback
