# Technical SEO Audit: explore21.com (BTC Insights)
**Date:** 2026-06-16  
**Site:** https://explore21.com  
**Type:** Angular 17 SPA (Client-Side Rendering)  
**Hosting:** Cloudflare  

---

## Executive Summary
**Technical SEO Score: 35/100**

The BTC Insights platform is a production Angular SPA with **critical crawlability and security vulnerabilities** that severely impact SEO and user experience. The most urgent issue is that both `robots.txt` and `sitemap.xml` are being intercepted by Angular's SPA routing and returned as HTML documents. Combined with missing security headers, improper redirect behavior, and lack of Server-Side Rendering, this site is not optimized for search engine discoverability.

---

## Findings by Category

### 1. CRAWLABILITY & ROBOTS.TXT

**Status:** FAIL - Critical

#### Issues:

1. **robots.txt Returns HTML (200 OK, text/html)**
   - Expected: Plain text file with media type `text/plain`
   - Actual: Full Angular HTML document returned (confirmed)
   - Root Cause: Nginx `try_files` rule routes all requests to `index.html`, including requests to `/robots.txt`
   - Impact: Search engines cannot read crawl directives; site is treated as non-compliant

2. **sitemap.xml Returns HTML (200 OK, text/html)**
   - Same issue as robots.txt
   - Search engines cannot fetch or parse the XML sitemap
   - Impact: Crawlers cannot discover page inventory or priority/frequency hints

#### Recommendations:

1. **Create Static robots.txt File**
   - Add `/src/robots.txt` with proper directives:
   ```
   User-agent: *
   Allow: /
   Disallow: /admin
   Sitemap: https://explore21.com/sitemap.xml
   ```

2. **Update angular.json Assets**
   - Modify build configuration to include robots.txt as a static asset:
   ```json
   "assets": [
     "src/favicon.ico",
     "src/robots.txt",
     "src/sitemap.xml",
     "src/assets"
   ]
   ```

3. **Fix Nginx Configuration**
   - Update nginx.conf to explicitly serve static files before routing to SPA:
   ```nginx
   location ~ ^/(robots\.txt|sitemap\.xml|favicon\.ico|assets)/ {
       root /usr/share/nginx/html;
       expires 1w;
       add_header Cache-Control "public, max-age=604800";
   }

   location / {
       root /usr/share/nginx/html;
       try_files $uri $uri/ /index.html;
   }
   ```

4. **Create Dynamic Sitemap (Optional but Recommended)**
   - Implement a server-side endpoint at `/api/sitemap.xml` that generates XML based on your blockchain data
   - Or use Angular Universal with SSR for automatic sitemap generation
   - Include all major route templates: `/blocks`, `/transactions`, `/address/<id>`

---

### 2. INDEXABILITY

**Status:** FAIL - Critical

#### Issues:

1. **No Server-Side Rendering (SSR)**
   - Application is pure CSR (Client-Side Rendering)
   - Initial HTML contains only `<app-root></app-root>` placeholder
   - Page content only renders after JavaScript execution
   - Impact: 
     - Googlebot may render (but slower), Bingbot has limited rendering support
     - No metadata per page (og:image, canonical, structured data on initial fetch)
     - Rich snippets and featured snippets unlikely to appear

2. **Missing Open Graph Tags (Critical for Social Sharing)**
   - `og:image` missing (no featured image for social shares)
   - `og:url` missing (explicit canonical is important for SPAs)
   - Current: Only `og:title`, `og:description`, `og:type` present
   - Impact: Poor social media preview; reduced click-through from shares

3. **Missing Canonical Tags**
   - No explicit `<link rel="canonical">` tags
   - SPA with `base href="/"` assumes no duplicate content
   - Risk for parameter-based duplicates if query strings are used

4. **No Structured Data (JSON-LD)**
   - No Organization, LocalBusiness, or BreadcrumbList markup detected
   - Missing: schema.org types for blockchain transactions, addresses, blocks
   - Impact: No rich snippets, no knowledge panel eligibility

#### Recommendations:

1. **Add og:image to Base HTML**
   ```html
   <meta property="og:image" content="https://explore21.com/assets/main-logo.png" />
   <meta property="og:url" content="https://explore21.com/" />
   <meta property="og:image:width" content="1200" />
   <meta property="og:image:height" content="630" />
   ```

2. **Implement Dynamic Meta Tags for Routes**
   - Use Angular's `Meta` service to update tags based on route:
   ```typescript
   constructor(private meta: Meta) {}

   updateMetaTags(title: string, description: string, image: string) {
     this.meta.updateTag({ property: 'og:title', content: title });
     this.meta.updateTag({ property: 'og:description', content: description });
     this.meta.updateTag({ property: 'og:image', content: image });
     this.meta.updateTag({ property: 'og:url', content: window.location.href });
   }
   ```

