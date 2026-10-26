const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Load environment variables from .env if present
const ROOT = __dirname;
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            let val = trimmed.slice(idx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    } catch (e) {
      console.warn('Notice: Could not parse .env file:', e.message);
    }
  }
}
loadEnv();

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

const server = http.createServer((req, res) => {
  let cleanUrl = decodeURI(req.url.split('?')[0]);
  console.log(`${new Date().toISOString()} [${req.method}] ${cleanUrl}`);

  // Handle API: Enquiry Submission
  if (cleanUrl === '/api/enquiry') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json', 'Allow': 'POST' });
      res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 65536) { // 64KB max
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Payload too large' }));
        req.destroy();
      }
    });

    req.on('end', async () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON request format' }));
        return;
      }

      const email = typeof data.email === 'string' ? data.email.trim() : '';
      const phone = typeof data.phone === 'string' ? data.phone.trim() : '';

      // Validate inputs
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Please enter a valid email address.' }));
        return;
      }

      const digits = phone.replace(/\D/g, '');
      if (!phone || digits.length < 7 || digits.length > 16) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Please enter a valid phone number (at least 7 digits).' }));
        return;
      }

      // Format Date and Time
      const now = new Date();
      const submissionDate = now.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const submissionTime = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });

      const recipient = process.env.ENQUIRY_RECIPIENT || 'Inquiry@neoraalusys.it';
      const emailSubject = 'New Website Enquiry — NEORA Alusys';
      const emailBody = `New enquiry received from NEORA Alusys.
Customer Email: ${email}
Customer Phone: ${phone}
Date: ${submissionDate}
Time: ${submissionTime}`;

      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
      const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
      const smtpFrom = process.env.SMTP_FROM || `"NEORA Alusys Website" <${smtpUser || recipient}>`;

      // Check if SMTP is configured
      if (!smtpHost || !smtpUser || !smtpPass) {
        console.warn(`\n[ENQUIRY RECEIVED — SMTP PENDING CONFIGURATION]`);
        console.warn(`To: ${recipient}`);
        console.warn(`Subject: ${emailSubject}`);
        console.warn(emailBody);
        console.warn(`To enable live delivery, configure SMTP_HOST, SMTP_USER, SMTP_PASS in your .env file.\n`);

        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          configured: false,
          error: 'Email delivery is not yet configured on the server. Please set SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) in .env.'
        }));
        return;
      }

      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        const info = await transporter.sendMail({
          from: smtpFrom,
          to: recipient,
          subject: emailSubject,
          text: emailBody
        });

        console.log(`[ENQUIRY DELIVERED] Successfully sent to ${recipient} (Message ID: ${info.messageId})`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Thank you. Your enquiry has been received. Our team will contact you shortly.',
          messageId: info.messageId
        }));
      } catch (sendErr) {
        console.error('[ENQUIRY ERROR] Delivery failed:', sendErr.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Email delivery error: ' + sendErr.message
        }));
      }
    });
    return;
  }

  if (cleanUrl === '/' || cleanUrl === '') cleanUrl = '/index.html';
  
  let targetPath = path.normalize(path.join(ROOT, cleanUrl));

  // Security: prevent path traversal outside ROOT
  if (!targetPath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Check if target is directory or file
  fs.stat(targetPath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
    } else if (err && !path.extname(targetPath)) {
      // Try appending .html or /index.html
      const tryDir = path.join(targetPath, 'index.html');
      const tryFile = targetPath + '.html';
      if (fs.existsSync(tryDir)) {
        targetPath = tryDir;
      } else if (fs.existsSync(tryFile)) {
        targetPath = tryFile;
      }
    }

    fs.stat(targetPath, (fileErr, fileStats) => {
      if (fileErr || !fileStats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found: ' + cleanUrl);
        return;
      }

      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      // Cache policy: images can be cached, but HTML/CSS/JS must revalidate to prevent stale local development cache
      const isMediaAsset = /\.(webp|png|jpg|jpeg|gif|ico|woff|woff2)$/i.test(ext);
      const cacheControl = isMediaAsset ? 'public, max-age=86400' : 'no-cache, no-store, must-revalidate';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(targetPath).pipe(res);
    });
  });
});

server.on('error', (err) => {
  console.error('[SERVER LISTEN ERROR]', err.message);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`  Neora Alusys Production Web Server Running!`);
  console.log(`  Local URL:    http://localhost:${PORT}`);
  console.log(`  English:      http://localhost:${PORT}/en/`);
  console.log(`  Italian:      http://localhost:${PORT}/it/`);
  console.log(`  Sitemap:      http://localhost:${PORT}/sitemap.xml`);
  console.log(`  Robots:       http://localhost:${PORT}/robots.txt`);
  console.log(`==================================================\n`);
});
