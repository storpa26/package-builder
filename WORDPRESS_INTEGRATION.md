# WordPress Integration Setup for Guest Users

## Problem

The cart functionality works for admin users but fails for guest users in incognito/anonymous mode due to authentication and CORS issues.

## Solution Applied

### 1. Enhanced API Authentication

- Added proper session initialization for guest users
- Implemented automatic retry mechanism for authentication failures
- Added comprehensive logging for debugging

### 2. Session Handling Improvements

- Proper `credentials: 'include'` for session cookies
- Automatic cart token and nonce management
- Session reinitialization on auth failures

### 3. Error Handling & Fallbacks

- Detailed error logging to identify specific issues
- Fallback to product page redirect when cart fails
- User-friendly error messages with suggested actions

## Required WordPress/WooCommerce Configuration

To complete the fix, ensure these settings on your WordPress backend:

### 1. CORS Headers

Add to your theme's `functions.php` or a custom plugin:

```php
// Allow CORS for WooCommerce Store API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-WC-Store-API-Nonce, Cart-Token');
        header('Access-Control-Allow-Credentials: true');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        return $value;
    });
});

// Ensure Store API nonces work for guests
add_filter('woocommerce_store_api_disable_nonce_check', '__return_true');
```

### 2. Guest Cart Sessions

Ensure WooCommerce allows guest carts:

```php
// Enable guest checkout and cart sessions
add_filter('woocommerce_checkout_registration_required', '__return_false');
add_filter('woocommerce_enable_guest_checkout', '__return_true');
```

### 3. Store API Configuration

In WooCommerce settings:

- Enable "Store API" under WooCommerce > Settings > Advanced > REST API
- Allow guest checkout in WooCommerce > Settings > Accounts & Privacy

## Testing

1. Test in incognito browser window
2. Check browser console for detailed logging
3. Verify cart operations work for anonymous users
4. Confirm session tokens are being generated properly

## Debug Information

The enhanced code now logs:

- Session initialization attempts
- Cart token and nonce updates
- Detailed error messages with HTTP status codes
- User agent and origin information for debugging

Check the browser console for these logs when troubleshooting.
