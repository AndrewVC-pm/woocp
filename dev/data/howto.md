# WooCP — Как работать с проектом (для разработчика)

## Структура проекта

```
dev/
├── src/
│   ├── index.js              # Express app entry point
│   ├── config.js             # Env config + маппинг тарифов
│   ├── routes/
│   │   ├── payment.js        # POST /create-order, /cancel-order
│   │   └── callback.js       # POST /cp-callback
│   ├── services/
│   │   ├── supabase.js       # Supabase CRUD
│   │   ├── cloudpayments.js  # CloudPayments API
│   │   ├── casdoor.js        # Casdoor API
│   │   ├── exchange.js       # Курс USD/RUB
│   │   └── subscription.js   # Бизнес-логика подписок
│   └── cron/
│       └── recurrent.js      # Cron рекуррентных платежей
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
└── .gitignore
```

## Локальная разработка

```bash
cd dev/
cp .env.example .env   # заполнить ключами
npm install
npm run dev            # запуск с --watch (авторестарт)
```

## Как добавить новый тариф

1. Открыть `src/config.js` → объект `tariffs`
2. Добавить новый product_id:
   ```js
   17: { name: 'NewTariff', priceRub: 999, casdoorGroup: 'neurohub_pro/NewTariff' },
   ```
3. Создать соответствующую группу в Casdoor

## Как изменить расписание cron

Файл `src/cron/recurrent.js`, строка с `cron.schedule()`.
Формат: стандартный cron (`0 6 * * *` = ежедневно в 06:00 UTC).

## CORS

Сервис использует пакет `cors` для обработки cross-origin запросов с `https://neuro-hub.pro`. Настройка в `src/index.js`. Если фронтенд переедет на другой домен — обновить `origin` в `cors()`.

## Как работает flow оплаты

1. **Фронтенд** → `POST /create-order` → создаёт order в Supabase, возвращает конфиг виджета
2. **Виджет CloudPayments** → пользователь платит
3. **CloudPayments** → `POST /cp-callback` → HMAC проверка → `subscription.onPaymentSuccess()`:
   - Получает курс USD/RUB
   - Считает баланс = priceRub / course
   - Обновляет/создаёт пользователя в Supabase
   - Обновляет группу в Casdoor
   - Создаёт подписку (next_payment + 30 дней)
4. **Cron (ежедневно)** → находит подписки где `next_payment_at <= now()` → списывает по токену

## Как деплоить обновления

```bash
git add . && git commit -m "описание" && git push
# На сервере:
cd /opt/billing/dev && git pull && docker-compose up --build -d
```

## Таблицы в Supabase (новые)

- `orders` — заказы (email, product_id, amount, status, cp_token, cp_transaction_id)
- `subscriptions` — подписки (email, product_id, status, next_payment_at, cp_token)
