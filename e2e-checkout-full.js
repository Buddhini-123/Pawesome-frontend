/**
 * Full checkout E2E test — COD + Card payment
 * Tests all parameters, API calls, and UI transitions
 *
 * Run: node e2e-checkout-full.js
 * Requires: npm install playwright (or npx playwright install)
 */
const { chromium } = require('playwright');

const BASE = 'http://localhost:3000';
const API  = 'http://127.0.0.1:8000/api';

const log   = (msg) => console.log(`\n[${ts()}] ── ${msg}`);
const pass  = (msg) => console.log(`  ✅ ${msg}`);
const fail  = (msg) => console.log(`  ❌ ${msg}`);
const warn  = (msg) => console.log(`  ⚠️  ${msg}`);
const info  = (msg) => console.log(`  ℹ  ${msg}`);
const ts    = ()    => new Date().toISOString().substr(11, 8);

// ── Demo auth state ────────────────────────────────────────────────
const DEMO_USER = {
  id: 'demo-user-1',
  email: 'demo@pawsome.com',
  name: 'Demo User',
  phone: '0712345678',
  role: 'user',
  loyaltyCardId: 'lc-001',
  pets: [],
  addresses: [
    {
      id: 'addr-1',
      type: 'home',
      fullName: 'Demo User',
      phone: '0712345678',
      address: '123 Galle Road',
      street: '123 Galle Road',
      city: 'Colombo',
      state: 'Western Province',
      pincode: '10100',
      country: 'Sri Lanka',
      isDefault: true
    }
  ],
  createdAt: new Date().toISOString()
};
const DEMO_TOKEN = 'demo-mock-token-12345';

const CART_ITEM = {
  id: 'cart-test-1',
  product: {
    id: 'prod-test-1',
    name: 'Royal Canin Adult Dog Food',
    price: 3500,
    image: '/placeholder.png',
    brand: 'Royal Canin',
    category: 'dog',
    inStock: true
  },
  quantity: 2
};

// ── API call collector ─────────────────────────────────────────────
const apiCalls = [];

// ── Helpers ────────────────────────────────────────────────────────
async function injectAuthAndCart(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ user, token, cart }) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('cart', JSON.stringify(cart));
  }, { user: DEMO_USER, token: DEMO_TOKEN, cart: [CART_ITEM] });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
}

async function verifyCartHasItems(page) {
  await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const text = await page.textContent('body');
  const empty = text.toLowerCase().includes('cart is empty') || text.toLowerCase().includes('your cart is empty');
  if (!empty) pass('Cart has items');
  else fail('Cart is empty — localStorage cart not persisted');
  return !empty;
}

async function navigateToCheckout(page) {
  // Try checkout button first
  const btn = page.locator('a[href*="/checkout"], button').filter({ hasText: /checkout|proceed/i }).first();
  if (await btn.count() > 0) {
    await btn.click();
    await page.waitForURL(url => url.href.includes('/checkout'), { timeout: 8000 }).catch(() => {});
  } else {
    await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle' });
  }
  await page.waitForTimeout(1500);
  pass(`Checkout URL: ${page.url()}`);
}

