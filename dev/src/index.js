const express = require('express');
const cors = require('cors');
const config = require('./config');
const paymentRoutes = require('./routes/payment');
const callbackRoutes = require('./routes/callback');
const { startRecurrentCron, runRecurrentCycle } = require('./cron/recurrent');

const app = express();

app.use(cors({
  origin: 'https://neuro-hub.pro',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({
  verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); },
}));
app.use(express.urlencoded({
  extended: true,
  verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); },
}));

// Health check (under basePath so nginx proxy reaches it)
app.get(config.basePath + '/health', (_req, res) => res.json({ status: 'ok' }));

// Manual trigger for recurrent cycle
app.post(config.basePath + '/run-recurrent', async (_req, res) => {
  console.log('Manual recurrent cycle triggered');
  runRecurrentCycle();
  res.json({ status: 'started', message: 'Recurrent cycle triggered, check logs' });
});

// Routes
app.use(config.basePath, paymentRoutes);
app.use(config.basePath, callbackRoutes);

app.listen(config.port, () => {
  console.log(`Billing service running on port ${config.port}`);
  console.log(`Base path: ${config.basePath}`);
  startRecurrentCron();
});
