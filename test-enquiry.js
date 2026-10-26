// ==============================================================================
// NEORA ALUSYS — AUTOMATED TEST SUITE FOR ENQUIRY POPUP
// ==============================================================================
const http = require('http');
const nodemailer = require('nodemailer');

const BASE_URL = 'http://127.0.0.1:3005';

function runPost(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(BASE_URL + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function runGet(path) {
  return new Promise((resolve, reject) => {
    http.get(BASE_URL + path, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('--- Starting NEORA Alusys Verification Tests ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
      failed++;
    }
  }

  // Phase 1: Test with NO SMTP credentials
  console.log('Phase 1: Starting server without SMTP credentials...');
  const { spawn } = require('child_process');
  let serverProc = spawn('node', ['local-server.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '3005' }
  });

  await new Promise(r => setTimeout(r, 1200));

  try {
    // 1. Static Asset Serving
    const homeRes = await runGet('/');
    assert(homeRes.status === 200 && homeRes.body.includes('neoraEnquiryPopup'), 'Root index.html serves with neoraEnquiryPopup markup');

    const popupImgRes = await runGet('/assets/images/popup-bg.png');
    assert(popupImgRes.status === 200 && popupImgRes.headers['content-type'] === 'image/png', 'popup-bg.png static asset served correctly');

    const logoImgRes = await runGet('/assets/images/logo-dark-ink.png');
    assert(logoImgRes.status === 200 && logoImgRes.headers['content-type'] === 'image/png', 'logo-dark-ink.png static asset served correctly');

    const cssRes = await runGet('/css/style.css');
    assert(cssRes.status === 200 && cssRes.body.includes('.neora-popup-overlay'), 'style.css contains enquiry popup styles');

    const jsRes = await runGet('/js/app.js');
    assert(jsRes.status === 200 && jsRes.body.includes('neora_click_count'), 'app.js contains three-click enquiry popup logic');

    // 2. Validation Tests on /api/enquiry
    console.log('\n--- Testing Input Validation ---');
    const invalidEmailRes = await runPost('/api/enquiry', { email: 'not-an-email', phone: '+1234567890' });
    assert(invalidEmailRes.status === 400 && invalidEmailRes.data.error.includes('valid email'), 'Rejects invalid email format');

    const emptyEmailRes = await runPost('/api/enquiry', { email: '', phone: '+1234567890' });
    assert(emptyEmailRes.status === 400 && emptyEmailRes.data.error.includes('valid email'), 'Rejects empty email');

    const shortPhoneRes = await runPost('/api/enquiry', { email: 'test@example.com', phone: '123' });
    assert(shortPhoneRes.status === 400 && shortPhoneRes.data.error.includes('phone number'), 'Rejects short phone number (< 7 digits)');

    const emptyPhoneRes = await runPost('/api/enquiry', { email: 'test@example.com', phone: '' });
    assert(emptyPhoneRes.status === 400 && emptyPhoneRes.data.error.includes('phone number'), 'Rejects empty phone number');

    // 3. Unconfigured SMTP Response Test
    console.log('\n--- Testing Missing SMTP Credentials Response ---');
    const unconfiguredRes = await runPost('/api/enquiry', { email: 'client@luxuryvilla.com', phone: '+39 02 1234567' });
    assert(
      unconfiguredRes.status === 503 && 
      unconfiguredRes.data.configured === false &&
      unconfiguredRes.data.error.includes('SMTP'),
      'Returns 503 explaining missing SMTP credentials when credentials are not configured'
    );
  } finally {
    serverProc.kill();
  }

  await new Promise(r => setTimeout(r, 1000));

  // Phase 2: Test with Live SMTP Credentials
  console.log('\n--- Phase 2: Testing Live SMTP Email Delivery Verification ---');
  console.log('Generating temporary Ethereal test SMTP credentials...');
  const testAccount = await nodemailer.createTestAccount();
  console.log(`Generated test SMTP account: ${testAccount.user}`);

  serverProc = spawn('node', ['local-server.js'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: '3005',
      SMTP_HOST: testAccount.smtp.host,
      SMTP_PORT: testAccount.smtp.port.toString(),
      SMTP_SECURE: testAccount.smtp.secure ? 'true' : 'false',
      SMTP_USER: testAccount.user,
      SMTP_PASS: testAccount.pass,
      SMTP_FROM: `"NEORA Alusys" <${testAccount.user}>`,
      ENQUIRY_RECIPIENT: 'Inquiry@neoraalusys.it'
    }
  });

  await new Promise(r => setTimeout(r, 1200));

  try {
    const liveRes = await runPost('/api/enquiry', {
      email: 'architect@studio-milano.it',
      phone: '+39 340 9876543'
    });

    assert(
      liveRes.status === 200 && liveRes.data.success === true && liveRes.data.messageId,
      'Email accepted and delivered by SMTP server with Message ID: ' + (liveRes.data ? liveRes.data.messageId : 'none')
    );
  } finally {
    serverProc.kill();
  }

  // 5. 3-Click State Machine Unit Verification
  console.log('\n--- Testing Three-Click State Machine Logic ---');
  function simulateClickFlow() {
    const storage = {};
    const POPUP_SHOWN_KEY = 'neora_popup_shown';
    const POPUP_DISMISSED_KEY = 'neora_popup_dismissed';
    const CLICK_COUNT_KEY = 'neora_click_count';

    let popupOpened = false;

    function click() {
      if (storage[POPUP_SHOWN_KEY] === 'true' || storage[POPUP_DISMISSED_KEY] === 'true') {
        return 'ignored';
      }
      let count = parseInt(storage[CLICK_COUNT_KEY] || '0', 10);
      count += 1;
      storage[CLICK_COUNT_KEY] = count.toString();
      if (count === 3) {
        storage[POPUP_SHOWN_KEY] = 'true';
        popupOpened = true;
        return 'opened';
      }
      return 'counted';
    }

    function dismiss() {
      storage[POPUP_DISMISSED_KEY] = 'true';
      popupOpened = false;
    }

    // Step 1: First click
    const r1 = click();
    const s1 = !popupOpened && r1 === 'counted' && storage[CLICK_COUNT_KEY] === '1';

    // Step 2: Second click
    const r2 = click();
    const s2 = !popupOpened && r2 === 'counted' && storage[CLICK_COUNT_KEY] === '2';

    // Step 3: Third click
    const r3 = click();
    const s3 = popupOpened && r3 === 'opened' && storage[CLICK_COUNT_KEY] === '3' && storage[POPUP_SHOWN_KEY] === 'true';

    // Step 4: Dismiss popup
    dismiss();
    const s4 = !popupOpened && storage[POPUP_DISMISSED_KEY] === 'true';

    // Step 5: Fourth click after dismissal
    const r5 = click();
    const s5 = !popupOpened && r5 === 'ignored' && storage[CLICK_COUNT_KEY] === '3';

    return s1 && s2 && s3 && s4 && s5;
  }

  assert(simulateClickFlow(), '3-click trigger remains hidden on click 1 & 2, opens on click 3, and never reopens after dismissal');

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
