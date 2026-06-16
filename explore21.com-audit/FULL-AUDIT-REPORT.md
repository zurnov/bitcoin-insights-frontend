# SEO Audit Report: explore21.com (BTC Insights)
**Date:** June 16, 2026  
**Audited URL:** https://explore21.com  
**Business Type:** Bitcoin Blockchain Data Explorer Tool  
**Audit Scope:** Full Technical, Content, On-Page, Schema, Performance, AI Readiness, Backlinks  

---

## 🏆 SEO Health Score: 30 / 100

**Grade: F — Critical Attention Required**

> The site is in early-stage deployment with foundational SEO gaps that prevent indexing and ranking. The good news: all critical issues are fixable within 1-2 weeks with the Angular codebase already in place.

| Category | Weight | Score | Contribution |
|----------|--------|-------|-------------|
| Technical SEO | 22% | 35/100 | 7.7 pts |
| Content Quality | 23% | 28/100 | 6.4 pts |
| On-Page SEO | 20% | 32/100 | 6.4 pts |
| Schema / Structured Data | 10% | 5/100 | 0.5 pts |
| Performance (CWV) | 10% | 45/100 | 4.5 pts |
| AI Search Readiness | 10% | 34/100 | 3.4 pts |
| Images | 5% | 20/100 | 1.0 pt |
| **TOTAL** | **100%** | **30/100** | **30 pts** |

---

## Executive Summary

**explore21.com** is a Bitcoin blockchain explorer tool ("BTC Insights") launched in May 2026. It is built as an Angular client-side SPA served via Cloudflare CDN. While the underlying tool appears functional, the site has **critical SEO infrastructure failures** that currently prevent it from being indexed, found, or ranked by search engines.

### Top 5 Critical Issues

1. **No robots.txt or sitemap.xml** — Angular SPA routing intercepts all paths including `/robots.txt` and `/sitemap.xml`, returning HTML instead of proper files. Googlebot cannot understand crawl permissions or discover pages.

2. **HTTP/HTTPS redirect broken** — `http://explore21.com` serves content over HTTP with no redirect to HTTPS. `https://www.explore21.com` redirects to `http://explore21.com/` (downgrading to HTTP). Users and bots can access the site insecurely.

3. **Zero security headers** — No HSTS, no Content-Security-Policy, no X-Frame-Options, no X-Content-Type-Options. Cloudflare provides DDoS protection but security headers are absent.

4. **Angular CSR-only — no server-rendered content** — All content is rendered by JavaScript. Without SSR/prerendering, Googlebot must execute JavaScript to see any content. This delays indexing, impairs crawl budget, and makes every page look like an empty `<app-root>` shell to non-JS crawlers.

5. **No indexable content or schema markup** — Zero JSON-LD schema, no visible text content in HTML, no h1 tags, and no canonical tags. The site is effectively invisible to search engines and AI systems.

### Top 5 Quick Wins (Implementable this week)

1. **Fix robots.txt** — Create `/src/assets/robots.txt` as a static file and configure Nginx to serve it before the Angular fallback. *(30 mins)*
2. **Fix HTTPS redirects** — Enable Cloudflare "Always Use HTTPS" + fix www redirect to point to `https://explore21.com/`. *(15 mins)*
3. **Rewrite title tag** — Change from "BTC Insights" to "Bitcoin Blockchain Explorer – Address & Transaction Lookup | BTC Insights". *(5 mins)*
4. **Add security headers via Cloudflare** — Use Cloudflare Transform Rules to inject X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS. *(20 mins)*
5. **Add og:image and og:url** — Social sharing will show preview cards. Critical for crypto communities on Discord/Telegram/X. *(1 hour)*

---

## Site Overview

| Property | Value |
|----------|-------|
| Domain | explore21.com |
| Brand Name | BTC Insights |
| Domain Age | ~5 weeks (SSL cert issued May 11, 2026) |
| Technology | Angular 17+ SPA, Cloudflare CDN |
| HTTPS | ✅ Main domain (❌ broken for www and HTTP) |
| HTTP/2 | ✅ Enabled |
| HTTP/3 | ✅ Advertised via alt-svc |
| Server | Cloudflare (SOF edge — Sofia, BG) |
| Gzip/Brotli | ✅ Compression enabled |
| Mobile-first | ⚠️ Responsive but blocks zoom |
| SSR | ❌ Not implemented |
| Common Crawl | ❌ Not indexed yet |

---

## 1. Technical SEO — 35/100

### 1.1 Robots.txt

**Status: ❌ CRITICAL**

