# 🎵 weddingdjgreece.eu — Deployment Guide

## Project Structure
```
weddingdjgreece/
├── index.html          ← English (default)
├── el/index.html       ← Greek / Ελληνικά
├── de/index.html       ← German / Deutsch
├── fr/index.html       ← French / Français
├── es/index.html       ← Spanish / Español
├── it/index.html       ← Italian / Italiano
├── ja/index.html       ← Japanese / 日本語
├── css/style.css       ← All styles
├── js/main.js          ← JS + form handler
├── _worker.js          ← Cloudflare Worker (Mailjet proxy)
├── _headers            ← Cloudflare Pages headers
├── _redirects          ← Cloudflare Pages redirects
├── sitemap.xml         ← SEO sitemap (all 7 languages)
└── robots.txt          ← Search engine rules
```

---

## STEP 1: Cloudflare Pages Deployment

1. Go to **Cloudflare Dashboard** → Workers & Pages → Create → Pages
2. Connect your GitHub account (push this folder to a repo first)
   - OR use **Direct Upload**: drag & drop the `weddingdjgreece` folder
3. Set **Production branch**: `main`
4. **Build settings**: Leave blank (static site, no build needed)
5. Click **Deploy**

### Add Custom Domain (weddingdjgreece.eu)
1. Pages → your project → Custom Domains → Add custom domain
2. Enter: `weddingdjgreece.eu` and `www.weddingdjgreece.eu`
3. Cloudflare will automatically configure DNS (since domain is on Joker.com, point nameservers to Cloudflare first)

### Point Joker.com to Cloudflare
1. In Joker.com control panel → NS Records
2. Replace with Cloudflare nameservers (shown in your Cloudflare account)
3. Wait up to 24h for propagation

---

## STEP 2: Mailjet Setup

### A. Create Mailjet Account
1. Go to https://www.mailjet.com and sign up
2. Go to **Account Settings** → **API Keys**
3. Copy your **API Key** and **Secret Key**

### B. Verify Your Domain (info@weddingdjgreece.eu)
1. Mailjet Dashboard → **Sender Domains** → Add Domain
2. Add `weddingdjgreece.eu`
3. Add the DNS records Mailjet shows you (SPF, DKIM, DMARC) in Cloudflare DNS

**DNS Records to add in Cloudflare:**
```
TXT  @                v=spf1 include:spf.mailjet.com ~all
TXT  mailjet._domainkey   [DKIM key from Mailjet]
TXT  @                v=DMARC1; p=none; rua=mailto:info@weddingdjgreece.eu
MX   @                in-v3.mailjet.com  (priority 10)
```

### C. Add API Keys to Cloudflare Worker
1. Cloudflare Dashboard → Workers & Pages → your site
2. **Settings** → **Variables and Secrets**
3. Add as **Encrypted** secrets:
   - `MAILJET_API_KEY` = your Mailjet API Key
   - `MAILJET_SECRET_KEY` = your Mailjet Secret Key

### D. The `_worker.js` is already set up
The Cloudflare Worker acts as a secure proxy — API keys stay server-side, never exposed to the browser.

---

## STEP 3: Set Up Email Forwarding (info@weddingdjgreece.eu)

### Option A: Cloudflare Email Routing (Free)
1. Cloudflare Dashboard → your domain → **Email** → **Email Routing**
2. Enable Email Routing
3. Add rule: `info@weddingdjgreece.eu` → forwards to `info@pwe.gr` (or any Gmail)
4. This lets you RECEIVE emails at info@weddingdjgreece.eu

### Option B: Mailjet as inbox (paid plan)
Use Mailjet's inbound email parsing for full inbox functionality.

---

## STEP 4: Google Search Console

1. Go to https://search.google.com/search-console
2. Add property: `https://weddingdjgreece.eu`
3. Verify via HTML tag (add to `<head>` in index.html) or Cloudflare DNS
4. Submit sitemap: `https://weddingdjgreece.eu/sitemap.xml`
5. Request indexing for each language URL

---

## STEP 5: Google Analytics (optional but recommended)

Add this snippet to ALL HTML files, just before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
Replace `G-XXXXXXXXXX` with your GA4 Measurement ID.

---

## SEO Checklist ✓

- [x] Unique `<title>` per language with keywords
- [x] `<meta description>` per language
- [x] `<meta keywords>` per language  
- [x] `hreflang` tags on all pages (7 languages)
- [x] `<link rel="canonical">` per page
- [x] Open Graph tags
- [x] JSON-LD structured data (LocalBusiness schema)
- [x] XML Sitemap with hreflang alternates
- [x] robots.txt
- [x] Performance headers (Cache-Control)
- [x] Security headers (X-Frame-Options, CSP etc.)
- [x] GEO keywords: Santorini, Mykonos, Athens, Crete, Kefalonia, Mani, Rhodes, Corfu
- [x] Mobile responsive design
- [x] Fast loading (static HTML, no CMS overhead)

---

## Logo Usage

The SVG logo is embedded directly in HTML for:
- Zero HTTP requests (faster loading)
- Perfect scaling at any size
- Easy color customization

The logo features:
- Olive branch motifs (Greek heritage)
- Gold gradient (#C9A84C → #F0D080) 
- Music note symbol
- "DJ" in Cormorant Garamond (serif elegance)
- "WEDDING GREECE" in Montserrat (clean readability)

---

## Contact & Support
- Email: info@weddingdjgreece.eu
- Phone/WhatsApp: +30 693 680 4060