async function fillShippingStep(page, useCustom = true) {
  log('Filling Shipping Step...');

  if (useCustom) {
    // Switch to custom address entry
    const dropdown = page.locator('select').first();
    if (await dropdown.count() > 0) {
      const opts = await dropdown.evaluate(sel => Array.from(sel.options).map(o => o.value));
      info(`Address dropdown options: ${opts.join(', ')}`);
      if (opts.includes('custom')) {
        await dropdown.selectOption('custom');
        await page.waitForTimeout(600);
        pass('Switched to custom address entry');
      } else {
        info(`No "custom" option found (options: ${opts.join(', ')}) — trying to find custom toggle`);
        // Maybe it's a radio/button toggle
        const customToggle = page.locator('button, label').filter({ hasText: /new address|custom|add new/i }).first();
        if (await customToggle.count() > 0) {
          await customToggle.click();
          await page.waitForTimeout(600);
          pass('Switched to custom address via toggle');
        }
      }
    }
  }

  // Full name
  const nameInput = page.locator('input[placeholder*="name" i], input[name*="name" i]').first();
  if (await nameInput.count() > 0) {
    await nameInput.clear();
    await nameInput.fill('Test Shopper');
    pass('Full name filled');
  } else {
    fail('Full name input not found');
  }

  // Phone
  const phoneInput = page.locator('input[type="tel"], input[placeholder*="07" i], input[placeholder*="phone" i], input[name*="phone" i]').first();
  if (await phoneInput.count() > 0) {
    await phoneInput.clear();
    await phoneInput.fill('0712345678');
    pass('Phone filled');
  } else {
    fail('Phone input not found');
  }

  // Address line
  const addrInput = page.locator('textarea[placeholder*="address" i], input[placeholder*="address" i], textarea').first();
  if (await addrInput.count() > 0) {
    await addrInput.clear();
    await addrInput.fill('123 Galle Road');
    pass('Address filled');
  } else {
    warn('Address input not found');
  }

  // City
  const cityInput = page.locator('input[placeholder*="Colombo" i], input[placeholder*="city" i], input[name*="city" i]').first();
  if (await cityInput.count() > 0) {
    await cityInput.clear();
    await cityInput.fill('Colombo');
    pass('City filled');
  } else {
    warn('City input not found');
  }

  // State/Province
  const stateInput = page.locator('input[placeholder*="Western" i], input[placeholder*="province" i], input[placeholder*="state" i], input[name*="state" i]').first();
  if (await stateInput.count() > 0) {
    await stateInput.clear();
    await stateInput.fill('Western Province');
    pass('Province filled');
  } else {
    warn('Province input not found');
  }

  // Postal code
  const postalInput = page.locator('input[placeholder*="10100" i], input[placeholder*="postal" i], input[placeholder*="pincode" i], input[name*="pincode" i]').first();
  if (await postalInput.count() > 0) {
    await postalInput.clear();
    await postalInput.fill('10100');
    pass('Postal code filled');
  } else {
    warn('Postal code input not found');
  }

  await page.screenshot({ path: 'test-step1-shipping.png' });
  info('Screenshot: test-step1-shipping.png');

  // Click Continue
  const continueBtn = page.locator('button').filter({ hasText: /^continue$/i }).first();
  if (await continueBtn.count() > 0) {
    await continueBtn.click();
    await page.waitForTimeout(2000);

    const errors = await page.locator('[class*="text-red"], .text-red-500').allTextContents();
    const visibleErrors = errors.map(e => e.trim()).filter(Boolean);
    if (visibleErrors.length > 0) {
      fail(`Step 1 validation errors:\n${visibleErrors.map(e => '    ' + e).join('\n')}`);
      return false;
    }
    pass('Step 1 → Step 2 (payment)');
    return true;
  } else {
    fail('"Continue" button not found on shipping step');
    return false;
  }
}

async function selectPaymentMethod(page, method) {
  log(`Selecting payment method: ${method}...`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `test-step2-payment-${method}.png` });

  // Check what payment options are rendered
  const radioInputs = await page.locator('input[type="radio"]').all();
  const radioValues = [];
  for (const r of radioInputs) {
    const v = await r.getAttribute('value').catch(() => null);
    const checked = await r.isChecked().catch(() => false);
    radioValues.push(`${v}(${checked ? 'checked' : 'unchecked'})`);
  }
  info(`Payment radio inputs: ${radioValues.join(', ') || 'none found'}`);

  if (method === 'cod') {
    const codRadio = page.locator('input[value="cod"]').first();
    if (await codRadio.count() > 0) {
      await codRadio.click({ force: true });
      await page.waitForTimeout(400);
      const checked = await codRadio.isChecked();
      if (checked) pass('COD selected (radio checked)');
      else warn('COD radio click did not check it — trying label');
    }

    // Also try label click as fallback
    const codLabel = page.locator('label').filter({ hasText: /cash on delivery/i }).first();
    if (await codLabel.count() > 0) {
      await codLabel.click();
      await page.waitForTimeout(300);
      pass('COD label clicked');
    }
  } else if (method === 'card') {
    const cardRadio = page.locator('input[value="card"]').first();
    if (await cardRadio.count() > 0) {
      await cardRadio.click({ force: true });
      await page.waitForTimeout(400);
      const checked = await cardRadio.isChecked();
      pass(`Card radio checked: ${checked}`);
    } else {
      const cardLabel = page.locator('label').filter({ hasText: /credit|debit|card/i }).first();
      if (await cardLabel.count() > 0) {
        await cardLabel.click();
        pass('Card label clicked');
      } else {
        warn('Card payment option not found');
      }
    }
  }

  const continueBtn = page.locator('button').filter({ hasText: /^continue$/i }).first();
  if (await continueBtn.count() > 0) {
    await continueBtn.click();
    await page.waitForTimeout(1800);
    pass('Payment step → Review step');
    return true;
  } else {
    fail('"Continue" button not found on payment step');
    return false;
  }
}