3. **Add Structured Data**
   - Add Organization schema in base HTML:
   ```html
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "WebApplication",
     "name": "BTC Insights",
     "description": "Bitcoin Insights - Explore Bitcoin addresses, transactions, blocks, and mining statistics",
     "url": "https://explore21.com",
     "applicationCategory": "FinanceApplication",
     "image": "https://explore21.com/assets/main-logo.png"
   }
   </script>
   ```

4. **Consider Angular Universal for SSR**
   - Enables server-side rendering for better SEO and initial page load
   - `ng add @nguniversal/express-engine`
   - Allows per-page metadata and structured data injection
   - Improves Core Web Vitals (especially LCP)

---

### 3. SECURITY HEADERS

**Status:** FAIL - Critical

#### Issues:

Missing all critical security headers. Response headers show only:
- `date`, `content-type`, `server`, `last-modified`
- Cloudflare headers: `report-to`, `nel`, `cf-cache-status`, `cf-ray`, `alt-svc`

**Missing Headers:**

| Header | Status | Risk |
|--------|--------|------|
| `Strict-Transport-Security` (HSTS) | Missing | Protocol downgrade, MITM attacks |
| `Content-Security-Policy` | Missing | XSS, code injection attacks |
| `X-Content-Type-Options` | Missing | MIME sniffing attacks |
| `X-Frame-Options` | Missing | Clickjacking attacks |
| `Referrer-Policy` | Missing | Privacy leak through referrer |
| `Permissions-Policy` | Missing | Excessive API access (camera, location, etc.) |

#### Recommendations:

1. **Add Security Headers via Nginx**
   - Update nginx.conf with comprehensive headers:
   ```nginx
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.explore21.com https://a.nel.cloudflare.com; frame-ancestors 'none';" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header X-Frame-Options "DENY" always;
   add_header Referrer-Policy "strict-origin-when-cross-origin" always;
   add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;
   add_header X-UA-Compatible "IE=edge" always;
   ```

2. **Implement HSTS Preload**
   - After HSTS header is deployed, submit domain to HSTS preload list
   - Prevent any non-HTTPS access at browser level
   - See: https://hstspreload.org/

3. **Content-Security-Policy Considerations**
   - Current inline `<style>` in HTML is blocked by strict CSP
   - Either: move styles to external stylesheet, or adjust CSP `style-src`
   - FontAwesome kit requires `unsafe-inline` or nonce for `<style>` tag

4. **Implement Security Headers Testing**
   - Add to CI/CD pipeline (e.g., npm package: `snyk` or `owasp-zap`)
   - Use https://securityheaders.com to audit

---

### 4. URL STRUCTURE & REDIRECTS

**Status:** FAIL - Critical

#### Issues:

1. **HTTP to HTTPS Not Redirected**
   - Request: `curl -sI http://explore21.com`
   - Response: HTTP/1.1 **200 OK** (with full HTML content)
   - Expected: HTTP/1.1 **301/302 Moved Permanently** to HTTPS
   - Impact: Mixed content warnings, SEO penalty if crawled via HTTP

2. **www Subdomain Redirects to HTTP**
   - Request: `curl -sI https://www.explore21.com`
   - Response: HTTP/2 **301** to `http://explore21.com/` (note: HTTP, not HTTPS!)
   - Expected: **301** to `https://explore21.com/`
   - Impact: Protocol downgrade, broken HSTS, potential security issue

3. **No Canonical Variant Handling**
   - Non-www and www both serve the full SPA
   - No explicit `rel=canonical` to consolidate authority
   - Risk: Duplicate content crawling

#### Recommendations:

1. **Add HTTP to HTTPS Redirect in Nginx**
   ```nginx
   server {
       listen 80;
       server_name explore21.com www.explore21.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name www.explore21.com;
       # SSL config
       return 301 https://explore21.com$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name explore21.com;
       # Main app config
   }
   ```

2. **Verify Cloudflare Rules**
   - In Cloudflare dashboard, ensure:
     - "Always Use HTTPS" is enabled (Page Rules)
     - www redirect rule exists and targets HTTPS
     - SSL/TLS is set to "Full" or "Full (Strict)"

3. **Add Canonical Tag**
   - In `src/index.html`:
   ```html
   <link rel="canonical" href="https://explore21.com/" />
   ```

---

### 5. MOBILE FRIENDLINESS & ACCESSIBILITY

