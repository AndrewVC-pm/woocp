const { Router } = require('express');
const config = require('../config');
const db = require('../services/supabase');
const cp = require('../services/cloudpayments');

const router = Router();

/**
 * POST /pay/woocp/create-order
 * Creates order, returns widget config for CloudPayments.
 * Called from frontend JS (site-script).
 */
router.post('/create-order', async (req, res) => {
  try {
    const { product_id, email, qty, tariff_code } = req.body;

    if (!email) {
      return res.json({ success: false, message: 'Email is required' });
    }

    const productId = parseInt(product_id, 10);
    const tariff = config.tariffs[productId];
    if (!tariff) {
      return res.json({ success: false, message: `Unknown product: ${product_id}` });
    }

    const amount = tariff.priceRub;
    const currency = 'RUB';

    // Create order in DB
    const order = await db.createOrder({ email, productId, amount, currency });

    // Build widget config
    const widgetConfig = cp.getWidgetConfig({
      orderId: order.id,
      amount,
      currency,
      email,
      description: `Подписка ${tariff.name} — neuro-hub.pro`,
    });

    return res.json({
      success: true,
      ...widgetConfig,
      order_id: order.id,
      tariff_code: tariff_code || '',
    });
  } catch (err) {
    console.error('create-order error:', err);
    return res.status(500).json({ success: false, message: 'Internal error' });
  }
});

/**
 * POST /pay/woocp/cancel-order
 * Cancel a pending order (called on widget close/fail from frontend).
 */
router.post('/cancel-order', async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return res.json({ success: false, message: 'order_id required' });
    }

    const order = await db.getOrder(order_id);
    if (!order) {
      return res.json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'pending') {
      await db.updateOrderStatus(order_id, 'cancelled');
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('cancel-order error:', err);
    return res.status(500).json({ success: false, message: 'Internal error' });
  }
});

module.exports = router;
