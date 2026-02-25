<script src="https://widget.cloudpayments.ru/bundles/cloudpayments.js"></script>

<script>
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.js-cp-pay');
  if (!btn) return;

  e.preventDefault();

  const productId   = btn.dataset.productId;
  const tariffCode  = btn.dataset.tariffCode || '';
  const skin        = btn.dataset.skin || 'classic';
  const descFromBtn = btn.dataset.desc || '';

  // e-mail берём только из авторизованного пользователя
  const email = window.currentUserEmail || '';
  if (!email) {
    alert('Чтобы оформить подписку, авторизуйтесь на сайте');
    return;
  }

  // 1) создаём заказ через наш REST
  fetch('https://neuro-hub.pro/wp-json/neurohub/v1/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id:  productId,
      qty:         1,
      email:       email,
      tariff_code: tariffCode
    })
  })
  .then(function (response) { return response.json(); })
  .then(function (data) {
    if (!data.success) {
      console.error('create-order error', data);
      alert('Ошибка создания заказа: ' + (data.message || ''));
      return;
    }

    // 2) запускаем виджет CloudPayments
    var payments = new cp.CloudPayments();

    payments.pay('charge', {
      publicId:    data.publicId,
      description: descFromBtn || data.description,
      amount:      data.amount,
      currency:    data.currency,
      invoiceId:   data.invoiceId, // ID заказа Woo
      accountId:   data.accountId,
      email:       data.email,
      skin:        skin,
      data: {
        orderId:    data.order_id,
        tariffCode: data.tariff_code
      }
    }, {
      // УСПЕШНАЯ ОПЛАТА
      onSuccess: function (options) {
        window.location.href =
        'https://neuro-hub.pro/pay-success/?order=' + data.order_id;
      },

      // ЛЮБАЯ НЕУСПЕШНАЯ ОПЛАТА / ЗАКРЫТИЕ ВИДЖЕТА
      onFail: function (reason, options) {
        console.log('CloudPayments onFail:', reason, options);

        // Говорим WordPress отменить заказ и подписку
        fetch('https://neuro-hub.pro/wp-json/neurohub/v1/cancel-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: data.order_id })
        }).catch(function (err) {
          console.error('cancel-order error', err);
        });

        // ВАЖНО: НИКУДА НЕ РЕДИРЕКТИМ — остаёмся на текущей странице
      },

      // Просто факт получения ответа от API — ничего не делаем
      onComplete: function (paymentResult, options) {
        console.log('CloudPayments onComplete:', paymentResult);
      }
    });
  })
  .catch(function (err) {
    console.error(err);
    alert('Сервис временно недоступен, попробуйте ещё раз позже');
  });
});
</script>