async function auditReviewStep(page, expectedPayment) {
  log('Auditing review step parameters...');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'test-step3-review.png' });

  const bodyText = await page.textContent('body');

  // ── Check items ──
  if (bodyText.includes('Royal Canin') || bodyText.includes('Dog Food')) {
    pass('Order item visible in review');
  } else {
    fail('Cart item NOT visible in review step — item name not found');
  }

  // ── Check address ──
  const addressPresent = bodyText.includes('Colombo') || bodyText.includes('Galle');
  if (addressPresent) pass('Shipping address fields visible in review');
  else warn('Shipping address not visible in review (may use saved address)');

  // ── Check payment method ──
  const paymentText = bodyText.toLowerCase();
  if (expectedPayment === 'cod') {
    if (paymentText.includes('cash on delivery') || paymentText.includes('cod')) {
      pass('COD payment method shown in review');
    } else {
      fail(`Expected COD in review but not found. Payment area text snippet:\n    ${bodyText.substring(bodyText.toLowerCase().indexOf('payment'), bodyText.toLowerCase().indexOf('payment') + 200).replace(/\s+/g, ' ')}`);
    }
  } else {
    if (paymentText.includes('card') || paymentText.includes('online')) {
      pass('Card payment method shown in review');
    } else {
      warn('Card payment label not explicitly found in review text');
    }
  }

  // ── Check price fields ──
  const hasSubtotal = bodyText.includes('Subtotal') || bodyText.includes('subtotal');
  const hasShipping = bodyText.includes('Shipping') || bodyText.includes('shipping');
  const hasTotal    = bodyText.includes('Total') || bodyText.includes('total');
  if (hasSubtotal) pass('Subtotal label present');
  else warn('Subtotal label not found');
  if (hasShipping) pass('Shipping label present');
  else warn('Shipping label not found');
  if (hasTotal) pass('Total label present');
  else warn('Total label not found');

  // ── Check Place Order button ──
  const placeBtn = page.locator('button').filter({ hasText: /place order/i }).first();
  const count = await placeBtn.count();
  if (count > 0) {
    const disabled = await placeBtn.isDisabled();
    if (!disabled) pass('"Place Order" button enabled');
    else fail('"Place Order" button is disabled');
  } else {
    fail('"Place Order" button NOT found');
    const allBtns = await page.locator('button').allTextContents();
    info(`Visible buttons: ${allBtns.join(' | ')}`);
  }

  return count > 0;
}

