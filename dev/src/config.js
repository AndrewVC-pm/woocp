require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  basePath: process.env.BASE_PATH || '/pay/woocp',

  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },

  cloudpayments: {
    publicId: process.env.CP_PUBLIC_ID,
    apiSecret: process.env.CP_API_SECRET,
  },

  casdoor: {
    endpoint: process.env.CASDOOR_ENDPOINT || 'https://login.neuro-hub.pro',
    clientId: process.env.CASDOOR_CLIENT_ID,
    clientSecret: process.env.CASDOOR_CLIENT_SECRET,
  },

  exchange: {
    apiKey: process.env.EXCHANGE_API_KEY,
  },

  // Product ID → tariff mapping
  tariffs: {
    13: { name: 'Start', priceRub: 459, casdoorGroup: 'neurohub_pro/Start' },
    15: { name: 'Profi', priceRub: 1450, casdoorGroup: 'neurohub_pro/Profi' },
    16: { name: 'Standard', priceRub: 459, casdoorGroup: 'neurohub_pro/Standard' },
  },
};