`https://explore21.com/robots.txt` returns `text/html` (200 OK) with the Angular SPA shell. Googlebot will fail to parse crawl directives and may either:
- Crawl all pages unrestricted, wasting crawl budget
- Refuse to crawl without a valid robots.txt

**Fix:** See `robots.txt.sample` in this audit directory. Configure Nginx:
```nginx
location = /robots.txt {
    root /var/www/explore21/assets;
    try_files /robots.txt =404;
}
```

**Sample robots.txt:**
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://explore21.com/sitemap.xml
```

### 1.2 Sitemap

**Status: ❌ CRITICAL**

`https://explore21.com/sitemap.xml` returns HTML (200 OK). No XML sitemap exists.

**Fix:** Create a static sitemap for indexable pages:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://explore21.com/</loc><changefreq>hourly</changefreq><priority>1.0</priority></url>
  <url><loc>https://explore21.com/blocks</loc><changefreq>always</changefreq><priority>0.9</priority></url>
  <url><loc>https://explore21.com/transactions</loc><changefreq>always</changefreq><priority>0.9</priority></url>
  <url><loc>https://explore21.com/mining</loc><changefreq>always</changefreq><priority>0.8</priority></url>
  <url><loc>https://explore21.com/mempool</loc><changefreq>always</changefreq><priority>0.8</priority></url>
  <url><loc>https://explore21.com/donate</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
</urlset>
```

### 1.3 HTTPS & Redirect Chain

**Status: ❌ CRITICAL**

| Request | Response | Issue |
|---------|----------|-------|
| `http://explore21.com` | 200 OK (HTTP!) | ❌ No HTTPS redirect |
| `https://www.explore21.com` | 301 → `http://explore21.com/` | ❌ Redirects to HTTP |
| `https://explore21.com` | 200 OK (HTTPS) | ✅ Works |

**Fix (Cloudflare):**
1. Cloudflare Dashboard → SSL/TLS → Edge Certificates → "Always Use HTTPS" → ON
2. Cloudflare Dashboard → Rules → Redirect Rules → Add: www.explore21.com → https://explore21.com (301)

### 1.4 Security Headers

**Status: ❌ HIGH**

| Header | Status |
|--------|--------|
| Strict-Transport-Security (HSTS) | ❌ Missing |
| Content-Security-Policy | ❌ Missing |
| X-Frame-Options | ❌ Missing |
| X-Content-Type-Options | ❌ Missing |
| Referrer-Policy | ❌ Missing |
| Permissions-Policy | ❌ Missing |

See `nginx.conf.recommended` for implementation. Via Cloudflare Transform Rules (free plan):
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 1.5 Canonicalization

**Status: ❌ HIGH**

No `<link rel="canonical">` tag. The same content can be accessed via:
- `https://explore21.com/` 
- `https://explore21.com` (without trailing slash)
- `http://explore21.com/` (HTTP — currently served)

**Fix:** Angular should inject canonical per route using `@angular/platform-browser`'s `Meta` service.

### 1.6 SPA Architecture Issues

**Status: ⚠️ HIGH**

The site is a client-side Angular SPA with no SSR:
- Googlebot must execute JS before seeing any content
- All meta tags (title, description, og) are static — every page has the same meta
- Angular does NOT update meta tags dynamically unless implemented with `Meta` service + `Router` events
- Crawl budget wasted on empty HTML shell

**Fix Priority Order:**
1. Angular Universal SSR (ideal — full server rendering)
2. Angular 17 Hydration + prerendering for static routes
3. Prerender.io or Rendertron as middleware (acceptable fallback)

### 1.7 What Works in Technical SEO

