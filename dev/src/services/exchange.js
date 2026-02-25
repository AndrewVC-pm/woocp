const axios = require('axios');
const config = require('../config');
const db = require('./supabase');

/**
 * Fetch fresh USD→RUB rate from API, update DB if changed.
 * Falls back to cached DB value on API failure.
 */
async function getRate() {
  const cached = await db.getExchangeRate();
  const today = new Date().toISOString().slice(0, 10);

  // If already updated today, return cached
  if (cached && cached.mod_at === today) {
    return parseFloat(cached.usd2rub);
  }

  // Try to fetch fresh rate
  try {
    const { data } = await axios.get('http://api.exchangerate.host/live', {
      params: {
        access_key: config.exchange.apiKey,
        source: 'USD',
        currencies: 'RUB',
        format: 1,
      },
    });

    if (data && data.quotes && data.quotes.USDRUB) {
      const rate = data.quotes.USDRUB;
      await db.updateExchangeRate(rate);
      return rate;
    }
  } catch (err) {
    console.error('Exchange rate API error, using cached value:', err.message);
  }

  return cached ? parseFloat(cached.usd2rub) : 76.75;
}

module.exports = { getRate };
