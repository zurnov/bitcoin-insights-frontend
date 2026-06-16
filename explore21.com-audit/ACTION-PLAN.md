# Action Plan: explore21.com SEO
**Overall Health Score: 30/100 → Target: 75/100 within 90 days**

---

## Phase 1: Critical Fixes — Week 1 (2-4 hours total)
*Estimated score improvement: +25 points → 55/100*

### ✅ P1.1 — Fix robots.txt (30 min) — DONE 2026-06-16
**Blocker:** Search engines can't read crawl directives
<!-- Created src/robots.txt; added to angular.json assets; nginx.conf location block added -->

1. Create `/src/assets/robots.txt`:
   ```
   User-agent: *
   Allow: /
   Disallow: /api/

   Sitemap: https://explore21.com/sitemap.xml
   ```
2. Configure Nginx to serve before Angular fallback:
   ```nginx
   location = /robots.txt {
       root /var/www/explore21/assets;
       try_files /robots.txt =404;
   }
   ```
3. Test: `curl -I https://explore21.com/robots.txt` → must return `content-type: text/plain`

---

### 🔴 P1.2 — Fix HTTPS Redirects (15 min) — PENDING CLOUDFLARE
**Blocker:** HTTP served without redirect; www downgrades to HTTP

**In Cloudflare Dashboard:**
1. SSL/TLS → Edge Certificates → **Always Use HTTPS** → ON
2. Rules → Redirect Rules → Add:
   - Match: `hostname eq "www.explore21.com"`
   - Action: Dynamic redirect → `https://explore21.com${http.request.uri.path}` (301)

**Expected result:**
- `http://explore21.com` → `https://explore21.com` (301)
- `https://www.explore21.com` → `https://explore21.com` (301)

---

### 🔴 P1.3 — Add Security Headers (20 min) — PENDING CLOUDFLARE
**Risk:** No security headers expose users and hurt trust signals

**In Cloudflare → Rules → Transform Rules → Modify Response Header:**
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

### ✅ P1.4 — Create Static sitemap.xml (30 min) — DONE 2026-06-16
**Blocker:** Google can't discover pages
<!-- Created src/sitemap.xml with actual routes; added to angular.json assets; nginx.conf location block added -->

1. Create `/src/assets/sitemap.xml` with static routes
2. Configure Nginx like robots.txt
3. Submit to Google Search Console

See `sitemap.xml.sample` for complete XML.

---

### ✅ P1.5 — Rewrite Title Tag (10 min) — DONE 2026-06-16
**Impact:** +40-60% CTR once ranking; helps Google understand page purpose
<!-- Updated in index.html -->

In Angular's `index.html` or via `Title` service:
```html
<title>Bitcoin Blockchain Explorer – Address & Transaction Lookup | BTC Insights</title>
```

---

### ✅ P1.6 — Add og:image + Twitter Card (1 hour) — DONE 2026-06-16 (tags added; og-image.jpg still needed)
**Impact:** Critical for crypto community sharing; Discord/X/Telegram will show rich previews
<!-- Tags added to index.html; og-image.jpg (1200x630) must still be created and placed at src/assets/og-image.jpg -->

1. Design 1200×630px image with Bitcoin logo + "BTC Insights - Blockchain Explorer"
2. Add to `<head>` in `index.html`:
   ```html
   <meta property="og:image" content="https://explore21.com/assets/og-image.jpg">
   <meta property="og:image:width" content="1200">
   <meta property="og:image:height" content="630">
   <meta property="og:url" content="https://explore21.com/">
   <meta property="og:site_name" content="BTC Insights">
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="Bitcoin Blockchain Explorer | BTC Insights">
   <meta name="twitter:description" content="Free Bitcoin address lookup, transaction tracking, block explorer, and mining stats.">
   <meta name="twitter:image" content="https://explore21.com/assets/og-image.jpg">
   ```

---

