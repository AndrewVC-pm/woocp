1) я обновил и чот логи :
```
Billing service running on port 4000
Base path: /pay/woocp
Recurrent cron scheduled: daily at 06:00 UTC
CP callback: status=Completed, op=Payment, email=woo3@1.com, order=10
Failed to update Casdoor group for woo3@1.com: Request failed with status code 404
Payment success: woo3@1.com, product=16, balance=0.1306
```
2) также вопрос что ставить в .env, я указал :
```
....
# Casdoor
CASDOOR_ENDPOINT=https://login.neuro-hub.pro/api/update-user
CASDOOR_CLIENT_ID=***
CASDOOR_CLIENT_SECRET=***

....

```
3) также если ты забыл вот нода из n8n как пример запроса :
```
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "=https://login.neuro-hub.pro/api/update-user",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "id",
              "value": "=neurohub_pro/{{$json.user.name}}"
            },
            {
              "name": "clientId",
              "value": "0a555e3b5c73db782801"
            },
            {
              "name": "clientSecret",
              "value": "5cce4d81f16db49069ba911790aafcfceb1615e9"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{$('New group').item.json.user}}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2400,
        192
      ],
      "id": "1638f0b6-b0b8-487c-9969-966296275700",
      "name": "Update User"
    }
  ],
  "connections": {
    "Update User": {
      "main": [
        []
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "ccb655d891d6ee232f9fa5f437d19155cbfdcb47ae5b4a52820b3ea8bcdcf403"
  }
}
```