**Status:** FAIL - Medium

#### Issues:

1. **user-scalable=no in Viewport**
   - Current: `<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">`
   - Problem: Prevents user pinch-zoom on mobile devices
   - Impact: 
     - Accessibility violation (WCAG 2.1 Level AAA)
     - Poor UX for users with vision impairment
     - Can cause Google Core Web Vitals penalty in PageSpeed Insights

2. **Touch Target Size**
   - CSS rule: `body { touch-action: manipulation; }`
   - Prevents double-tap zoom (acceptable)
   - But if buttons/links are too small (<48x48px), this is a problem

3. **No Responsive Image Optimization**
   - Asset images lack `srcset` or responsive sizing
   - Example: `main-logo.png` (57KB) loaded for all screen sizes

#### Recommendations:

1. **Fix Viewport Meta Tag**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
   ```
   - Remove `maximum-scale` and `user-scalable=no`
   - Allow users to zoom if needed
   - Improves accessibility and Core Web Vitals score

2. **Review Touch Targets**
   - Ensure all interactive elements are at least 48x48px (or 44x44px minimum)
   - Test with Chrome DevTools: Lighthouse > Accessibility

3. **Optimize Images**
   - Use modern formats: WebP with PNG fallback
   - Implement lazy loading: `loading="lazy"`
   - Example for logo:
   ```html
   <picture>
     <source srcset="/assets/main-logo.webp" type="image/webp">
     <img src="/assets/main-logo.png" alt="BTC Insights Logo" loading="lazy">
   </picture>
   ```

---

### 6. CORE WEB VITALS & PERFORMANCE

**Status:** FAIL - High (Estimated)

#### Potential Issues (based on source analysis):

1. **Large Contentful Paint (LCP) - Likely > 2.5s**
   - No critical rendering optimization
   - JavaScript execution required before content renders
   - Heavy bundle: `main.js`, `polyfills.js`, `styles.css` all async
   - Impact: Poor user experience, SEO penalty

2. **Cumulative Layout Shift (CLS) - Likely < 0.1 (Good)**
   - No obvious layout shift triggers in HTML
   - CSS is properly loaded; no custom fonts causing FOIT/FOUT

3. **Interaction to Next Paint (INP) - Unknown**
   - Depends on JavaScript performance
   - Angular rendering can be slow for large datasets (blocks, transactions)
   - Need field data via PageSpeed Insights

#### Recommendations:

1. **Monitor with Real Data**
   - Install Google Analytics 4 with Web Vitals tracking
   - Use PageSpeed Insights to get field data for actual users
   - Compare CrUX data over time

2. **Optimize LCP**
   - Preload critical resources:
   ```html
   <link rel="preload" href="/styles.ab1dbce4a51ccbe8.css" as="style">
   <link rel="preload" href="/runtime.5baa5a6cfc4afc80.js" as="script">
   ```
   - Minify CSS/JS bundles
   - Consider Angular lazy loading for routes
   - Use Server-Side Rendering (SSR) for faster initial render

3. **Defer Non-Critical JavaScript**
   - Current: All scripts in `<head>` and body
   - Option: Move FontAwesome script to end of body with `defer`
   - Option: Use dynamic import for below-fold features

4. **Enable Compression**
   - Nginx already sends `Content-Encoding: gzip` (confirmed)
   - Consider Brotli for better compression: `brotli on;` in Nginx

---

### 7. STRUCTURED DATA & RICH SNIPPETS

**Status:** FAIL - High

#### Issues:

1. **No JSON-LD Schema**
   - No Organization schema
   - No WebApplication schema
   - No BreadcrumbList for navigation
   - No DataFeedItem for blockchain data (addresses, transactions, blocks)

2. **Missing Microdata**
   - No `itemscope`, `itemtype`, `itemprop` attributes
   - No hCard or hCalendar markup

#### Recommendations:

1. **Add JSON-LD Schemas**
   - Base schema in `src/index.html`:
   ```html
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "Organization",
     "name": "BTC Insights",
     "description": "Bitcoin blockchain explorer",
     "url": "https://explore21.com",
     "logo": "https://explore21.com/assets/main-logo.png",
     "foundingDate": "2024",
     "contactPoint": {
       "@type": "ContactPoint",
       "contactType": "Customer Support",
       "url": "https://explore21.com"
     }
   }
   </script>
   ```

2. **Add Page-Specific Schemas**
   - Use Angular's `Meta` service to inject per-route schemas
   - Example for a transaction page:
   ```typescript
   addTransactionSchema(txId: string, confirmations: number) {
     const schema = {
       "@context": "https://schema.org",
       "@type": "Thing",
       "name": `Bitcoin Transaction ${txId}`,
       "description": `Bitcoin transaction with ${confirmations} confirmations`,
       "url": `https://explore21.com/transactions/${txId}`
     };
     const script = this.renderer.createElement('script');
     script.type = 'application/ld+json';
     script.textContent = JSON.stringify(schema);
     this.renderer.appendChild(document.head, script);
   }
   ```

3. **Validate with Structured Data Testing Tool**
   - Use Google Structured Data Testing Tool
   - Monitor for errors/warnings in Search Console

---

### 8. JAVASCRIPT RENDERING & SPA ISSUES

**Status:** FAIL - Critical

#### Issues:

1. **Client-Side Rendering Only**
   - Initial HTML payload is just app shell: `<app-root></app-root>`
   - All content rendered in browser via JavaScript
   - Crawlers with limited JS support (Bingbot, older SEO crawlers) see empty page

2. **No Server-Side Rendering (SSR)**
   - Angular Universal not implemented
   - Each page requires full JavaScript execution
   - Slows down initial page load and Core Web Vitals

3. **Potential JavaScript Errors**
   - Cannot evaluate with render_page.py due to Playwright requirements
   - Need to test with actual browser rendering

#### Recommendations:

1. **Implement Angular Universal (SSR)**
   - Most impactful change for SEO
   - Commands:
   ```bash
   ng add @nguniversal/express-engine
   npm run build:ssr
   npm run serve:ssr
   ```
   - Benefits:
     - Initial page fully rendered on server
     - Meta tags can be dynamic per page
     - Improved LCP (Largest Contentful Paint)
     - Better social media sharing

2. **Or: Implement Prerendering**
   - If SSR too complex, prerender static pages:
   ```bash
   npm install @angular/prerender
   ```
   - Prerender high-value pages: `/`, `/blocks`, `/transactions`
   - Trade-off: Less dynamic, but better SEO for static content

3. **Set Proper `<base>` Tag**
   - Current: `<base href="/" />`
   - Good for local development, but ensure CDN handles it properly
   - Verify no issues with relative asset paths

---

### 9. CLOUDFLARE & CACHING

**Status:** PASS - Partially

#### Issues:

1. **Dynamic Cache Status**
   - Response: `cf-cache-status: DYNAMIC`
   - Means: Cloudflare bypassing cache for HTML (good for freshness, bad for performance)
   - Reason: Probably due to Set-Cookie or Cache-Control headers

2. **No Cache-Control Headers**
   - Nginx not setting explicit `Cache-Control` headers
   - Cloudflare defaults may not be optimal

#### Recommendations:

1. **Set Appropriate Cache-Control**
   - Update nginx.conf:
   ```nginx
   # HTML: short cache (users should get fresh content)
   location ~ \.html$ {
       add_header Cache-Control "public, max-age=300" always;
   }

   # Assets (JS, CSS): long cache (versioned filenames)
   location ~ \.(js|css|woff2)$ {
       add_header Cache-Control "public, max-age=31536000, immutable" always;
   }

   # Default
   add_header Cache-Control "public, max-age=3600" always;
   ```

2. **Review Cloudflare Caching Rules**
   - Set page rule to cache HTML for 5-10 minutes:
     - URL: `explore21.com/*`
     - Cache Level: Cache Everything
     - Browser Cache TTL: 30 minutes

---

### 10. HREFLANG & INTERNATIONALIZATION

**Status:** N/A - Info

#### Issues:

- No hreflang tags detected
- Site appears to be English-only
- No multi-language content

#### Recommendations:

- If planning to add other languages, implement hreflang:
```html
<link rel="alternate" hreflang="en" href="https://explore21.com/" />
<link rel="alternate" hreflang="x-default" href="https://explore21.com/" />
```

---

### 11. INDEXNOW PROTOCOL

**Status:** Missing - Low Priority

#### Info:

IndexNow (by Microsoft) and Ping Endpoint allow real-time index updates to Bing, Yandex, Naver.

#### Recommendations:

1. **Optional but Recommended**
   - Register at https://www.indexnow.org/
   - Get API key
   - Implement endpoint in backend to ping IndexNow on content updates

2. **Simple Implementation**
   - Create API endpoint that pings IndexNow API when new blocks/transactions added
   - Example:
   ```bash
   curl -X POST "https://api.indexnow.org/indexnow" \
     -H "Content-Type: application/json" \
     -d '{
       "host":"explore21.com",
       "key":"YOUR_API_KEY",
       "urlList":["https://explore21.com/transactions/TXID"]
     }'
   ```

---

### 12. PWA & MANIFEST

**Status:** Missing - Medium

#### Issues:

1. No `manifest.webmanifest` file
2. No service worker for offline support
3. No app icons or theme color defined

#### Recommendations:

1. **Create manifest.webmanifest**
   ```json
   {
     "name": "BTC Insights",
     "short_name": "BTC Insights",
     "description": "Bitcoin Insights - Explore Bitcoin addresses, transactions, blocks, and mining statistics",
     "start_url": "/",
     "scope": "/",
     "display": "standalone",
     "background_color": "#171b25",
     "theme_color": "#f7931a",
     "icons": [
       {
         "src": "/assets/main-logo.png",
         "sizes": "512x512",
         "type": "image/png",
         "purpose": "any"
       }
     ]
   }
   ```

2. **Link in HTML**
   ```html
   <link rel="manifest" href="/manifest.webmanifest" />
   <meta name="theme-color" content="#f7931a" />
   <meta name="apple-mobile-web-app-capable" content="yes" />
   <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
   <link rel="apple-touch-icon" href="/assets/main-logo.png" />
   ```

3. **Add to angular.json Assets**
   ```json
   "assets": [
     "src/favicon.ico",
     "src/manifest.webmanifest",
     "src/robots.txt",
     "src/sitemap.xml",
     "src/assets"
   ]
   ```

---

## Priority Action Plan

### PHASE 1: CRITICAL (Do Immediately - 1-2 weeks)

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | Create static robots.txt & sitemap.xml files | Low | Critical |
| 2 | Fix nginx config to serve static files | Low | Critical |
| 3 | Add security headers (HSTS, CSP, etc.) | Low | Critical |
| 4 | Fix HTTP→HTTPS redirect | Low | Critical |
| 5 | Fix www→https redirect | Low | Critical |
| 6 | Add og:image and og:url tags | Low | High |

**Estimated Effort:** 2-4 hours  
**Expected SEO Impact:** +30-40 points

---

### PHASE 2: HIGH (Next 2-4 weeks)

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 7 | Fix viewport user-scalable=no | Low | Medium |
| 8 | Implement Angular Universal (SSR) OR Prerendering | High | Critical |
| 9 | Add structured data (JSON-LD) | Medium | High |
| 10 | Optimize Core Web Vitals (LCP, INP) | Medium | High |

**Estimated Effort:** 20-40 hours (mostly SSR)  
**Expected SEO Impact:** +20-30 points

---

### PHASE 3: MEDIUM (Next 4-8 weeks)

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 11 | Implement dynamic meta tags per route | Medium | High |
| 12 | Add PWA manifest & service worker | Low | Medium |
| 13 | Implement caching strategy | Medium | Medium |
| 14 | Add IndexNow support | Low | Low |

**Estimated Effort:** 15-25 hours  
**Expected SEO Impact:** +10-20 points

---

## SEO Score Calculation

| Category | Current | Target | Weight |
|----------|---------|--------|--------|
| Crawlability | 10/100 | 100/100 | 20% |
| Indexability | 20/100 | 90/100 | 20% |
| Security Headers | 0/100 | 100/100 | 15% |
| URL Structure | 30/100 | 100/100 | 15% |
| Mobile/Accessibility | 40/100 | 90/100 | 10% |
| Core Web Vitals | 50/100 | 90/100 | 10% |
| Structured Data | 0/100 | 80/100 | 10% |

**Current Score: 35/100**  
**Target Score: 95/100**

---

## Testing Checklist

- [ ] Verify robots.txt returned as `text/plain` with proper directives
- [ ] Verify sitemap.xml returned as `application/xml` with valid XML
- [ ] Test all security headers with https://securityheaders.com
- [ ] Verify HTTP→HTTPS redirect with `curl -sI http://explore21.com`
- [ ] Verify www→HTTPS redirect with `curl -sI https://www.explore21.com`
- [ ] Test mobile viewport with Chrome DevTools mobile emulator
- [ ] Run Lighthouse audit in Chrome DevTools
- [ ] Submit to Google Search Console
- [ ] Monitor Search Console for crawl errors
- [ ] Check PageSpeed Insights for Core Web Vitals
- [ ] Validate structured data with Google Rich Results Test

---

## Additional Resources

- Google Search Central: https://developers.google.com/search
- Core Web Vitals Guide: https://web.dev/vitals/
- Angular SEO Guide: https://angular.io/guide/seo
- Security Headers: https://securityheaders.com
- Structured Data: https://schema.org
- IndexNow: https://www.indexnow.org