### ✅ P1.7 — Add Basic Schema Markup (30 min) — DONE 2026-06-16
**Impact:** Enables Google Sitelinks Search Box; establishes entity knowledge graph
<!-- WebSite + SoftwareApplication JSON-LD added to index.html -->

Add to `index.html` `<head>`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "BTC Insights",
      "url": "https://explore21.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://explore21.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "BTC Insights",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "description": "Free Bitcoin blockchain explorer for address lookup, transaction tracking, blocks, and mining statistics.",
      "url": "https://explore21.com",
      "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}
    }
  ]
}
</script>
```

---

### ✅ P1.8 — Fix Viewport Accessibility (5 min) — DONE 2026-06-16
**Risk:** WCAG violation; potential mobile usability penalty
<!-- Removed maximum-scale=1 and user-scalable=no from viewport meta in index.html -->

Change in `index.html`:
```html
<!-- Before -->
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<!-- After -->
<meta name="viewport" content="width=device-width,initial-scale=1">
```

---

## Phase 2: High-Impact Improvements — Weeks 2-3 (20-30 hours)
*Estimated score improvement: +15 points → 70/100*

### 🟠 P2.1 — Implement Angular Dynamic Meta Tags (3-4 hours)
Each route must update its own title, description, and canonical.

```typescript
// In each component:
constructor(private titleService: Title, private meta: Meta) {}

ngOnInit() {
  this.titleService.setTitle('Bitcoin Address Lookup | BTC Insights');
  this.meta.updateTag({ name: 'description', content: '...' });
  // Update canonical:
  const link = document.querySelector("link[rel='canonical']");
  link?.setAttribute('href', `https://explore21.com${this.router.url}`);
}
```

### 🟠 P2.2 — Fix FontAwesome & Google Fonts Loading (2 hours) — FontAwesome DONE 2026-06-16
<!-- FontAwesome script now has defer attribute in index.html; Google Fonts preconnect still pending -->

**FontAwesome:**
```html
<!-- Before -->
<script src="https://kit.fontawesome.com/8a3442c427.js" crossorigin="anonymous"></script>
<!-- After -->
<script defer src="https://kit.fontawesome.com/8a3442c427.js" crossorigin="anonymous"></script>
```

**Google Fonts (replace @import in CSS):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap">
```

### 🟠 P2.3 — Create Essential Static Pages (8-10 hours)
Each page needs real content — not just the Angular router shell.

| Page | Priority | Content Needed |
|------|----------|---------------|
| `/about` | Critical | Who made this, data sources, why trustworthy |
| `/privacy` | Critical | What data is collected/stored |
| `/terms` | High | Terms of use |
| `/faq` | High | Common Bitcoin explorer questions |
| `/donate` | Medium | Support the project |

These pages should have at minimum 300 words of unique, helpful content.

### 🟠 P2.4 — Create llms.txt for AI Crawler Access (30 min)

Create `/src/assets/llms.txt`:
```
# BTC Insights - Bitcoin Blockchain Explorer
# https://explore21.com

BTC Insights is a free Bitcoin blockchain explorer providing real-time data on 
Bitcoin addresses, transactions, blocks, and mining statistics.

## What this tool provides:
- Bitcoin address balance and transaction history lookup
- Real-time Bitcoin transaction tracking and confirmation status  
- Bitcoin block explorer with mining reward information
- Bitcoin network mining statistics, hashrate, and difficulty

## Data coverage:
- Full Bitcoin blockchain from genesis block to current block
- Real-time mempool monitoring
- Mining pool statistics and difficulty adjustment tracking

## Use allowed for:
- AI training and research (Read: allow)
- Web crawling for search indexing (Read: allow)
- Citation in AI responses about Bitcoin tools (Read: allow)

User-agent: *
Allow: /
```

### 🟠 P2.5 — Fix Static Asset Cache TTL (30 min)