async function placeOrderAndCapture(page, method, jsErrors) {
  log(`Placing order (${method})...`);
  const placeBtn = page.locator('button').filter({ hasText: /place order/i }).first();
  if (await placeBtn.count() === 0) {
    fail('"Place Order" not found — cannot proceed');
    return false;
  }

  const errsBefore = jsErrors.length;
  await placeBtn.click();
  await page.waitForTimeout(4500);

  const finalUrl = page.url();
  info(`URL after Place Order: ${finalUrl}`);
  await page.screenshot({ path: `test-step4-result-${method}.png` });

  let success = false;

  if (method === 'cod') {
    if (finalUrl.includes('/order-confirmation')) {
      const confirmText = await page.textContent('body');
      pass('🎉 COD ORDER PLACED — on order-confirmation page');
      info(`Confirmation snippet: ${confirmText.substring(0, 400).replace(/\s+/g, ' ')}`);
      success = true;

      // Check confirmation page parameters
      if (confirmText.includes('Order') || confirmText.includes('order')) pass('Order reference present on confirmation');
      else warn('No order reference visible on confirmation page');
    } else if (finalUrl.includes('/checkout')) {
      const errorEls = await page.locator('[class*="text-red"], .text-red-500, [class*="alert"]').allTextContents();
      const toasts   = await page.locator('[class*="Toastify"], [class*="toast"]').allTextContents();
      if (errorEls.length > 0) fail(`COD order failed:\n${errorEls.filter(Boolean).map(e => '    ' + e.trim()).join('\n')}`);
      else if (toasts.length > 0) info(`Toast message: ${toasts.join(' | ')}`);
      else fail('Still on checkout — no visible error. Check screenshot test-step4-result-cod.png');
    } else {
      info(`Unexpected redirect: ${finalUrl}`);
    }
  } else if (method === 'card') {
    // For card payment, we expect either:
    // a) redirect to PayHere (payhere.lk or sandbox.payhere.lk)
    // b) redirect failed and we're still on /checkout with an error
    if (finalUrl.includes('payhere.lk') || finalUrl.includes('sandbox.payhere.lk')) {
      pass('🎉 CARD PAYMENT — redirected to PayHere gateway');
      info(`PayHere URL: ${finalUrl}`);
      success = true;
    } else if (finalUrl.includes('/checkout')) {
      // Could be an intentional PayHere form POST redirect or an error
      const errorEls = await page.locator('[class*="text-red"], .text-red-500, [class*="alert"]').allTextContents();
      const toasts   = await page.locator('[class*="Toastify"], [class*="toast"]').allTextContents();
      if (errorEls.length > 0) {
        fail(`Card payment failed with error:\n${errorEls.filter(Boolean).map(e => '    ' + e.trim()).join('\n')}`);
      } else if (toasts.length > 0) {
        info(`Toast on card payment: ${toasts.join(' | ')}`);
        fail('Card payment: still on checkout page with toast (order may not have created)');
      } else {
        fail('Card payment: still on checkout — no error message found. Check screenshot.');
      }
    } else {
      info(`Card payment redirected to: ${finalUrl}`);
      // Could be order-confirmation if backend treats card as success immediately
      if (finalUrl.includes('/order-confirmation')) {
        pass('Card payment: order confirmation page reached');
        success = true;
      }
    }
  }

  const newErrors = jsErrors.slice(errsBefore);
  if (newErrors.length > 0) {
    fail(`JS errors during Place Order:\n${newErrors.map(e => '    ' + e).join('\n')}`);
  } else {
    pass('No new JS errors during Place Order');
  }

  return success;
}

function summarizeApiCalls() {
  log('─── API CALLS INTERCEPTED ───────────────────────────────────');
  if (apiCalls.length === 0) {
    info('No API calls captured (backend may be offline)');
    return;
  }

  const interesting = [
    '/orders',
    '/payment/initiate',
    '/users/addresses',
    '/pricing/calculate',
    '/cart',
    '/loyalty',
    '/auth'
  ];

  const grouped = {};
  for (const call of apiCalls) {
    const key = interesting.find(k => call.url.includes(k)) || 'other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(call);
  }

  for (const [group, calls] of Object.entries(grouped)) {
    console.log(`\n  📡 ${group} (${calls.length} calls):`);
    for (const c of calls) {
      const status = c.status || '?';
      const ok = status >= 200 && status < 300 ? '✅' : '❌';
      console.log(`     ${ok} [${c.method}] ${c.url} → ${status}`);
      if (c.requestBody) {
        try {
          const body = typeof c.requestBody === 'string' ? JSON.parse(c.requestBody) : c.requestBody;
          console.log(`        Request body: ${JSON.stringify(body, null, 0).substring(0, 300)}`);
        } catch {}
      }
      if (c.responseBody && status >= 400) {
        try {
          const body = typeof c.responseBody === 'string' ? JSON.parse(c.responseBody) : c.responseBody;
          console.log(`        Error response: ${JSON.stringify(body, null, 0).substring(0, 300)}`);
        } catch {}
      }
    }
  }
}

