const { chromium } = require('playwright');

const BASE = 'http://localhost:3000';

const log  = (msg) => console.log(`\n[${new Date().toISOString().substr(11,8)}] ── ${msg}`);
const pass = (msg) => console.log(`  ✅ ${msg}`);
const fail = (msg) => console.log(`  ❌ ${msg}`);
const info = (msg) => console.log(`  ℹ  ${msg}`);

// Demo user matching mockDb seed (auth is client-side via localStorage)
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

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 350 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Capture JS errors from the app
  const appErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') appErrors.push(msg.text());
  });
  page.on('pageerror', err => appErrors.push(`PageError: ${err.message}`));

  try {
    // ─── STEP 1: Inject auth state ───────────────────────────────────────────
    log('STEP 1: Injecting auth state into localStorage...');
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });

    await page.evaluate(({ user, token }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      // Pre-seed cart with one item so we can verify checkout
      const cartItem = {
        id: 'cart-test-1',
        product: {
          id: 'prod-test-1',
          name: 'Royal Canin Adult Dog Food',
          price: 3500,
          image: '/placeholder.png',
          brand: 'Royal Canin',
          category: 'dog'
        },
        quantity: 1
      };
      localStorage.setItem('cart', JSON.stringify([cartItem]));
    }, { user: DEMO_USER, token: DEMO_TOKEN });

    pass('Auth token and cart seeded in localStorage');

    // Reload so AuthContext picks up the state
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Verify we appear logged in (header should show user name / avatar)
    const bodyText = await page.textContent('body');
    if (bodyText.includes('Demo User') || bodyText.includes('demo@pawsome')) {
      pass('User appears logged in (name visible)');
    } else {
      info('User name not visible in header — continuing anyway');
    }

    // ─── STEP 2: Browse to a real product and add it to cart ─────────────────
    log('STEP 2: Adding a product to cart via UI...');
    await page.goto(`${BASE}/products`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Find first add-to-cart button
    const addBtns = page.locator('button').filter({ hasText: /add to cart/i });
    const addCount = await addBtns.count();
    info(`Found ${addCount} "Add to Cart" buttons on /products`);

    if (addCount > 0) {
      const firstProductName = await page.locator('[class*="font-fredoka"], h3, h2').first().textContent().catch(() => 'Unknown');
      await addBtns.first().click();
      await page.waitForTimeout(1000);
      pass(`Clicked "Add to Cart" for: ${firstProductName.trim()}`);
    } else {
      // Try navigating into a product detail page
      const productLink = page.locator('a[href*="/product/"], a[href*="/products/"]').first();
      const href = await productLink.getAttribute('href').catch(() => null);
      if (href) {
        await page.goto(`${BASE}${href}`, { waitUntil: 'networkidle' });
        const pdpBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
        if (await pdpBtn.count() > 0) {
          await pdpBtn.click();
          await page.waitForTimeout(1000);
          pass('Added product from PDP');
        } else {
          info('No Add-to-Cart on PDP either — cart seeded in localStorage will be used');
        }
      } else {
        info('No product links found — cart already seeded from localStorage');
      }
    }

    // ─── STEP 3: Verify cart ─────────────────────────────────────────────────
    log('STEP 3: Navigating to cart...');
    await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const cartBodyText = await page.textContent('body');
    const hasItems = !cartBodyText.toLowerCase().includes('cart is empty') &&
                     !cartBodyText.toLowerCase().includes('your cart is empty');

    if (hasItems) {
      pass('Cart has item(s)');
    } else {
      fail('Cart appears empty — check localStorage cart persistence');
      info('Cart body snippet: ' + cartBodyText.substring(0, 200).replace(/\s+/g, ' '));
    }

    // Find checkout button
    const checkoutLink = page.locator('a[href*="/checkout"], button').filter({ hasText: /checkout|proceed/i }).first();
    const hasCheckout = await checkoutLink.count() > 0;
    pass(hasCheckout ? 'Checkout button present' : 'No checkout button found');

    // ─── STEP 4: Go to Checkout ───────────────────────────────────────────────
    log('STEP 4: Navigating to Checkout...');
    if (hasCheckout) {
      await checkoutLink.click();
      await page.waitForURL(url => url.href.includes('/checkout'), { timeout: 8000 });
    } else {
      await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle' });
    }
    await page.waitForTimeout(1500);
    pass(`On checkout: ${page.url()}`);

    // ─── STEP 5: Step 1 — Shipping ───────────────────────────────────────────
    log('STEP 5: Checkout Step 1 — Shipping Information...');

    // Check which address UI is shown
    const addressDropdown = page.locator('select').first();
    const dropdownCount = await addressDropdown.count();

    if (dropdownCount > 0) {
      const currentVal = await addressDropdown.inputValue();
      info(`Address dropdown present, current value: "${currentVal}"`);
      // Switch to custom so we control all fields
      try {
        await addressDropdown.selectOption('custom');
        pass('Switched to custom address entry');
        await page.waitForTimeout(600);
      } catch (e) {
        info('Could not select custom — using select mode');
      }
    }

    // Full name
    const nameInput = page.locator('input').filter({ has: page.locator('[placeholder*="name" i]') })
      .or(page.locator('input[placeholder*="name" i]'))
      .first();
    if (await nameInput.count() > 0) {
      await nameInput.clear();
      await nameInput.fill('Test Shopper');
      pass('Full name: "Test Shopper"');
    }

    // Phone
    const phoneInput = page.locator('input[type="tel"]').or(page.locator('input[placeholder*="07" i]')).first();
    if (await phoneInput.count() > 0) {
      await phoneInput.clear();
      await phoneInput.fill('0712345678');
      pass('Phone: "0712345678"');
    }

    // Address textarea
    const addrTextarea = page.locator('textarea').first();
    if (await addrTextarea.count() > 0) {
      await addrTextarea.clear();
      await addrTextarea.fill('123 Galle Road, Colombo 03');
      pass('Address filled');
    }

    // City
    const cityInput = page.locator('input[placeholder*="Colombo" i]').or(page.locator('input[placeholder*="city" i]')).first();
    if (await cityInput.count() > 0) {
      await cityInput.clear();
      await cityInput.fill('Colombo');
      pass('City: "Colombo"');
    }

    // Province
    const stateInput = page.locator('input[placeholder*="Western" i]').or(page.locator('input[placeholder*="province" i]')).first();
    if (await stateInput.count() > 0) {
      await stateInput.clear();
      await stateInput.fill('Western Province');
      pass('Province: "Western Province"');
    }

    // Postal code
    const postalInput = page.locator('input[placeholder*="10100" i]').or(page.locator('input[placeholder*="postal" i]')).first();
    if (await postalInput.count() > 0) {
      await postalInput.clear();
      await postalInput.fill('10100');
      pass('Postal code: "10100"');
    }

    await page.waitForTimeout(500);

    // Screenshot before Continue
    await page.screenshot({ path: 'test-step1-shipping.png', fullPage: false });
    info('Screenshot saved: test-step1-shipping.png');

    // Click Continue
    const continueBtn = page.locator('button').filter({ hasText: /^continue$/i }).first();
    if (await continueBtn.count() > 0) {
      await continueBtn.click();
      await page.waitForTimeout(1800);

      // Look for field errors
      const fieldErrors = await page.locator('[class*="text-red"], p.text-red-500, .text-red-500').allTextContents();
      if (fieldErrors.length > 0) {
        fail(`Validation errors on Step 1:\n${fieldErrors.map(e => '    ' + e.trim()).filter(Boolean).join('\n')}`);
      } else {
        pass('Step 1 validation passed — moved to Step 2');
      }
    }

    // ─── STEP 6: Step 2 — Payment ────────────────────────────────────────────
    log('STEP 6: Checkout Step 2 — Payment Method...');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-step2-payment.png', fullPage: false });
    info('Screenshot saved: test-step2-payment.png');

    // Select COD — force-click the hidden radio input directly
    const codRadio = page.locator('input[value="cod"]').first();
    if (await codRadio.count() > 0) {
      await codRadio.click({ force: true });
      await page.waitForTimeout(300);
      const isChecked = await codRadio.isChecked();
      pass(`Selected COD via radio (checked: ${isChecked})`);
    } else {
      // Fallback: click the label that contains "Cash on Delivery"
      const codLabel = page.locator('label').filter({ hasText: /cash on delivery/i }).first();
      if (await codLabel.count() > 0) {
        await codLabel.click();
        pass('Selected COD via label click');
      } else {
        info('COD option not found — leaving current selection (card)');
      }
    }

    await page.waitForTimeout(500);
    const continueBtn2 = page.locator('button').filter({ hasText: /^continue$/i }).first();
    if (await continueBtn2.count() > 0) {
      await continueBtn2.click();
      await page.waitForTimeout(1800);
      pass('Clicked Continue — moved to Step 3');
    }

    // ─── STEP 7: Step 3 — Review ─────────────────────────────────────────────
    log('STEP 7: Checkout Step 3 — Order Review...');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-step3-review.png', fullPage: false });
    info('Screenshot saved: test-step3-review.png');

    const reviewText = await page.textContent('body');
    info('Review page content: ' + reviewText.substring(0, 400).replace(/\s+/g, ' '));

    // Confirm "Place Order" button is visible and enabled
    const placeOrderBtn = page.locator('button').filter({ hasText: /place order/i }).first();
    const placeOrderCount = await placeOrderBtn.count();

    if (placeOrderCount === 0) {
      fail('"Place Order" button NOT found on review step');
      const allBtns = await page.locator('button').allTextContents();
      info('Visible buttons: ' + allBtns.join(' | '));
    } else {
      const isDisabled = await placeOrderBtn.isDisabled();
      pass(`"Place Order" button found (disabled: ${isDisabled})`);

      if (isDisabled) {
        fail('Button is disabled — cannot place order');
      } else {
        // ─── STEP 8: Place Order ─────────────────────────────────────────────
        log('STEP 8: Clicking "Place Order"...');
        const errCountBefore = appErrors.length;
        await placeOrderBtn.click();
        await page.waitForTimeout(3500);

        const finalUrl = page.url();
        info(`URL after Place Order: ${finalUrl}`);

        await page.screenshot({ path: 'test-step4-result.png', fullPage: false });
        info('Screenshot saved: test-step4-result.png');

        if (finalUrl.includes('/order-confirmation')) {
          pass('🎉 ORDER PLACED SUCCESSFULLY — on order confirmation page!');
          const confirmText = await page.textContent('body');
          info('Confirmation content: ' + confirmText.substring(0, 500).replace(/\s+/g, ' '));
        } else if (finalUrl.includes('/checkout')) {
          // Still on checkout — capture error
          const errorEls = await page.locator(
            '[class*="text-red"], p.text-red-500, [class*="coral-red"], [class*="alert"]'
          ).allTextContents();
          const toastEls = await page.locator('[class*="Toastify"], [class*="toast"]').allTextContents();

          if (errorEls.length > 0) {
            fail('Order placement FAILED. Error shown:\n' + errorEls.map(e => '    ' + e.trim()).filter(Boolean).join('\n'));
          } else if (toastEls.length > 0) {
            info('Toast message: ' + toastEls.join(' | '));
          } else {
            fail('Still on checkout — no visible error message. Check screenshots.');
          }
        } else {
          info(`Redirected to unexpected URL: ${finalUrl}`);
        }

        // New JS errors since clicking Place Order
        const newErrors = appErrors.slice(errCountBefore);
        if (newErrors.length > 0) {
          fail('JS errors during order placement:\n' + newErrors.map(e => '    ' + e).join('\n'));
        } else {
          pass('No new JS errors during order placement');
        }
      }
    }

  } catch (err) {
    fail(`Test exception: ${err.message}`);
    console.error(err.stack);
    await page.screenshot({ path: 'test-exception.png', fullPage: false }).catch(() => {});
  } finally {
    log('─── ALL JS ERRORS CAPTURED ─────────────────────────────────');
    if (appErrors.length === 0) {
      console.log('  (none)');
    } else {
      appErrors.forEach(e => console.log('  ⚠  ' + e));
    }

    log('Test finished — closing in 4s...');
    await page.waitForTimeout(4000);
    await browser.close();
  }
})();
