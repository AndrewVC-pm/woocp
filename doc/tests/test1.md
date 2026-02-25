- при попытке оплатить на сайте "https://neuro-hub.pro/price/" пишет ошибку "Сервис временно недоступен, попробуйте ещё раз позже", в "docker logs -f woocp" не пишет ни про какую ошибку. 
вот что показывает dev панель :
1) ```
Request URL
https://pay.neuro-hub.pro/pay/woocp/create-order
Referrer Policy
strict-origin-when-cross-origin
Status - CORS error
payload - {
    "product_id": "16",
    "qty": 1,
    "email": "woo1@1.com",
    "tariff_code": "NH-STD"
}
initiator - 	price/:1048
```
2) ```
Request URL
https://pay.neuro-hub.pro/pay/woocp/create-order
Request Method
OPTIONS
Status Code
200 OK
Remote Address
127.0.0.1:10808
Referrer Policy
strict-origin-when-cross-origin
:authority
pay.neuro-hub.pro
:method
OPTIONS
:path
/pay/woocp/create-order
:scheme
https
accept
*/*
accept-encoding
gzip, deflate, br, zstd
accept-language
ru-RU,ru;q=0.9
access-control-request-headers
content-type
access-control-request-method
POST
origin
https://neuro-hub.pro
priority
u=1, i
referer
https://neuro-hub.pro/
sec-fetch-dest
empty
sec-fetch-mode
cors
sec-fetch-site
same-site
user-agent
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
```

- также проверка health :
```
curl https://pay.neuro-hub.pro/pay/woocp/health
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /pay/woocp/health</pre>
</body>
</html>
```