- ✅ HTTPS on main domain (valid Cloudflare cert, Let's Encrypt via Google Trust Services)
- ✅ HTTP/2 + HTTP/3 via Cloudflare
- ✅ Gzip compression on all assets
- ✅ Cloudflare CDN (fast TTFB: ~92ms)
- ✅ Critters CSS inlining (critical CSS inlined in `<head>`)
- ✅ `<html lang="en">` set correctly

---

## 2. Content Quality — 28/100

### E-E-A-T Assessment: 18/100

| Signal | Score | Notes |
|--------|-------|-------|
| Experience | 8/20 | No case studies, no data citations |
| Expertise | 10/25 | Technical competence implied, zero credentials |
| Authoritativeness | 4/25 | Domain mismatch kills authority |
| Trustworthiness | 6/30 | No privacy policy, no contact, no team info |

### Key Content Failures

**1. Zero Indexable Content (Critical)**  
HTML shell contains `<app-root></app-root>` — no text content for crawlers. The entire site content is JavaScript-rendered.

**2. No Static Pages (Critical)**  
All pages (`/about`, `/faq`, `/privacy`, `/terms`, `/contact`) return the SPA shell with no server-rendered content. There are no informational pages that Google can use to understand what this site is and why it's trustworthy.

**3. Weak Title Tag (High)**  
"BTC Insights" is a brand name, not a keyword. Ideal: "Bitcoin Address Lookup & Blockchain Explorer - BTC Insights".

**4. Brand/Domain Mismatch (High)**  
`explore21.com` has zero alignment with "BTC Insights." Users searching for the tool won't remember the domain. AI systems citing the site will be confused about what to call it.

**5. No E-E-A-T Signals (High)**  
Crypto users are exceptionally skeptical. No team info, no founder credentials, no GitHub link, no "about this tool" section.

**6. Missing Content Hub (Medium)**  
Competitors like mempool.space have rich explanatory content, API documentation, and educational resources. A blog/resources section would capture long-tail traffic.

---

## 3. On-Page SEO — 32/100

| Element | Current | Status | Fix |
|---------|---------|--------|-----|
| Title tag | "BTC Insights" (11 chars) | ❌ Weak | Add keywords (see Section 2) |
| Meta description | 112 chars, good content | ✅ Acceptable | Improve with CTA |
| Canonical | Missing | ❌ | Add per-route |
| H1 | Not visible (JS-rendered) | ❌ | Add via Angular SSR |
| og:title | "BTC Insights" | ⚠️ | Same as title fix |
| og:description | Present | ✅ | |
| og:image | Missing | ❌ | Create 1200×630 image |
| og:url | Missing | ❌ | Add canonical URL |
| og:site_name | Missing | ❌ | Add |
| twitter:card | Missing | ❌ | Add summary_large_image |
| Viewport | user-scalable=no | ⚠️ | Remove zoom restrictions |
| Keywords meta | Generic only | ⚠️ | Per-page optimization |
| hreflang | Missing | Info | Not needed (EN-only) |
| Internal links | JS-only (invisible) | ⚠️ | SSR needed |

---

## 4. Schema / Structured Data — 5/100

**Status: ❌ CRITICAL — Zero Schema Markup Detected**

No JSON-LD, Microdata, or RDFa of any kind. This is a significant missed opportunity for a Bitcoin blockchain explorer.

### Recommended Schema (Priority Order)

**1. WebSite + SearchAction (HIGHEST PRIORITY)**
Enables Google Sitelinks Search Box — users can search Bitcoin addresses directly from SERP.
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BTC Insights",
  "url": "https://explore21.com/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://explore21.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

**2. Organization Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BTC Insights",
  "url": "https://explore21.com",
  "description": "Bitcoin blockchain explorer for address lookup, transaction tracking, and mining statistics.",
  "sameAs": []
}
```

**3. SoftwareApplication Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "BTC Insights",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

**4. BreadcrumbList** (for inner pages like /blocks, /address/[hash])

**Implementation:** Angular can inject schema via `@angular/platform-browser`'s `DomSanitizer` or via a `SchemaService` that renders to `<script type="application/ld+json">` tags.

---

## 5. Performance — 45/100

### Resource Analysis

| Resource | Raw Size | Gzipped |
|----------|----------|---------|
| index.html | 2.7 KB | ~1.2 KB |
| runtime.js | 2.7 KB | ~1.2 KB |
| polyfills.js | 34.8 KB | ~14 KB |
| **main.js** | **460 KB** | **142 KB** |
| styles.css | 26 KB | ~9 KB |
| Google Fonts | External | ~20 KB |
| FontAwesome | External | ~30 KB+ |

### Critical Performance Issues

**1. FontAwesome Script — Synchronous, Render-Blocking (Critical)**  
`<script src="https://kit.fontawesome.com/8a3442c427.js" crossorigin="anonymous">` — no `async`/`defer`.  
**Fix:** Add `defer` attribute. Impact: -300-500ms LCP.

**2. Google Fonts via @import (High)**  
`@import url(...)` in inline CSS is the worst font loading pattern. Blocks all CSS parsing.  
**Fix:** Replace with `<link rel="preconnect">` + `<link rel="stylesheet">` in `<head>`.

**3. Angular CSR — JS-gated LCP (Critical)**  
LCP element cannot paint until 460KB JS downloads and executes.  
**Estimated LCP:** 3-7 seconds on typical mobile connection.  
**Fix:** Angular Universal SSR or Angular 17+ prerendering.

**4. Short Cache TTL on Static Assets (Medium)**  
Hash-named assets (`main.419418b3dcf027aa.js`) use max-age=63,675s (~17h).  
**Fix:** `Cache-Control: public, max-age=31536000, immutable`

### What Performs Well
- ✅ TTFB: ~92ms (Cloudflare CDN)
- ✅ HTTP/2 + HTTP/3
- ✅ Gzip compression (460KB → 142KB for main.js)
- ✅ Critical CSS inlining (Critters)
- ✅ Deferred non-critical CSS (`media="print" onload`)

---

## 6. AI Search Readiness — 34/100

### Platform Scores

| Platform | Score | Key Blocker |
|----------|-------|-------------|
| Google AI Overviews | 25/100 | No schema, no E-E-A-T, CSR |
| ChatGPT | 22/100 | No static content, no brand authority |
| Claude | 28/100 | No About page, unclear provenance |
| Perplexity | 32/100 | Best fit for real-time data, but blocked by CSR |
| Bing Copilot | 26/100 | No indexable content |

### Key Issues

- **No llms.txt** — `/llms.txt` returns the SPA shell (HTML). No explicit AI crawler guidance.
- **No About page** — AI systems cannot establish who built this or why it's trustworthy
- **SPA blocks AI crawlers** — Most AI web crawlers don't execute JavaScript
- **Brand-domain mismatch** — "BTC Insights" vs "explore21.com" confuses attribution

### Quick Wins
1. Create `/src/assets/llms.txt` (static file, served before SPA fallback)
2. Add About page with 200+ words about the tool, its data sources, and who maintains it
3. Add WebSite + Organization schema (see Section 4)

---

## 7. Images — 20/100

- ❌ **No og:image** — Social sharing shows no preview (critical for crypto community sharing on Discord, Telegram, X/Twitter)
- ❌ **No Twitter Card** — Prevents rich previews on X
- ⚠️ **No image audit possible** — All images are JS-rendered, not crawlable
- ✅ **Favicon present** (`/favicon.ico`)

**Priority action:** Create a 1200×630px social preview image showing Bitcoin blockchain data visualization and the BTC Insights brand. Add to `<head>`:
```html
<meta property="og:image" content="https://explore21.com/assets/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://explore21.com/assets/og-image.jpg">
```

---

## 8. Backlinks & Domain Authority — N/A (New Domain)

**Common Crawl status:** Not indexed (domain too new)  
**Estimated DA:** 0-5/100  
**Referring domains:** 0  
**Domain age:** ~5 weeks (first seen May 2026)

### Link Building Priority

**Tier 1 (target immediately):**
- Submit to Bitcoin.org resources page (DA 85+)
- CoinMarketCap tool listings (DA 80+)
- CoinGecko listings (DA 80+)

**Tier 2 (Month 1-2):**
- BitcoinTalk.org community thread (DA 70+)
- GitHub: Open-source the explorer code, link back
- Dev.to/Medium tutorials about using the explorer

**Tier 3 (Month 3+):**
- Crypto directories and resource aggregators
- Reddit r/Bitcoin, r/CryptoCurrency mentions
- YouTube tutorials showing the tool in use

---

## 9. Competitive Landscape

| Competitor | DA | Strengths | Weakness |
|------------|-----|-----------|---------|
| blockchain.com | 85+ | 20yr brand, multi-chain, high volume | Complex, overwhelming |
| mempool.space | 65+ | Open-source, visualization, mempool focus | Bitcoin-only |
| blockchair.com | 65+ | Multi-chain, privacy focus, API | Premium features costly |
| btcscan.org | 45+ | Clean UI, fast | Limited features |
| **explore21.com** | 0-5 | Fast (Cloudflare CDN), modern Angular | No authority, no content, no backlinks |

**Differentiation opportunity:** BTC Insights can compete by focusing on a specific niche (e.g., best-in-class mining stats, cleanest address explorer, privacy-first, fastest TTFB) and building content around it.

---

## Appendix: Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | Angular 17+ (client-side SPA) |
| Styling | Tailwind CSS + custom Montserrat font |
| Icons | FontAwesome 6 (kit: 8a3442c427) |
| CDN | Cloudflare (SOF edge, HTTP/2, HTTP/3) |
| CSS optimization | Critters (critical CSS inlining) |
| Build | Angular CLI with production build + hash filenames |
| Hosting | Custom server (`x-served-by: explore21.com`) behind Cloudflare |
| SSL | Let's Encrypt via Google Trust Services (wildcard: *.explore21.com) |
| SSL expiry | Aug 9, 2026 (auto-renewed via Cloudflare) |

---

*Report generated by SEO Audit Tool | explore21.com-audit/FULL-AUDIT-REPORT.md*  
*6 specialist agents deployed: Technical, Content, Schema, GEO, SXO, Backlinks*
