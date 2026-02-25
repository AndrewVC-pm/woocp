# WooCP — Инструкция по деплою и настройке

## Что это

WooCP — биллинг-сервис для neuro-hub.pro, заменяющий WooCommerce + n8n. Обрабатывает подписки, платежи через CloudPayments, управляет балансом в Supabase и группами в Casdoor.

## Требования на сервере

- Docker + docker-compose
- Git
- Nginx (для reverse proxy)
- Свободный порт **4000** (порт 3000 занят open-webui)

## Деплой на сервер

### 1. Клонировать репозиторий

```bash
cd /opt
git clone https://github.com/AndrewVC-pm/woocp.git
cd woocp/dev
```

### 2. Создать .env файл

```bash
cp .env.example .env
nano .env
```

Заполнить все переменные:

```env
SUPABASE_URL=https://ibmjryqwwulpkoonolzi.supabase.co
SUPABASE_SERVICE_KEY=<service-role-key из Supabase>

CP_PUBLIC_ID=<Public ID из CloudPayments>
CP_API_SECRET=<API Secret из CloudPayments>

CASDOOR_ENDPOINT=https://login.neuro-hub.pro
CASDOOR_CLIENT_ID=<Client ID приложения в Casdoor>
CASDOOR_CLIENT_SECRET=<Client Secret приложения в Casdoor>

EXCHANGE_API_KEY=<API ключ exchangerate.host>

PORT=4000
BASE_PATH=/pay/woocp
```

### 3. Собрать и запустить

```bash
docker-compose up --build -d
```

Проверить что контейнер запустился:

```bash
docker ps | grep woocp
```

Должно быть:
```
CONTAINER ID   IMAGE       COMMAND              STATUS        PORTS                    NAMES
xxxxxxxxx      dev-woocp   "node src/index.js"  Up X seconds  0.0.0.0:4000->4000/tcp   woocp
```

Проверить health check:
```bash
curl http://localhost:4000/pay/woocp/health
# {"status":"ok"}
```

### 4. Настроить Nginx

Добавить в конфигурацию `pay.neuro-hub.pro` (или создать новый server block):

```nginx
server {
    listen 443 ssl;
    server_name pay.neuro-hub.pro;

    # SSL сертификаты (certbot / ваши)
    ssl_certificate     /etc/letsencrypt/live/pay.neuro-hub.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pay.neuro-hub.pro/privkey.pem;

    location /pay/woocp/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Перезагрузить nginx:
```bash
nginx -t && systemctl reload nginx
```

### 5. Настроить CloudPayments

В личном кабинете CloudPayments → Настройки сайта → Уведомления:
- **Pay URL:** `https://pay.neuro-hub.pro/pay/woocp/cp-callback`
- **Fail URL:** `https://pay.neuro-hub.pro/pay/woocp/cp-callback`
- Формат: **JSON**
- Метод: **POST**

### 6. Обновить скрипт на сайте WordPress

Заменить URL в скрипте оплаты:

```javascript
// Было:
fetch('https://neuro-hub.pro/wp-json/neurohub/v1/create-order', ...)
fetch('https://neuro-hub.pro/wp-json/neurohub/v1/cancel-order', ...)

// Стало:
fetch('https://pay.neuro-hub.pro/pay/woocp/create-order', ...)
fetch('https://pay.neuro-hub.pro/pay/woocp/cancel-order', ...)
```

Также обновить `onSuccess` redirect URL при необходимости.

## Обновление WooCP на сервере

```bash
cd /opt/billing/dev
git pull origin master
docker-compose up --build -d
```

## Просмотр логов

```bash
# Все логи
docker logs woocp

# Следить в реальном времени
docker logs -f woocp

# Последние 100 строк
docker logs --tail 100 woocp
```

## Остановка / перезапуск

```bash
# Остановить
docker-compose down

# Перезапустить
docker-compose restart

# Пересобрать и запустить
docker-compose up --build -d
```

## Совместимость с другими контейнерами

WooCP использует порт **4000**, который не конфликтует с существующими сервисами:

| Сервис | Порт |
|--------|------|
| open-webui | 3000 |
| evc-owui | 3001 |
| casdoor | 8000 |
| openwebui-monitor | 7878 |
| portainer | 9000 |
| pipelines | 9099 |
| **woocp** | **4000** |

## Проверка работоспособности

```bash
# 1. Health check
curl https://pay.neuro-hub.pro/pay/woocp/health

# 2. Тестовый create-order (вернёт ошибку без email — это нормально)
curl -X POST https://pay.neuro-hub.pro/pay/woocp/create-order \
  -H "Content-Type: application/json" \
  -d '{"product_id": 13, "email": "test@test.com"}'
```