In Nginx or Cloudflare cache rules, set for hash-named assets:
```nginx
location ~* \.(js|css)$ {
    if ($request_uri ~* "\.[0-9a-f]{16}\.(js|css)$") {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 🟠 P2.6 — Submit to Google Search Console (1 hour)
1. Verify ownership at search.google.com/search-console
2. Submit sitemap.xml
3. Request indexing for homepage and key pages
4. Monitor crawl errors (especially robots.txt after fix)

---

## Phase 3: Content & Authority — Month 2
*Estimated score improvement: +10 points → 80/100*

### 🟡 P3.1 — Implement Angular Universal SSR (15-20 hours)
The single highest-impact technical change. SSR means:
- Content visible to all crawlers without JS
- Faster LCP (no JS-gating)
- Per-page meta tags server-rendered
- Better Core Web Vitals → better rankings

Resources:
- `ng add @nguniversal/express-engine`
- Angular 17+: `ng new --ssr` (built-in SSR support)

### 🟡 P3.2 — Implement Angular Route-Level Lazy Loading (4-6 hours)
Reduce main.js from 460KB to ~100-150KB for initial page load.

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: 'blocks', loadComponent: () => import('./blocks/blocks.component') },
  { path: 'address/:hash', loadComponent: () => import('./address/address.component') },
  // etc.
];
```

### 🟡 P3.3 — Start Link Building Campaign
**Week 1:**
- [ ] Google Search Console setup and sitemap submission
- [ ] Bitcoin.org resources listing application
- [ ] CoinMarketCap tools directory listing

**Month 1-2:**
- [ ] Open-source the project on GitHub (adds credibility)
- [ ] BitcoinTalk.org thread introducing the tool
- [ ] Dev.to article: "How to build a Bitcoin explorer" (links back)

**Month 2-3:**
- [ ] CoinGecko listing
- [ ] Target 3-5 crypto newsletter features
- [ ] Reddit r/Bitcoin tool mention

### 🟡 P3.4 — Content Hub Development
Create a `/learn` or `/blog` section targeting long-tail keywords:

| Article Title | Target Keyword | Search Volume |
|---------------|----------------|---------------|
| How to look up a Bitcoin address | bitcoin address lookup | High |
| How to check Bitcoin transaction status | bitcoin transaction check | High |
| Understanding Bitcoin mining difficulty | bitcoin mining difficulty | Medium |
| What is a Bitcoin mempool? | bitcoin mempool | Medium |
| How to read a Bitcoin block | bitcoin block explorer | Medium |

---

## Phase 4: Monitoring & Iteration — Ongoing

### 🟢 Set Up Monitoring

1. **Google Search Console** — Weekly check on impressions, clicks, crawl errors
2. **Cloudflare Analytics** — Traffic patterns, bot traffic
3. **Core Web Vitals** — Monthly PageSpeed check: pagespeed.web.dev
4. **Security Headers** — Monthly check: securityheaders.com/?q=explore21.com
5. **Backlink monitoring** — Monthly: ahrefs.com/free-tools (limited) or Moz Link Explorer

### 🟢 KPIs to Track

| Metric | Now | 30 days | 90 days |
|--------|-----|---------|---------|
| SEO Health Score | 30/100 | 55/100 | 75/100 |
| Indexed pages | 0 | 6+ | 10+ |
| Referring domains | 0 | 5+ | 20+ |
| Organic monthly clicks | 0 | 50+ | 500+ |
| SERP visibility | None | Partial | Top 20 for 3+ queries |
| LCP (mobile) | ~5s | <3s | <2s |

---

## Expected Score Trajectory

```
Today:   ■■■ 30/100
Week 1:  ■■■■■■ 55/100  (+25 pts — Critical fixes)
Week 3:  ■■■■■■■■ 70/100 (+15 pts — High-impact improvements)
Month 2: ■■■■■■■■■■ 80/100 (+10 pts — Content & authority)
Month 3: ■■■■■■■■■■■ 85/100 (+5 pts — Monitoring & refinement)
```

---

*Action Plan generated: June 16, 2026 | Full findings at: explore21.com-audit/FULL-AUDIT-REPORT.md*
