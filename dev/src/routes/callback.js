const { Router } = require('express');
const crypto = require('crypto');
const config = require('../config');
const db = require('../services/supabase');
const subscription = require('../services/subscription');

const router = Router();

/**
 * Verify CloudPayments HMAC signature.
 * CP sends HMAC-SHA256 of the raw body with Content-HMAC header.
 */
function verifySignature(body, signature) {
  const hmac = crypto
    .createHmac('sha256', config.cloudpayments.apiSecret)
    .update(body)
    .digest('base64');
  return hmac === signature;
}

/**
 * POST /pay/woocp/cp-callback
 * CloudPayments notification handler.
 * Handles: pay (successful charge), fail, recurrent.
 *
 * CloudPayments expects response: { "code": 0 } for success.
 */
router.post('/cp-callback', async (req, res) => {
  try {
    // Verify signature if present
    const sig = req.headers['content-hmac'] || req.headers['x-content-hmac'];
    if (sig && req.rawBody && !verifySignature(req.rawBody, sig)) {
      console.warn('Invalid CloudPayments signature');
      return res.json({ code: 13 }); // reject
    }

    const {
      TransactionId,
      InvoiceId,
      AccountId,
      Amount,
      Currency,
      Status,
      Token,
      OperationType,
      Email,
    } = req.body;

    const email = AccountId || Email;
    const orderId = InvoiceId ? parseInt(InvoiceId, 10) : null;

    console.log(`CP callback: status=${Status}, op=${OperationType}, email=${email}, order=${orderId}`);

    // Payment success (Status: Completed or Authorized)
    if (Status === 'Completed' || Status === 'Authorized') {
      let productId = null;

      // Get product_id from order if available
      if (orderId) {
        try {
          const order = await db.getOrder(orderId);
          if (order) {
            productId = order.product_id;
            // Save transaction ID and token on order
            await db.updateOrderStatus(orderId, 'completed', {
              cp_transaction_id: String(TransactionId),
              cp_token: Token || null,
            });
          }
        } catch (err) {
          console.error('Error fetching order:', err.message);
        }
      }

      // If no order found, try to detect product from active subscriptions
      if (!productId && email) {
        const subs = await db.getActiveSubscriptionsByEmail(email);
        if (subs.length > 0) {
          productId = subs[0].product_id;
        }
      }

      if (productId && email) {
        await subscription.onPaymentSuccess({
          email,
          productId,
          cpToken: Token || null,
          orderId,
        });
      } else {
        console.warn(`CP callback: cannot determine product for email=${email}, orderId=${orderId}`);
      }

      return res.json({ code: 0 });
    }

    // Payment failed
    if (Status === 'Declined') {
      let productId = null;

      if (orderId) {
        try {
          const order = await db.getOrder(orderId);
          if (order) productId = order.product_id;
        } catch (err) {
          console.error('Error fetching order:', err.message);
        }
      }

      if (!productId && email) {
        const subs = await db.getActiveSubscriptionsByEmail(email);
        if (subs.length > 0) productId = subs[0].product_id;
      }

      if (email) {
        await subscription.onPaymentFail({ email, productId, orderId });
      }

      return res.json({ code: 0 });
    }

    // Unknown status — accept to avoid retries
    return res.json({ code: 0 });
  } catch (err) {
    console.error('cp-callback error:', err);
    return res.json({ code: 0 });
  }
});

module.exports = router;
