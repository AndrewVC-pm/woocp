const cron = require('node-cron');
const config = require('../config');
const db = require('../services/supabase');
const cp = require('../services/cloudpayments');
const subscription = require('../services/subscription');

/**
 * Process a single subscription recurrent charge.
 */
async function processSubscription(sub) {
  const tariff = config.tariffs[sub.product_id];
  if (!tariff) {
    console.error(`Recurrent: unknown product_id ${sub.product_id} for sub ${sub.id}`);
    return;
  }

  if (!sub.cp_token) {
    console.warn(`Recurrent: no token for sub ${sub.id} (${sub.email}), skipping`);
    return;
  }

  console.log(`Recurrent: charging ${sub.email}, product=${sub.product_id}, amount=${tariff.priceRub}`);

  try {
    const result = await cp.chargeRecurrent({
      amount: tariff.priceRub,
      currency: 'RUB',
      accountId: sub.email,
      token: sub.cp_token,
      invoiceId: `recurrent-${sub.id}-${Date.now()}`,
      description: `Ежемесячная подписка ${tariff.name} — neuro-hub.pro`,
    });

    if (result.Success) {
      // Payment succeeded — update balance + groups + next payment date
      await subscription.onPaymentSuccess({
        email: sub.email,
        productId: sub.product_id,
        cpToken: sub.cp_token,
        orderId: null,
      });
      console.log(`Recurrent: success for ${sub.email}`);
    } else {
      // Payment failed — reset balance, set Start group
      await subscription.onPaymentFail({
        email: sub.email,
        productId: sub.product_id,
        orderId: null,
      });

      // Mark subscription as cancelled
      await db.updateSubscription(sub.id, { status: 'cancelled' });
      console.log(`Recurrent: failed for ${sub.email}, reason: ${result.Message || 'unknown'}`);
    }
  } catch (err) {
    console.error(`Recurrent: error processing sub ${sub.id} (${sub.email}):`, err.message);
  }
}

/**
 * Run the recurrent payment cycle — find all due subscriptions, charge each.
 */
async function runRecurrentCycle() {
  console.log('Recurrent: starting cycle...');

  try {
    const dueSubs = await db.getDueSubscriptions();
    console.log(`Recurrent: ${dueSubs.length} subscriptions due`);

    for (const sub of dueSubs) {
      await processSubscription(sub);
    }
  } catch (err) {
    console.error('Recurrent: cycle error:', err.message);
  }

  console.log('Recurrent: cycle finished');
}

/**
 * Start the daily cron job at 06:00 UTC.
 */
function startRecurrentCron() {
  cron.schedule('50 20 * * *', runRecurrentCycle);
  console.log('Recurrent cron scheduled: daily at 20:50 UTC (23:50 MSK)');
}

module.exports = { startRecurrentCron, runRecurrentCycle };
