# Техническое задание — WooCP

## Цель
Заменить WooCommerce + WooCommerce Subscriptions + n8n webhooks на собственный Node.js сервис. Полностью воспроизвести текущую логику подписок, платежей и управления балансом/группами.

## Архитектура

```
[WordPress site] → JS widget → [pay.neuro-hub.pro/pay/woocp/]
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
              POST /create-order   POST /cp-callback    CRON job
                    │                    │                    │
                    ▼                    ▼                    ▼
              [Supabase]          [Supabase]          CloudPayments
              + CloudPayments     + Casdoor            Recurrent API
                widget config     balance/groups            │
                                                           ▼
                                                      [Supabase]
                                                      + Casdoor
```

## Стек
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **DB:** Supabase (Postgres) — `@supabase/supabase-js`
- **Payments:** CloudPayments (widget + recurrent)
- **Scheduler:** node-cron
- **Deploy:** Docker + docker-compose, nginx reverse proxy

## Структура файлов

```
dev/
├── src/
│   ├── index.js              # Express app entry point
│   ├── config.js             # Environment config + tariff mapping
│   ├── routes/
│   │   ├── payment.js        # POST /create-order, /cancel-order
│   │   └── callback.js       # POST /cp-callback
│   ├── services/
│   │   ├── supabase.js       # Supabase client + CRUD
│   │   ├── cloudpayments.js  # CloudPayments API
│   │   ├── casdoor.js        # Casdoor API
│   │   ├── exchange.js       # USD/RUB exchange rate
│   │   └── subscription.js   # Subscription business logic
│   └── cron/
│       └── recurrent.js      # Daily recurrent payment cron
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
└── .gitignore
```

## API Endpoints

### POST /pay/woocp/create-order
**Вход:** `{ product_id, email, qty, tariff_code }`
**Выход:** `{ success, publicId, amount, currency, invoiceId, accountId, email, order_id, ... }`
Создаёт заказ в БД, возвращает конфиг для виджета CloudPayments.

### POST /pay/woocp/cancel-order
**Вход:** `{ order_id }`
**Выход:** `{ success }`
Отменяет pending-заказ (вызывается при закрытии виджета).

### POST /pay/woocp/cp-callback
**Вход:** CloudPayments notification (JSON)
**Выход:** `{ code: 0 }`
Обрабатывает уведомления от CloudPayments. HMAC-SHA256 верификация подписи.

## Бизнес-логика

### Тарифы
| Тариф | product_id | Цена (RUB) | Группа Casdoor |
|-------|-----------|------------|----------------|
| Start | 13 | 459 | neurohub_pro/Start |
| Profi | 15 | 1450 | neurohub_pro/Profi |
| Standard | 16 | 459 | neurohub_pro/Standard |

### Успешная оплата
1. Получить курс USD/RUB (обновить из API если устарел)
2. Рассчитать баланс = priceRub / course
3. Если пользователь существует — прибавить баланс
4. Если нет — найти в neurohub_users, создать запись в users
5. Обновить группу в Casdoor (сохранить admin если есть)
6. Создать/обновить подписку (next_payment через 30 дней)

### Неуспешная оплата
1. Обнулить баланс пользователя
2. Поставить группу Start в Casdoor

### Рекуррентные платежи
- Ежедневный cron в 06:00 UTC
- Берёт подписки с `next_payment_at <= now()` и `status = active`
- Списывает по сохранённому токену через CloudPayments API
- По результату: обновить баланс/группы или обнулить

## Таблицы БД (новые)

### orders
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| email | text | Email покупателя |
| product_id | int | ID тарифа (13, 15, 16) |
| amount | numeric | Сумма в RUB |
| currency | text | RUB |
| status | text | pending / completed / failed / cancelled |
| cp_transaction_id | text | ID транзакции CloudPayments |
| cp_token | text | Токен карты для рекуррентных платежей |
| created_at | timestamptz | Дата создания |

### subscriptions
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| email | text | Email пользователя |
| product_id | int | ID тарифа |
| status | text | active / pending-cancel / cancelled |
| next_payment_at | timestamptz | Дата следующего списания |
| cp_token | text | Токен карты CloudPayments |
| created_at | timestamptz | Дата создания |
| updated_at | timestamptz | Дата обновления |

## Интеграции
- **Supabase** — users, neurohub_users, course_USD2RUB, orders, subscriptions
- **CloudPayments** — виджет оплаты + recurrent charges API
- **Casdoor** — GET /api/get-user, POST /api/update-user (управление группами)
- **exchangerate.host** — курс USD/RUB

## Источники данных
- doc/data/n8n-webhook.md — текущая логика n8n
- doc/data/supabase.md — структура БД
- doc/data/snippets.md — WordPress snippets
- doc/data/site-script.md — фронтенд скрипт оплаты
