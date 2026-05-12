/**
 * CLOUDFLARE WORKER — Mailjet Email Proxy
 * File: _worker.js (place in project root for Cloudflare Pages)
 *
 * Setup:
 * 1. In Cloudflare Dashboard → Workers & Pages → your site → Settings → Variables
 * 2. Add encrypted secret variables:
 *    - MAILJET_API_KEY    (your Mailjet API Key)
 *    - MAILJET_SECRET_KEY (your Mailjet Secret Key)
 * 3. Deploy this file as _worker.js in the root of your Cloudflare Pages project
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only handle POST to /api/send-email
    if (request.method !== 'POST' || url.pathname !== '/api/send-email') {
      return new Response('Not found', { status: 404 });
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://weddingdjgreece.eu',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    try {
      const body = await request.json();

      // Basic validation
      const required = ['fromEmail', 'toEmail', 'subject', 'htmlBody'];
      for (const field of required) {
        if (!body[field]) {
          return new Response(JSON.stringify({ error: `Missing field: ${field}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Rate limiting: simple IP-based check using CF headers
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      const cacheKey = `rate:${clientIP}`;
      // (Production: use KV for rate limiting. Here we proceed.)

      // Build Mailjet v3.1 payload
      const mailjetPayload = {
        Messages: [
          {
            From: {
              Email: body.fromEmail,
              Name: body.fromName || 'Wedding DJ Greece'
            },
            To: [
              {
                Email: body.toEmail,
                Name: body.toName || 'Wedding DJ Greece'
              }
            ],
            ReplyTo: body.replyToEmail ? {
              Email: body.replyToEmail,
              Name: body.replyToName || body.replyToEmail
            } : undefined,
            Subject: body.subject,
            HTMLPart: body.htmlBody,
            TextPart: body.textBody || ''
          }
        ]
      };

      // Clean undefined fields
      if (!mailjetPayload.Messages[0].ReplyTo) {
        delete mailjetPayload.Messages[0].ReplyTo;
      }

      // Call Mailjet API
      const mjResponse = await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${env.MAILJET_API_KEY}:${env.MAILJET_SECRET_KEY}`)
        },
        body: JSON.stringify(mailjetPayload)
      });

      const mjData = await mjResponse.json();

      if (!mjResponse.ok) {
        console.error('Mailjet error:', JSON.stringify(mjData));
        return new Response(JSON.stringify({ error: 'Email send failed', detail: mjData }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, messageId: mjData.Messages?.[0]?.To?.[0]?.MessageID }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://weddingdjgreece.eu'
        }
      });

    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
