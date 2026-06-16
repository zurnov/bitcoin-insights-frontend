# On-Page SEO Audit: explore21.com

## Summary

**On-Page SEO Score: 32/100**

Significant gaps in meta optimization, Open Graph, canonical tags, and link strategy. The site relies on minimal meta tags without a comprehensive on-page strategy.

---

## Title Tag Analysis

| Issue | Detail |
|-------|--------|
| Current | `BTC Insights` |
| Length | 11 characters (critically short — ideal: 50-60) |
| Keywords present | None — "BTC Insights" is a brand name, not a keyword |
| Click potential | Very low — doesn't describe what the site does |
| Brand alignment | Domain is "explore21.com" — no connection to "BTC Insights" |

**Target queries missing from title:**
- "bitcoin blockchain explorer" (avg search volume: high)
- "btc address lookup" (high commercial intent)
- "bitcoin transaction checker" (navigational + transactional)

**Recommended title:**
`Bitcoin Blockchain Explorer – Address & Transaction Lookup | BTC Insights`

---

## Meta Description Analysis

| Issue | Detail |
|-------|--------|
| Current | "Bitcoin Insights - Explore Bitcoin addresses, transactions, blocks, and mining statistics on the BTC blockchain." |
| Length | 112 characters (ideal: 120-155) |
| Quality | Good — descriptive, includes relevant keywords |
| CTA | Missing — no call-to-action |
| Unique value prop | Missing — no differentiator vs competitors |

**Improved meta description:**
`Explore Bitcoin addresses, transactions, and blocks in real-time. Free BTC blockchain explorer with mining stats, mempool tracking, and address balance lookup. No signup required.`

---

## Open Graph / Social Meta

| Tag | Status | Issue |
|-----|--------|-------|
| og:title | ✅ Present | "BTC Insights" — same weak title issue |
| og:description | ✅ Present | Shorter version, acceptable |
| og:type | ✅ Present | "website" — correct |
| og:image | ❌ Missing | No social preview image |
| og:url | ❌ Missing | Canonical URL not specified |
| og:site_name | ❌ Missing | |
| twitter:card | ❌ Missing | No Twitter/X card |
| twitter:title | ❌ Missing | |
| twitter:description | ❌ Missing | |
| twitter:image | ❌ Missing | |

**Impact:** Links shared on Twitter/X, LinkedIn, Discord (popular in crypto communities) will show no preview card — significantly reducing click-through rates.

---

## Canonical Tag

**Status: ❌ Missing**

No `<link rel="canonical">` tag present anywhere in the HTML. For an SPA, this is especially important as URLs can be accessed with/without trailing slashes, with ?q= parameters, etc.

**Fix:** Add to `<head>`:
```html
<link rel="canonical" href="https://explore21.com/">
```
Angular should dynamically update this per-route.

---

## Heading Structure

**Status: ⚠️ Unable to verify (SPA — no server-rendered content)**

All headings are JavaScript-rendered via Angular. Without SSR:
- Googlebot must execute JS to see any heading structure
- No h1 visible in raw HTML
- Heading hierarchy unknown (may be fine client-side)

**Critical:** Every page needs a unique h1 tag. In the SPA context:
- Homepage: `h1: "Bitcoin Blockchain Explorer"`
- Address page: `h1: "Bitcoin Address [ADDRESS]"`
- Transaction page: `h1: "Transaction [TXID]"`
- Block page: `h1: "Block [HEIGHT] – [DATE]"`

---

## Internal Linking

**Status: ❌ Unknown (SPA routing)**

Angular's router handles internal navigation via JavaScript, not static `<a href>` links visible to crawlers without JS. This means:
- Standard crawlers see no internal links
- Link equity distribution is effectively zero for bots that don't render JS
- Googlebot's crawl budget may be wasted on the SPA shell

---

## Keyword Strategy Assessment

### Missing high-intent queries:
| Query | Monthly Searches | Difficulty | Status |
|-------|-----------------|------------|--------|
| bitcoin blockchain explorer | High | Hard | Not targeted |
| btc address lookup | High | Medium | Not targeted |
| bitcoin transaction lookup | High | Medium | Not targeted |
| check bitcoin balance | Medium | Medium | Not targeted |
| bitcoin block explorer | High | Hard | Not targeted |
| bitcoin address checker | Medium | Medium | Not targeted |
| btc explorer | High | Hard | Not targeted |
| free bitcoin explorer | Low | Low | ✅ Implicitly |

### What the site ranks for (likely):
- "explore21" (branded — nearly no search volume)
- "btc insights" (branded — very low volume)

---

## Viewport Meta Issue

**Current:** `<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">`

**Issues:**
- `maximum-scale=1` — prevents users from zooming (accessibility violation)
- `user-scalable=no` — violates WCAG 1.4.4 Resize Text
- Google may use this as a mobile usability signal

**Fix:** `<meta name="viewport" content="width=device-width,initial-scale=1">`

---

## Image Optimization

**Status: ⚠️ Unable to fully audit (SPA)**

No images visible in HTML shell. Expected image types for a blockchain explorer:
- Bitcoin logo/icon (likely as SVG or PNG)
- Chart/graph images for price/mining data

**What's confirmed:**
- ✅ Favicon present (`/favicon.ico`)
- ❌ No og:image (critical for social sharing)

---

## What Works

- ✅ `<html lang="en">` — language attribute set correctly
- ✅ `<meta charset="utf-8">` — proper encoding
- ✅ Meta description present and reasonable length
- ✅ og:title and og:description present
- ✅ Stylesheet loaded with deferred media trick (`media="print" onload`)

---

## Priority Recommendations

1. **CRITICAL**: Rewrite title tag to include primary keywords
2. **HIGH**: Add og:image (1200×630px) for social sharing
3. **HIGH**: Add og:url, og:site_name
4. **HIGH**: Add Twitter Card meta tags
5. **HIGH**: Add canonical tag (update dynamically per Angular route)
6. **MEDIUM**: Remove `user-scalable=no` and `maximum-scale=1` from viewport
7. **MEDIUM**: Ensure each SPA route updates document title and meta dynamically
8. **LOW**: Consider adding meta keywords per page (minimal SEO value but harmless)
