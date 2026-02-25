# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Billing service replacing WordPress/WooCommerce + n8n webhooks for subscription management at neuro-hub.pro. Handles payments via CloudPayments, manages user balances in Supabase, and controls access groups in Casdoor SSO.

## Architecture

### Current system being replaced
- **WooCommerce** (neuro-hub.pro) — order processing, subscription management, recurrent billing via CloudPayments
- **n8n webhooks** — subscription business logic triggered by WooCommerce events (order.updated)
- **WordPress snippets** — CloudPayments integration glue code

### Systems that remain (integrate with)
- **Supabase** — primary database
  - `users` — user profiles with balance (id, email, name, role, balance, created_at, deleted)
  - `neurohub_users` — user registry (id, user_id, email, created_at)
  - `course_USD2RUB` — USD/RUB exchange rate (id, usd2rub, mod_at)
- **Casdoor** (login.neuro-hub.pro) — SSO and user group management
  - API: `GET /api/get-user?email=...`, `POST /api/update-user?id=neurohub_pro/{name}`
  - Groups: `neurohub_pro/Start`, `neurohub_pro/Profi`, `neurohub_pro/Standard`, `neurohub_pro/openwebui-admin`
  - Admin group is preserved when updating user groups
- **CloudPayments** — payment provider (widget + recurrent charges)

### Subscription logic
| Tariff   | Old product_id | Price (RUB) | Casdoor Group              |
|----------|---------------|-------------|---------------------------|
| Start    | 13            | 459         | neurohub_pro/Start        |
| Profi    | 15            | 1450        | neurohub_pro/Profi        |
| Standard | 16            | 459         | neurohub_pro/Standard     |

- On payment: `balance = price_rub / course_USD2RUB`
- On failed recurrent payment: balance reset to 0
- On successful recurrent: balance topped up again

### Target deployment
URL path: `pay.neuro-hub.pro/pay/woocp/*`

## Project Structure

```
./product_task.md          # Product requirements (RU)
./dev/                     # Working code directory
    ├── debug/             # Debug logs
    └── data/
        ├── roadmap.md     # Progress tracking
        ├── howto.md       # How to run/update the project
        └── dev_task.md    # Technical specification
./doc/
    ├── data/              # Source data about current system
    │   ├── n8n-webhook.md # n8n workflow JSON (order.updated logic)
    │   ├── supabase.md    # DB schema with examples
    │   ├── snippets.md    # WordPress/WooCommerce PHP snippets
    │   └── site-script.md # Frontend payment widget script
    └── guide/             # User-facing guides
```

## Key Data Files

- `doc/data/n8n-webhook.md` — Full n8n workflow JSON defining the subscription logic. Contains the complete flow: webhook → check order status → check if subscription → get/update balance → map product to group → update Casdoor user → update Supabase user.
- `doc/data/site-script.md` — Frontend JS that creates orders via REST API and launches CloudPayments widget.
- `doc/data/snippets.md` — WooCommerce PHP hooks for checkout customization and subscription activation.

## Dev Rules
- Use Context7 MCP to obtain up-to-date documentation.
- Use Playwright MCP to open a browser page for debugging front-end development and viewing errors.
