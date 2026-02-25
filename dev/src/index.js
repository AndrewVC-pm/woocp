const express = require('express');
const config = require('./config');
const paymentRoutes = require('./routes/payment');
const callbackRoutes = require('./routes/callback');
const { startRecurrentCron } = require('./cron/recurrent');

const app = express();

app.use(express.json({
  verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); },
}));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Routes
app.use(config.basePath, paymentRoutes);
app.use(config.basePath, callbackRoutes);

app.listen(config.port, () => {
  console.log(`Billing service running on port ${config.port}`);
  console.log(`Base path: ${config.basePath}`);
  startRecurrentCron();
});
