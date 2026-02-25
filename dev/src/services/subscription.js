const config = require('../config');
const db = require('./supabase');
const casdoor = require('./casdoor');
const exchange = require('./exchange');

/**
 * Process successful payment — reproduces n8n order.updated logic:
 * 1. Get exchange rate
 * 2. Calculate balance = priceRub / course
 * 3. Get/create user in Supabase, set balance
 * 4. Map product_id → Casdoor group
 * 5. Update user group in Casdoor (preserve admin)
 */
async function onPaymentSuccess({ email, productId, cpToken, orderId }) {
  const tariff = config.tariffs[productId];
  if (!tariff) {
    throw new Error(`Unknown product_id: ${productId}`);
  }

  const course = await exchange.getRate();
  const balance = tariff.priceRub / course;

  // Check if user exists in Supabase users table
  let user = await db.getUserByEmail(email);

  if (user) {
    // Existing user — update balance (add to current)
    const newBalance = parseFloat(user.balance) + balance;
    await db.updateUserBalance(email, newBalance);
  } else {
    // New user — get neurohub_users record for user_id, then upsert
    const nhUser = await db.getNeurohubUser(email);
    if (nhUser) {
      await db.upsertUser({ id: nhUser.user_id, email, balance });
    } else {
      console.warn(`No neurohub_user found for ${email}, cannot create user record`);
    }
  }

  // Update Casdoor group
  try {
    await casdoor.updateUserGroup(email, tariff.casdoorGroup);
  } catch (err) {
    console.error(`Failed to update Casdoor group for ${email}:`, err.message);
  }

  // Create/update subscription with next payment in 30 days
  const nextPayment = new Date();
  nextPayment.setDate(nextPayment.getDate() + 30);

  await db.upsertSubscription({
    email,
    productId,
    cpToken,
    nextPaymentAt: nextPayment.toISOString(),
  });

  console.log(`Payment success: ${email}, product=${productId}, balance=${balance.toFixed(4)}`);
  return { balance, group: tariff.casdoorGroup };
}

/**
 * Process failed payment — balance reset, group → Start
 */
async function onPaymentFail({ email, productId, orderId }) {
  // Reset balance to 0
  try {
    await db.updateUserBalance(email, 0);
  } catch (err) {
    console.error(`Failed to reset balance for ${email}:`, err.message);
  }

  // Set Casdoor group to Start
  try {
    await casdoor.updateUserGroup(email, 'neurohub_pro/Start');
  } catch (err) {
    console.error(`Failed to reset Casdoor group for ${email}:`, err.message);
  }

  // Update order status if applicable
  if (orderId) {
    try {
      await db.updateOrderStatus(orderId, 'failed');
    } catch (err) {
      console.error(`Failed to update order ${orderId} status:`, err.message);
    }
  }

  console.log(`Payment failed: ${email}, product=${productId}, balance reset to 0`);
}

module.exports = {
  onPaymentSuccess,
  onPaymentFail,
};