// ══════════════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════════════
(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 280 });

  const issues = [];

  // ──────────────────────────────────────────────────────────────
  // TEST 1: COD flow
  // ──────────────────────────────────────────────────────────────
  {
    log('══════════ TEST 1: CASH ON DELIVERY ══════════');
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const jsErrors = [];

    page.on('console', msg => { if (msg.type() === 'error') jsErrors.push(`[console.error] ${msg.text()}`); });
    page.on('pageerror', err => jsErrors.push(`[pageerror] ${err.message}`));

    // Intercept API calls
    page.on('request', req => {
      if (req.url().includes('127.0.0.1') || req.url().includes('/api/')) {
        apiCalls.push({ method: req.method(), url: req.url(), requestBody: req.postData() || null, status: null, responseBody: null });
      }
    });
    page.on('response', async res => {
      if (res.url().includes('127.0.0.1') || res.url().includes('/api/')) {
        const entry = apiCalls.slice().reverse().find(c => c.url === res.url() && c.status === null);
        if (entry) {
          entry.status = res.status();
          entry.responseBody = await res.text().catch(() => null);
        }
      }
    });

    try {
      await injectAuthAndCart(page);
      const hasItems = await verifyCartHasItems(page);
      if (!hasItems) issues.push('COD: Cart empty — localStorage persistence broken');

      await navigateToCheckout(page);

      // Verify redirect guard (should NOT redirect to /cart while processing)
      const currentUrl = page.url();
      if (!currentUrl.includes('/checkout')) {
        issues.push(`COD: Unexpected redirect from checkout: ${currentUrl}`);
        fail(`Not on checkout! On: ${currentUrl}`);
      }

      const step1Ok = await fillShippingStep(page, true);
      if (!step1Ok) issues.push('COD: Shipping step validation failed');

      const step2Ok = await selectPaymentMethod(page, 'cod');
      if (!step2Ok) issues.push('COD: Could not proceed past payment step');

      const hasPlaceOrder = await auditReviewStep(page, 'cod');
      if (!hasPlaceOrder) issues.push('COD: "Place Order" button missing or disabled on review step');

      const codOk = await placeOrderAndCapture(page, 'cod', jsErrors);
      if (!codOk) issues.push('COD: Order placement failed or wrong redirect');

    } catch (err) {
      fail(`COD test exception: ${err.message}`);
      console.error(err.stack);
      issues.push(`COD exception: ${err.message}`);
      await page.screenshot({ path: 'test-cod-exception.png' }).catch(() => {});
    }

    await ctx.close();
  }

  await new Promise(r => setTimeout(r, 1500));

  // ──────────────────────────────────────────────────────────────
  // TEST 2: Card / Online Payment flow
  // ──────────────────────────────────────────────────────────────
  {
    log('══════════ TEST 2: CARD / ONLINE PAYMENT ══════════');
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const jsErrors = [];

    page.on('console', msg => { if (msg.type() === 'error') jsErrors.push(`[console.error] ${msg.text()}`); });
    page.on('pageerror', err => jsErrors.push(`[pageerror] ${err.message}`));

    page.on('request', req => {
      if (req.url().includes('127.0.0.1') || req.url().includes('/api/')) {
        apiCalls.push({ method: req.method(), url: req.url(), requestBody: req.postData() || null, status: null, responseBody: null });
      }
    });
    page.on('response', async res => {
      if (res.url().includes('127.0.0.1') || res.url().includes('/api/')) {
        const entry = apiCalls.slice().reverse().find(c => c.url === res.url() && c.status === null);
        if (entry) {
          entry.status = res.status();
          entry.responseBody = await res.text().catch(() => null);
        }
      }
    });

    // Intercept PayHere form submission so we don't actually leave the site
    // We'll check if the form is built correctly instead
    let payhereFormData = null;
    page.on('request', req => {
      if (req.url().includes('payhere.lk') || req.url().includes('payhere')) {
        payhereFormData = { url: req.url(), method: req.method() };
        info(`PayHere form submitted → ${req.url()}`);
      }
    });

    try {
      await injectAuthAndCart(page);
      const hasItems = await verifyCartHasItems(page);
      if (!hasItems) issues.push('Card: Cart empty — localStorage persistence broken');

      await navigateToCheckout(page);

      const step1Ok = await fillShippingStep(page, true);
      if (!step1Ok) issues.push('Card: Shipping step validation failed');

      // Step 2 — leave on card (default) or explicitly select card
      log('Selecting card payment...');
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-step2-payment-card.png' });

      // Check if card is already selected (it's the default)
      const cardRadio = page.locator('input[value="card"]').first();
      if (await cardRadio.count() > 0) {
        const checked = await cardRadio.isChecked();
        if (checked) {
          pass('Card payment already selected (default)');
        } else {
          await cardRadio.click({ force: true });
          await page.waitForTimeout(300);
          pass('Card payment selected');
        }
      } else {
        warn('No card radio input found — leaving default');
      }

      const continueBtn = page.locator('button').filter({ hasText: /^continue$/i }).first();
      if (await continueBtn.count() > 0) {
        await continueBtn.click();
        await page.waitForTimeout(1800);
        pass('Payment step → Review step (card)');
      } else {
        fail('"Continue" button not found on payment step (card)');
        issues.push('Card: Continue button missing on payment step');
      }

      const hasPlaceOrder = await auditReviewStep(page, 'card');
      if (!hasPlaceOrder) issues.push('Card: "Place Order" button missing or disabled on review step');

      // Intercept navigation to PayHere — stop it from actually leaving
      let payhereRedirectUrl = null;
      const navigationPromise = page.waitForNavigation({ timeout: 6000 }).catch(() => null);

      log('Clicking Place Order (card — expecting PayHere redirect)...');
      const placeBtn = page.locator('button').filter({ hasText: /place order/i }).first();
      if (await placeBtn.count() > 0) {
        const errsBefore = jsErrors.length;
        await placeBtn.click();

        // Wait a bit then check URL
        await page.waitForTimeout(4000);
        const finalUrl = page.url();
        await page.screenshot({ path: 'test-step4-result-card.png' });
        info(`URL after Place Order (card): ${finalUrl}`);

        if (finalUrl.includes('payhere.lk') || finalUrl.includes('sandbox.payhere.lk')) {
          pass('🎉 CARD PAYMENT — browser navigated to PayHere gateway!');
          payhereRedirectUrl = finalUrl;
        } else if (finalUrl.includes('/order-confirmation')) {
          pass('Card payment: reached order confirmation (backend processed immediately)');
        } else if (finalUrl.includes('/checkout')) {
          const errorEls = await page.locator('[class*="text-red"], .text-red-500, [class*="alert"], [class*="error"]').allTextContents();
          const toasts   = await page.locator('[class*="Toastify"], [class*="toast"]').allTextContents();
          const consoleSnip = jsErrors.slice(errsBefore).slice(0, 3).map(e => '    ' + e).join('\n');

          fail('Card payment: still on checkout after Place Order');
          if (errorEls.filter(Boolean).length > 0) fail(`UI errors:\n${errorEls.filter(Boolean).map(e => '    ' + e.trim()).join('\n')}`);
          if (toasts.filter(Boolean).length > 0) info(`Toasts: ${toasts.filter(Boolean).join(' | ')}`);
          if (consoleSnip) fail(`JS errors:\n${consoleSnip}`);
          issues.push(`Card: place order stayed on /checkout. Errors: ${errorEls.filter(Boolean).join('; ') || toasts.filter(Boolean).join('; ') || 'none visible'}`);
        } else {
          info(`Card payment went to: ${finalUrl}`);
        }

        const newErrors = jsErrors.slice(errsBefore);
        if (newErrors.length > 0) {
          fail(`JS errors during card Place Order:\n${newErrors.map(e => '    ' + e).join('\n')}`);
          issues.push(`Card: JS errors during place order: ${newErrors.join('; ')}`);
        } else {
          pass('No new JS errors during card Place Order');
        }
      } else {
        fail('"Place Order" not found — cannot test card payment');
        issues.push('Card: "Place Order" button missing');
      }

    } catch (err) {
      fail(`Card test exception: ${err.message}`);
      console.error(err.stack);
      issues.push(`Card exception: ${err.message}`);
      await page.screenshot({ path: 'test-card-exception.png' }).catch(() => {});
    }

    await ctx.close();
  }

  // ──────────────────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────────────────
  summarizeApiCalls();

  log('══════════ PARAMETER AUDIT ══════════');
  // Check the /orders call payload
  const orderCall = apiCalls.find(c => c.url.includes('/orders') && c.method === 'POST');
  if (orderCall) {
    info(`POST /orders → HTTP ${orderCall.status}`);
    try {
      const body = JSON.parse(orderCall.requestBody || '{}');
      console.log('\n  Order payload sent to backend:');
      console.log(JSON.stringify(body, null, 4));

      // Validate required fields
      const checks = [
        ['items',          Array.isArray(body.items) && body.items.length > 0,    'items array present and non-empty'],
        ['shippingAddress',body.shippingAddress != null,                           'shippingAddress present'],
        ['fullName',       !!body.shippingAddress?.fullName,                       'shippingAddress.fullName present'],
        ['phone',          !!body.shippingAddress?.phone,                          'shippingAddress.phone present'],
        ['city',           !!body.shippingAddress?.city,                           'shippingAddress.city present'],
        ['state',          !!body.shippingAddress?.state,                          'shippingAddress.state present'],
        ['pincode',        !!body.shippingAddress?.pincode,                        'shippingAddress.pincode present'],
        ['paymentMethod',  !!body.paymentMethod,                                   'paymentMethod present'],
        ['subtotal',       typeof body.subtotal === 'number' && body.subtotal > 0, 'subtotal > 0'],
        ['shippingCost',   typeof body.shippingCost === 'number',                  'shippingCost is number'],
        ['totalAmount',    typeof body.totalAmount === 'number' && body.totalAmount > 0, 'totalAmount > 0'],
      ];
      console.log('\n  Parameter checks:');
      for (const [key, ok, label] of checks) {
        if (ok) pass(label);
        else { fail(label); issues.push(`Param missing/invalid: ${key}`); }
      }

      // Check items structure
      if (Array.isArray(body.items)) {
        body.items.forEach((item, i) => {
          const itemOk = item.productId != null && typeof item.quantity === 'number' && typeof item.price === 'number';
          if (itemOk) pass(`Item[${i}]: productId=${item.productId}, qty=${item.quantity}, price=${item.price}`);
          else { fail(`Item[${i}] missing fields: ${JSON.stringify(item)}`); issues.push(`Item[${i}] missing fields`); }
        });
      }
    } catch (e) {
      warn(`Could not parse /orders request body: ${e.message}`);
    }
  } else {
    warn('No POST /orders call captured (backend offline or request not intercepted)');
    info('This is normal if the backend is not running — mock fallback is used');
  }

  // Check /payment/initiate call
  const paymentCall = apiCalls.find(c => c.url.includes('/payment/initiate'));
  if (paymentCall) {
    info(`POST /payment/initiate → HTTP ${paymentCall.status}`);
    try {
      const body = JSON.parse(paymentCall.requestBody || '{}');
      if (body.order_id) pass(`payment/initiate: order_id = ${body.order_id}`);
      else { fail('payment/initiate: order_id missing'); issues.push('payment/initiate missing order_id'); }
    } catch {}
    if (paymentCall.status === 401) {
      fail('payment/initiate returned 401 Unauthenticated — backend token rejected');
      issues.push('Card payment: 401 on /payment/initiate — demo token not accepted by backend');
    } else if (paymentCall.status === 200) {
      pass('payment/initiate returned 200 OK');
    }
  }

  log('══════════ ISSUES FOUND ══════════');
  if (issues.length === 0) {
    pass('No issues! Both COD and card flows completed successfully.');
  } else {
    console.log(`\n  Found ${issues.length} issue(s):\n`);
    issues.forEach((issue, i) => console.log(`  ${i + 1}. ❌ ${issue}`));
  }

  log('Tests complete — closing browser in 3s...');
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();
