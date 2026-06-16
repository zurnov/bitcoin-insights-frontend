# Performance SEO Audit: explore21.com

## Summary

**Performance Score: 45/100 (Estimated)**

The site is a client-side Angular SPA with no server-side rendering. Performance is constrained by JavaScript-first architecture and render-blocking third-party resources.

---

## Resource Inventory

| Resource | Size (raw) | Size (gzipped) | Cache |
|----------|-----------|----------------|-------|
| index.html | 2,685 bytes | ~1.2KB | DYNAMIC (no cache-control) |
| runtime.js | 2,700 bytes | ~1.2KB | max-age=63,675s (~17h) |
| polyfills.js | 34,812 bytes | ~14KB | max-age=63,675s (~17h) |
| main.js | 460,419 bytes | **142KB** | max-age=63,675s (~17h) |
| styles.css | 26,016 bytes | ~9KB | max-age=63,675s (~17h) |
| Google Fonts (external) | — | ~20KB | External CDN |
| FontAwesome kit (external) | — | ~30KB+ | External CDN |

**Total payload estimate: ~220KB+ gzipped**

---

## Core Web Vitals Estimates (Lab Data)

> Google API credentials not configured — estimates based on architecture analysis.

| Metric | Estimated | Status |
|--------|-----------|--------|
| LCP | ~3.5-5s | ❌ Poor (>4s) |
| FID/INP | ~200-400ms | ⚠️ Needs Improvement |
| CLS | ~0.05-0.1 | ⚠️ Possible |
| FCP | ~2-3.5s | ⚠️ Needs Improvement |
| TTFB | ~90ms | ✅ Good (Cloudflare CDN) |
| TTI | ~4-7s | ❌ Poor |

---

## Critical Performance Issues

### 1. FontAwesome Kit Loaded Synchronously (Critical)
**Evidence:** `<script src="https://kit.fontawesome.com/8a3442c427.js" crossorigin="anonymous">`  
**Issue:** No `async` or `defer` attribute — this is a synchronous, render-blocking external script. It adds ~300-600ms to FCP/LCP.  
**Fix:** Add `defer` attribute or switch to self-hosted SVG icons.

### 2. Google Fonts via @import in Inline CSS (High)
**Evidence:** `@import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap)`  
**Issue:** `@import` in inline CSS is the slowest way to load fonts. CSS parser must fetch fonts before render. Adds ~200-400ms.  
**Fix:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap">
```

### 3. Angular CSR (Client-Side Rendering) — LCP Blocked on JS (Critical)
**Evidence:** `<app-root></app-root>` is empty in raw HTML — all content rendered by JavaScript.  
**Issue:** LCP element cannot paint until JavaScript downloads, parses, and executes. On slow 3G:
- Download main.js: ~460ms (142KB gzipped at typical 3G speeds)
- Parse + execute: ~1-3s
- Angular bootstrap: ~500ms
- LCP: 4-7+ seconds  
**Fix:** Implement Angular Universal (SSR) or Angular 17+ hydration to pre-render content server-side.

### 4. Short Cache TTL on Static Assets (Medium)
**Evidence:** `cache-control: max-age=63675` (~17.7 hours) on hashed JS/CSS files.  
**Issue:** Files with content-hash in filename (e.g., `main.419418b3dcf027aa.js`) should be cached for 1 year. Current TTL forces unnecessary re-downloads.  
**Fix:** Set `Cache-Control: public, max-age=31536000, immutable` for all hashed static assets.

### 5. No HTML Page Caching (Medium)
**Evidence:** HTML returns `cf-cache-status: DYNAMIC` with no `cache-control` header.  
**Issue:** Every page load fetches the HTML shell from origin. Should cache for a short period (5-15 minutes) with `stale-while-revalidate`.  
**Fix:** `Cache-Control: public, max-age=300, stale-while-revalidate=86400`

### 6. Missing Resource Hints (Medium)
**Evidence:** No `<link rel="preconnect">`, `<link rel="dns-prefetch">`, or `<link rel="preload">` in HTML.  
**Issue:** Browser cannot pre-warm connections to external domains.  
**Fix:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://kit.fontawesome.com">
<link rel="preload" href="main.419418b3dcf027aa.js" as="script">
```

### 7. Large JS Bundle (Medium)
**Evidence:** `main.js` is 460KB raw (142KB gzipped).  
**Issue:** For a blockchain explorer, this is large. Angular bundle typically includes everything.  
**Recommendations:**
- Enable lazy loading for routes (blocks, transactions, address pages)
- Check for unused dependencies (moment.js, lodash, etc.)
- Use Angular's production build with `--optimization`

---

## What Works Well

- ✅ **HTTPS on main domain** — TLS 1.3, Cloudflare certificate valid
- ✅ **HTTP/2** — multiplexing enabled via Cloudflare
- ✅ **HTTP/3 (h3)** — `alt-svc: h3=":443"` advertised
- ✅ **Gzip/Brotli compression** — JS served compressed (460KB → 142KB)
- ✅ **Fast TTFB** — 92ms (Cloudflare CDN, SOF edge node)
- ✅ **Critters CSS inlining** — `data-critters-container` attribute present, critical CSS inlined

---

## Recommendations (Priority Order)

1. **IMMEDIATE**: Add `defer` to FontAwesome script tag
2. **IMMEDIATE**: Replace Google Fonts `@import` with `<link rel="preconnect">` + `<link rel="stylesheet">` approach
3. **HIGH**: Implement Angular Universal SSR for first-paint performance and SEO
4. **HIGH**: Fix Cache-Control on static assets (`max-age=31536000, immutable`)
5. **MEDIUM**: Add resource hints (preconnect, dns-prefetch)
6. **MEDIUM**: Implement route-level lazy loading in Angular
7. **LOW**: Consider self-hosting Montserrat font to eliminate external dependency
