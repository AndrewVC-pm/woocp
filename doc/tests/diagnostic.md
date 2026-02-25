1) "tail -50 /var/log/nginx/access.log | grep cp-callback" - ничего не вывела
2) вот что есть в личном кабинете CloudPayments :
```
25.02.2026 22:08:11
  Запрос уведомления об успешном платеже (pay)
ID транзакции: 3355303842
Request: #0 V2 POST https://pay.neuro-hub.pro/pay/woocp/cp-callback
TransactionId=3355303842&Amount=10.00&Currency=RUB&PaymentAmount=10.00&PaymentCurrency=RUB&OperationType=Payment&InvoiceId=7&AccountId=woo3@1.com&SubscriptionId=&Name=&Email=woo3@1.com&DateTime=2026-02-25 19:08:11&IpAddress=46.242.15.75&IpCountry=RU&IpCity=Москва&IpRegion=Москва&IpDistrict=Москва&IpLatitude=55.75222&IpLongitude=37.61556&CardId=685d9cf44f0dd01eb9216cb0&CardFirstSix=220432&CardLastFour=7233&CardType=MIR&CardExpDate=08/29&Issuer=OZON Bank Limited Liability Company&IssuerBankCountry=RU&Description=Подписка НейроХаб — Стандарт&AuthCode=005149&Token=tk_b429b23b5cb09cd5018f0f68081ae&TestMode=0&Status=Completed&GatewayName=Tbank&Data={
  "orderId": 7,
  "tariffCode": "NH-STD"
}&TotalFee=3.90&CardProduct=PRD&PaymentMethod=&Rrn=605619153401&InstallmentTerm=&InstallmentMonthlyPayment=&CustomFields=
Response: {"code":0}

25.02.2026 21:53:11
  Запрос уведомления об успешном платеже (pay)
ID транзакции: 3355276099
Request: #0 V2 POST https://pay.neuro-hub.pro/pay/woocp/cp-callback
TransactionId=3355276099&Amount=10.00&Currency=RUB&PaymentAmount=10.00&PaymentCurrency=RUB&OperationType=Payment&InvoiceId=5&AccountId=woo2@1.com&SubscriptionId=&Name=&Email=woo2@1.com&DateTime=2026-02-25 18:53:10&IpAddress=46.242.15.75&IpCountry=RU&IpCity=Москва&IpRegion=Москва&IpDistrict=Москва&IpLatitude=55.75222&IpLongitude=37.61556&CardId=685d9cf44f0dd01eb9216cb0&CardFirstSix=220432&CardLastFour=7233&CardType=MIR&CardExpDate=08/29&Issuer=OZON Bank Limited Liability Company&IssuerBankCountry=RU&Description=Подписка НейроХаб — Стандарт&AuthCode=055141&Token=tk_4c393fd9f691d6396e3d981cfdc4a&TestMode=0&Status=Completed&GatewayName=Tbank&Data={
  "orderId": 5,
  "tariffCode": "NH-STD"
}&TotalFee=3.90&CardProduct=PRD&PaymentMethod=&Rrn=605618128526&InstallmentTerm=&InstallmentMonthlyPayment=&CustomFields=
Response: {"code":0}
```
3) в уведомлениях я указал формат запрос - ClouPayments, други вариант были только - ОСМП (Qiwi), Ростелеком и все, других вариантов нет. также меня смущает что я указал только 2 уведомления - pay и fail, а еще есть :
```
Check — на проверку платежа
Refund — о возврате платежа
Receipt — об онлайн чеке
SbpToken — уведомление о результате привязки счёта СБП через API
Kkt — об изменении статуса кассы
Recurrent — об изменении статуса подписки
Cancel — об отмене платежа
``` - они не нужны?