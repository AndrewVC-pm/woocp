1) "functions" : 
```
add_filter('woocommerce_checkout_fields', function($fields) {
    // Убираем пароль при покупке подписки
    if (class_exists('WC_Subscriptions_Cart') && WC_Subscriptions_Cart::cart_contains_subscription()) {
        unset($fields['account']['account_password']);
    }

    // Убираем слово "Платежи" из меток полей
    foreach ($fields as $fieldset => $field) {
        foreach ($field as $key => $value) {
            if (isset($fields[$fieldset][$key]['label'])) {
                $fields[$fieldset][$key]['label'] = str_replace('Платежи ', '', $fields[$fieldset][$key]['label']);
            }
        }
    }

    return $fields;
});

add_filter('woocommerce_checkout_required_field_notice', function($notice, $field_label) {
    return str_replace('Платежи ', '', sprintf(__('%s является обязательным полем.', 'woocommerce'), $field_label));
}, 10, 2);

add_filter('woocommerce_payment_complete_order_status', 'custom_order_status_completed');
function custom_order_status_completed($order_status) {
    return 'completed'; // Устанавливает статус "Завершен" для всех оплаченных заказов
}


add_action('woocommerce_thankyou', 'activate_subscription_after_payment', 10, 1);
function activate_subscription_after_payment($order_id) {
    if (!$order_id) return;

    $order = wc_get_order($order_id);

    if ($order->has_status('completed')) {
        $subscriptions = wcs_get_subscriptions_for_order($order_id);
        foreach ($subscriptions as $subscription) {
            $subscription->update_status('active');
        }
    }
}


```
2) "activate sub after complete order" :
```
add_action( 'woocommerce_order_status_completed', 'nh_activate_subscription_on_order_paid' );

function nh_activate_subscription_on_order_paid( $order_id ) {
    if ( ! function_exists( 'wcs_get_subscriptions_for_order' ) ) {
        return;
    }

    $subscriptions = wcs_get_subscriptions_for_order( $order_id );

    foreach ( $subscriptions as $subscription ) {
        if ( $subscription->has_status( 'pending' ) ) {
            $subscription->update_status( 'active', 'Оплата получена, подписка активирована.' );
        }
    }
}
```