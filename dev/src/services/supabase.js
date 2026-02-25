const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

// --- Orders ---

async function createOrder({ email, productId, amount, currency }) {
  const { data, error } = await supabase
    .from('orders')
    .insert({ email, product_id: productId, amount, currency, status: 'pending' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateOrderStatus(orderId, status, extra = {}) {
  const update = { status, ...extra };
  const { data, error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getOrder(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select()
    .eq('id', orderId)
    .single();
  if (error) throw error;
  return data;
}

// --- Subscriptions ---

async function upsertSubscription({ email, productId, cpToken, nextPaymentAt }) {
  // Deactivate any existing active subscription for same product
  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('email', email)
    .eq('product_id', productId)
    .eq('status', 'active');

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      email,
      product_id: productId,
      status: 'active',
      cp_token: cpToken,
      next_payment_at: nextPaymentAt,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getActiveSubscriptionsByEmail(email) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('email', email)
    .eq('status', 'active');
  if (error) throw error;
  return data || [];
}

async function getDueSubscriptions() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('status', 'active')
    .lte('next_payment_at', new Date().toISOString());
  if (error) throw error;
  return data || [];
}

async function updateSubscription(id, updates) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- Users ---

async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

async function upsertUser({ id, email, balance }) {
  const { data, error } = await supabase
    .from('users')
    .upsert({ id, email, name: email, balance }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateUserBalance(email, balance) {
  const { data, error } = await supabase
    .from('users')
    .update({ balance })
    .eq('email', email)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getNeurohubUser(email) {
  const { data, error } = await supabase
    .from('neurohub_users')
    .select()
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// --- Exchange Rate ---

async function getExchangeRate() {
  const { data, error } = await supabase
    .from('course_USD2RUB')
    .select()
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
}

async function updateExchangeRate(rate) {
  const { error } = await supabase
    .from('course_USD2RUB')
    .update({ usd2rub: rate, mod_at: new Date().toISOString().slice(0, 10) })
    .eq('id', 1);
  if (error) throw error;
}

module.exports = {
  supabase,
  createOrder,
  updateOrderStatus,
  getOrder,
  upsertSubscription,
  getActiveSubscriptionsByEmail,
  getDueSubscriptions,
  updateSubscription,
  getUserByEmail,
  upsertUser,
  updateUserBalance,
  getNeurohubUser,
  getExchangeRate,
  updateExchangeRate,
};
