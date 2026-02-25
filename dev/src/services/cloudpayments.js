const axios = require('axios');
const config = require('../config');

const CP_API_BASE = 'https://api.cloudpayments.ru';

const cpClient = axios.create({
  baseURL: CP_API_BASE,
  auth: {
    username: config.cloudpayments.publicId,
    password: config.cloudpayments.apiSecret,
  },
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Charge a recurrent payment using saved card token.
 * https://developers.cloudpayments.ru/#oplata-po-tokenu-kriptogramme
 */
async function chargeRecurrent({ amount, currency, accountId, token, invoiceId, description }) {
  const { data } = await cpClient.post('/payments/tokens/charge', {
    Amount: amount,
    Currency: currency || 'RUB',
    AccountId: accountId,
    Token: token,
    InvoiceId: invoiceId,
    Description: description || 'Ежемесячная подписка neuro-hub.pro',
  });
  return data;
}

/**
 * Build widget config for frontend.
 */
function getWidgetConfig({ orderId, amount, currency, email, description }) {
  return {
    publicId: config.cloudpayments.publicId,
    description: description || 'Подписка neuro-hub.pro',
    amount,
    currency: currency || 'RUB',
    invoiceId: String(orderId),
    accountId: email,
    email,
    data: {
      orderId,
    },
  };
}

module.exports = {
  chargeRecurrent,
  getWidgetConfig,
};
