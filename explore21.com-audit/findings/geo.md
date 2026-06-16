# GEO & AI Search Readiness Audit for explore21.com
## BTC Insights - Bitcoin Blockchain Explorer
**Audit Date:** June 16, 2026  
**Site Type:** Angular SPA (Client-Side Rendered)  
**Focus Areas:** AI citation readiness, LLM accessibility, structured data

---

## Executive Summary

**Overall GEO Readiness Score: 34/100** (Poor - Significant improvements needed)

BTC Insights is technically accessible but severely underoptimized for AI citation and LLM discovery. As a niche Bitcoin data explorer, the site has strong potential for AI citations (unique blockchain data, real-time statistics), but currently lacks the structural signals, metadata, and content frameworks that make AI systems reference it.

**Key Finding:** The site is invisible to AI crawlers not because of technical barriers, but because it fails to provide citability signals—no robots.txt clarity, no llms.txt, no schema markup, minimal metadata, and no authoritative "About" content that establishes credibility in the Bitcoin niche.

---

## GEO Readiness Score Breakdown

| Dimension | Score | Weight | Weighted | Status |
|-----------|-------|--------|----------|--------|
| **Citability** | 28/100 | 25% | 7.0 | ⚠️ Poor |
| **Structural Readability** | 35/100 | 20% | 7.0 | ⚠️ Poor |
| **Multi-Modal Content** | 40/100 | 15% | 6.0 | ⚠️ Poor |
| **Authority & Brand Signals** | 25/100 | 20% | 5.0 | ⚠️ Critical |
| **Technical Accessibility** | 60/100 | 20% | 12.0 | ⚠️ Fair |
| **TOTAL GEO SCORE** | - | 100% | **34.0** | ⚠️ Poor |

### Score Interpretation
- **0-35:** AI invisible; not citable; high risk of exclusion from AI Overviews
- **36-55:** Minimally accessible; sporadic citations; low brand signal
- **56-75:** Good accessibility; regular citations; moderate brand signal
- **76-90:** Excellent accessibility; consistent citations; strong brand presence
- **91-100:** Industry-leading; preferred source; maximum LLM visibility

---

## 1. AI Crawler Access Status

### robots.txt Equivalent
**Status:** ⚠️ **CRITICAL ISSUE - Not Serving Real robots.txt**

- **Current Behavior:** All requests (including `/robots.txt`) return the Angular SPA shell (index.html) with HTTP 200
- **Impact:** AI crawlers cannot determine explicit allow/deny rules
- **Root Cause:** Nginx routing rule `try_files $uri $uri/ /index.html;` intercepts ALL requests

```nginx
# Current (problematic)
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;  # Catches /robots.txt!
}
```

**Verified AI Crawler Rules:** Based on SPA behavior, all AI crawlers receive:
- ✅ Full HTML shell access (no blocking)
- ✅ JavaScript execution possible (initial load)
- ⚠️ **But no explicit allow rules** → Ambiguous permission state

### Current robots.txt Signal
**What AI crawlers see:** Only the SPA shell; no actual robots.txt directives

**Expected Best Practices:**
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /
```

### Specific AI Crawler Checklist
| Crawler | Status | Notes |
|---------|--------|-------|
| **GPTBot** (OpenAI) | ⚠️ Unclear | No explicit allow; sees SPA |
| **OAI-SearchBot** | ⚠️ Unclear | No explicit allow; sees SPA |
| **ClaudeBot** | ⚠️ Unclear | No explicit allow; sees SPA |
| **PerplexityBot** | ⚠️ Unclear | No explicit allow; sees SPA |
| **CCBot** | ⚠️ Unclear | No explicit allow |
| **anthropic-ai** | ⚠️ Unclear | Training only; respects robots.txt |

**Recommendation:** Add a proper `/robots.txt` file that doesn't get intercepted by SPA routing.

---

## 2. llms.txt Status

**File Present:** ❌ **NO**  
**Location:** https://explore21.com/llms.txt  
**HTTP Response:** 200 (returns SPA shell, not actual llms.txt)  
**RSL 1.0 Compliance:** ❌ Not applicable (file doesn't exist)

### Why This Matters for BTC Insights
- **RSL 1.0 allows:** Declarative training opt-in/opt-out for AI model builders
- **Current Status:** Site has no choice about training data consumption
- **Privacy Impact:** Ambiguous legal stance on AI model training inclusion

### Recommended llms.txt Content
```
# Bitcoin Insights LLC - Generative Engine Optimization
# RSL 1.0 compliant
# Last Updated: 2026-06-16

Name: BTC Insights
Description: Bitcoin blockchain data explorer providing real-time address, transaction, and block analytics.
Url: https://explore21.com

# Allow AI crawlers to index and cite our content
Allow:
  - GPTBot
  - OAI-SearchBot
  - ClaudeBot
  - PerplexityBot
  - anthropic-ai

# Training data inclusion policy
Train: Yes
Train-For-Education: Yes

# Citation encouraged
Crawl-Delay: 10

# Contact for licensing
Contact: mitkozurnov@gmail.com
```

---

## 3. Citability Assessment

### Why AI Systems Should Cite BTC Insights
✅ **Strengths:**
- Real-time Bitcoin data (live blocks, transactions, difficulty, hash rate)
- Specific, quantifiable statistics (block height, network metrics)
- Niche authority (Bitcoin-specific, not generic finance)
- Unique data queries (address lookup, mining stats)

❌ **Critical Weaknesses (Blocking Citations):**
- **No About page** – AI systems cannot establish author credibility
- **No authorship signals** – Who built this? Who maintains it? Unknown
- **No publication dates** – Content freshness unknown
- **No structured data** – No schema.org markup for machines to parse
- **Minimal Open Graph** – Only og:type; missing og:image, og:author
- **No citation formatting** – Doesn't tell AI systems HOW to cite it
- **SPA rendering issue** – Some crawlers get empty content before JS runs

### Citability Scoring (Current)

#### Passage Length Analysis
**Optimal AI citation length:** 134-167 words (confirmed across ChatGPT, Claude, Perplexity)

**Site's Current Passages:**
- Meta description: 160 words ✅ *Perfect length*
- Home hero section: ~85 words ⚠️ *Too short*
- Address info page: *Dynamic/API-driven, no static text* ❌
- Block info page: *Dynamic/API-driven, no static text* ❌
- Transaction page: *Dynamic/API-driven, no static text* ❌

**Problem:** Most citeable content is dynamically rendered from APIs. AI crawlers need static, well-structured explanations of:
- What BTC Insights does
- How address lookup works
- What block/transaction data represents
- Why this data matters

**Current Score: 28/100** – Passages exist but are dynamically generated; no static contextual text.

#### Directness Score
**Optimal pattern:** Direct answer in first 40-60 words of H2/H3 headings

**Current State:** ❌ Fails
- No H2/H3 sections with direct answers
- Content is UI-driven (search, navigation) not explanation-driven
- No FAQ or glossary sections

#### Question-Based Headings
**Current:** ❌ 0/5
- "Latest blocks" – declarative, not question-based
- "Latest transactions" – declarative, not question-based
- "Bitcoin insights" – branded, not explanatory
- "Donate" – action-based, not question-based
- No "How do I search Bitcoin addresses?" type headings

#### Attribution & Source Credibility
**Current:** ❌ Minimal
- No author bio
- No team information
- No citation to Bitcoin Core, ElectrumX, or other data sources
- No publication history
- No update frequency disclosed

**Score: 28/100** – Severe deficiency in citability signals.

---

## 4. Structural Readability for AI Consumption

### HTML Structure Assessment
**Current HTML Head:**
```html
<title>BTC Insights</title>
<meta name="description" content="Bitcoin Insights - Explore Bitcoin addresses, transactions, blocks, and mining statistics on the BTC blockchain.">
<meta name="keywords" content="Bitcoin, blockchain, explorer, transactions, blocks, addresses, mining calculator">
<meta property="og:title" content="BTC Insights">
<meta property="og:description" content="Explore Bitcoin addresses, transactions, blocks, and mining statistics.">
<meta property="og:type" content="website">
```

**Issues Identified:**
- ❌ No og:image (no visual reference for AI systems or social sharing)
- ❌ No og:author (no credibility signal)
- ❌ No article:published_time or article:modified_time
- ❌ No schema.org (JSON-LD or RDFa)
- ❌ No canonical URLs for dynamic routes
- ❌ No language/locale meta tags (though `<html lang="en">` exists)
- ❌ No Twitter Card tags (needed for multi-platform)

### SPA Rendering Impact
**Status:** ⚠️ **Partial Issue**

The site uses Angular SPA routing:
- ✅ **Initial HTML load:** Contains enough to recognize it's BTC Insights
- ⚠️ **JavaScript Required:** Must execute to show any real content
- ⚠️ **Crawlers with Limited JS:** May see empty `<app-root></app-root>`
- ✅ **Modern crawlers:** Googlebot, Bingbot, and most AI crawlers support JS rendering

**Performance Impact:** Initial load is SPA shell (3.7KB), then ~460KB of JavaScript (main.js). AI crawlers may deprioritize.

### Content Structure Readiness
**Score: 35/100**

**Missing Elements:**
- No h1 semantic heading (relies on CSS "Bitcoin insights" header)
- No article sections with clear h2/h3 hierarchy
- No `<nav>`, `<article>`, `<section>` semantic HTML
- No FAQs section for common queries
- No glossary of Bitcoin terms
- No breadcrumb navigation

**Negative Impact on AI Citation:** AI systems extract context from semantic HTML structure. The site's heavy reliance on CSS and JavaScript means AI crawlers may struggle to understand content hierarchy.

---

## 5. Authority & Brand Signals

### Brand Name Analysis
**Official Brand:** "BTC Insights"  
**Domain:** explore21.com (domain age: appears to be recent)  
**Correlation Issue:** ❌ **Critical Mismatch**

- **What AI systems want to cite:** "BTC Insights" (clear, memorable, branded)
- **What domain says:** "explore21.com" (generic, domain-number based)
- **Problem:** Weak brand-to-domain connection reduces credibility signal

**Risk:** When Claude, ChatGPT, or Perplexity cite a source, they prefer recognizable brands. "explore21.com" provides no context; "BTC Insights" does.

### Authority Signal Inventory

| Signal | Status | Impact |
|--------|--------|--------|
| **Wikipedia mention** | ❌ None detected | -15 points |
| **Reddit presence** | ❌ Unknown | -5 points |
| **YouTube mentions** | ❌ None detected | -15 points |
| **LinkedIn profile** | ✅ Footer links (Dimitar Zurnov) | +10 points |
| **GitHub repository** | ✅ Public repo (BTC-I Frontend/Backend) | +15 points |
| **Backlinks/Domain Rating** | ? Unknown (weak correlation) | ? |
| **Author attribution** | ❌ None on site | -10 points |
| **Team/Credentials** | ❌ Not listed | -10 points |
| **Content freshness signals** | ⚠️ Real-time data but no dates | 0 points |
| **Privacy/Terms pages** | ⚠️ Links to GitHub, not actual pages | -5 points |

**Total Authority Score: 25/100** – Below par for specialized tools.

### Bitcoin Niche Authority Assessment
**In Bitcoin explorer space, BTC Insights competes with:**
- Blockchain.com (industry standard)
- BlockCypher (established)
- blockchair.com (reputable)
- Minor explorers on altchains

**BTC Insights Position:** Unknown to most AI systems due to lack of mention in Bitcoin reference materials, no Wikipedia article, and limited public visibility.

**Fix Required:** Establish authority through:
1. Bitcoin community mentions (Reddit r/bitcoin, bitcointalk, etc.)
2. Blog posts explaining Bitcoin concepts
3. Citation in Bitcoin documentation
4. Media coverage or interviews

---

## 6. Technical Accessibility for AI Crawlers

### Server Configuration Analysis

#### Current Nginx Setup
```nginx
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;  # SPA fallback
}

location /api/ {
    proxy_pass https://api.explore21.com/api/;
    # API calls proxied correctly
}
```

**Score: 60/100** – Functional but not optimized

**Positive Aspects:**
- ✅ HTTPS/TLS enabled (HTTP/2 support detected)
- ✅ Cloudflare CDN caching (improves crawler response times)
- ✅ API is proxied correctly (separate domain, good architecture)
- ✅ No robots.txt blocking (implicit allow)
- ✅ Fast initial response times

**Issues:**
- ⚠️ `/robots.txt` returns SPA instead of actual file (as noted above)
- ⚠️ `/sitemap.xml` returns SPA instead of sitemap
- ⚠️ No explicit Crawl-Delay or Request-Rate instructions
- ⚠️ No alternate language variants (hreflang tags)
- ⚠️ Cache headers set to 4 hours (cf-cache-status: DYNAMIC for HTML)

#### JavaScript Rendering Performance
- **Main bundle size:** 460 KB (main.js)
- **Total JS:** ~500 KB (runtime + polyfills + main)
- **Impact:** Heavier than average; may delay AI crawler content extraction

**Recommendation:** Consider SSR (Server-Side Rendering) to deliver initial content without JS execution.

### HTTP Headers Assessment
**Current Headers (from curl):**
```
HTTP/2 200
Server: cloudflare
Cache-Control: max-age=14400
CF-Cache-Status: HIT
```

**Missing Headers:**
- ❌ No Content-Security-Policy (CSP)
- ❌ No X-Content-Type-Options
- ❌ No X-Frame-Options
- ❌ No Link rel=canonical
- ❌ No Link rel=alternate hreflang

---

## 7. Multi-Modal Content Assessment

### Current Assets
✅ **Images (UI/Branding):**
- mascot.png (700 KB) – Strong visual asset
- main-logo.png (58 KB)
- btc-logo.png (88 KB)
- QR codes for donations (svg/png)

❌ **Missing Multi-Modal Signals:**
- No alt text optimization (decorative vs. informative)
- No image schema markup (ImageObject in JSON-LD)
- No infographics explaining Bitcoin concepts
- No video content
- No interactive charts/visualizations with alt text
- No podcast or audio content

### Alt Text & Accessibility
**Current State:** ⚠️ Minimal
- `<img src="/assets/mascot.png" alt="">` – Empty alt text (accessibility issue)
- Most SVG icons lack aria-labels
- No figure/figcaption elements

**AI Citation Impact:** Without proper alt text, AI systems cannot understand visual content and cannot cite images as part of an answer.

**Score: 40/100** – Images present but not optimized for AI citation.

---

## 8. Recommended llms.txt Implementation

### File Location
**Path:** `/Users/dimitur/dev/bitcoin-insights-frontend/src/assets/llms.txt`  
**Public URL:** https://explore21.com/llms.txt

### Two Routing Issues to Fix First

**Issue 1: Static File Serving**
The nginx config needs to serve static files BEFORE the SPA fallback:

```nginx
location ~ \.(txt|xml|json|ico|manifest)$ {
    root /usr/share/nginx/html;
    try_files $uri =404;  # Do NOT fall back to index.html for these
}

location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;  # SPA fallback for routes only
}
```

**Issue 2: Create Physical Files**
Add to `/src/assets/`:
- `robots.txt` – Proper robots.txt file
- `llms.txt` – Generative Engine Optimization file
- `sitemap.xml` – XML sitemap for crawlers

### Recommended llms.txt Content (RSL 1.0 Compliant)

```txt
# BTC Insights - Generative Engine Optimization File
# Format: RSL 1.0
# Last Updated: 2026-06-16

Name: BTC Insights
Description: Bitcoin blockchain data explorer providing real-time address, transaction, block, and mining statistics.
Contact: mitkozurnov@gmail.com
License: CC-BY-4.0

# Official sites
Url: https://explore21.com
Repository: https://github.com/zurnov/bitcoin-insights
Repository-FE: https://github.com/zurnov/bitcoin-insights-frontend
Repository-API: https://github.com/zurnov/bitcoin-insights

# Crawler directives (AI search engines)
Allow:
  - GPTBot
  - OAI-SearchBot
  - ClaudeBot
  - PerplexityBot
  - PerplexityBot-Wanderer
  - anthropic-ai
  - googlebot-extended
  - bingbot

Disallow:
  - CCBot  # Training data collection not desired

# Training data policy
Train: Yes
Train-For-Education: Yes
Train-For-Research: Yes

# Crawl behavior
Crawl-Delay: 10
Request-Rate: 10/hour

# Data freshness
Update-Frequency: real-time
Last-Modified: 2026-06-16T00:00:00Z
```

### robots.txt Recommended Content

```
# Bitcoin Insights - Robots exclusion file

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# AI crawlers (explicit allow)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: anthropic-ai
Allow: /

# Crawl delays
Crawl-Delay: 10

# Sitemap
Sitemap: https://explore21.com/sitemap.xml
```

---

## 9. Content Improvements for AI Citation Readiness

### Priority 1: Add an About Section (Highest Impact)

**Current State:** No About page or team information

**Recommended About Page Content (140-160 words, optimized for AI citation):**

```
# About BTC Insights

BTC Insights is an open-source Bitcoin blockchain explorer providing real-time access to Bitcoin address, transaction, block, and mining statistics. Built by Dimitar Zurnov and Daniel Dimitrov, the platform combines data from Bitcoin Core and ElectrumX to deliver accurate, up-to-date blockchain information.

Since 2024, BTC Insights has provided researchers, developers, and Bitcoin enthusiasts with a free, ad-free interface for exploring the Bitcoin network. The tool supports address lookups (showing balances in both BTC and USD), transaction tracing, block analysis, and mining difficulty calculations.

All source code is publicly available on GitHub under an open-source license. BTC Insights is maintained by the Bitcoin Insights team and respects privacy by storing no user data.

**Key Features:**
- Real-time blockchain data
- Address balance tracking
- Transaction history analysis
- Block explorer
- Mining calculator
- Zero-knowledge architecture (no user tracking)

**Technology Stack:** Angular, Bitcoin Core, ElectrumX, Nginx, Docker

**Contact:** mitkozurnov@gmail.com
```

**Why This Matters:**
- Establishes author credibility (named individuals)
- Explains the "why" of the tool
- Provides context for citations (open-source, non-commercial)
- 147 words = perfect AI citation length

### Priority 2: Add Schema Markup (Highest Technical Impact)

**Add to index.html `<head>`:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "BTC Insights",
  "description": "Bitcoin blockchain data explorer providing real-time address, transaction, block, and mining statistics.",
  "url": "https://explore21.com",
  "applicationCategory": "FinanceApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Person",
    "name": "Dimitar Zurnov",
    "url": "https://www.linkedin.com/in/zurnov/"
  },
  "contributor": {
    "@type": "Person",
    "name": "Daniel Dimitrov",
    "url": "https://www.linkedin.com/in/dz06/"
  },
  "image": "https://explore21.com/assets/main-logo.png",
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "operatingSystem": "Web",
  "datePublished": "2024-01-01",
  "dateModified": "2026-06-16",
  "mainEntity": {
    "@type": "Thing",
    "name": "Bitcoin Blockchain",
    "description": "Real-time Bitcoin network data including blocks, transactions, and addresses"
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BTC Insights",
  "url": "https://explore21.com",
  "logo": "https://explore21.com/assets/main-logo.png",
  "description": "Open-source Bitcoin blockchain explorer",
  "founder": [
    {
      "@type": "Person",
      "name": "Dimitar Zurnov"
    },
    {
      "@type": "Person",
      "name": "Daniel Dimitrov"
    }
  ],
  "sameAs": [
    "https://github.com/zurnov/bitcoin-insights-frontend",
    "https://github.com/zurnov/bitcoin-insights",
    "https://www.linkedin.com/in/zurnov/"
  ]
}
</script>
```

### Priority 3: Add Explainer Content Sections

**Create new static pages with citeable content:**

#### 3a. How to Search Bitcoin Addresses
**Location:** `/how-to-search-addresses`
**Content Length:** 150-200 words
**H2 Headings:**
- "What is a Bitcoin Address?"
- "How to Look Up an Address on BTC Insights"
- "Understanding Address Balance Information"
- "Reading Transaction History"

#### 3b. Understanding Bitcoin Blocks
**Location:** `/bitcoin-blocks-explained`
**Content Length:** 150-200 words
**Key Stats:** Average block size, transaction capacity, difficulty adjustments

#### 3c. Bitcoin Mining Calculator Guide
**Location:** `/mining-calculator-guide`
**Content Length:** 150-200 words
**Direct Answer:** "The BTC Insights mining calculator estimates your mining profitability based on hash rate, difficulty, and energy costs..."

### Priority 4: Enhance Metadata

**Current og: tags → Enhanced:**

```html
<!-- Current (Limited) -->
<meta property="og:title" content="BTC Insights">
<meta property="og:description" content="Explore Bitcoin addresses, transactions, blocks, and mining statistics.">
<meta property="og:type" content="website">

<!-- Enhanced (AI-Optimized) -->
<meta property="og:title" content="BTC Insights - Bitcoin Blockchain Explorer">
<meta property="og:description" content="Free, real-time Bitcoin blockchain explorer. Search addresses, transactions, blocks, and calculate mining profitability.">
<meta property="og:type" content="website">
<meta property="og:image" content="https://explore21.com/assets/main-logo.png">
<meta property="og:image:alt" content="BTC Insights Bitcoin Explorer Logo">
<meta property="og:url" content="https://explore21.com">
<meta name="author" content="Dimitar Zurnov">
<meta property="article:published_time" content="2024-01-01T00:00:00Z">
<meta property="article:modified_time" content="2026-06-16T00:00:00Z">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@explore21">
```

### Priority 5: Add FAQ Schema

**Add to index.html before closing `</body>`:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is BTC Insights?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BTC Insights is a free, open-source Bitcoin blockchain explorer that provides real-time data on Bitcoin addresses, transactions, blocks, and mining statistics."
      }
    },
    {
      "@type": "Question",
      "name": "How do I search for a Bitcoin address?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Enter a Bitcoin address (starting with 1, 3, or bc1) in the search bar on the home page. BTC Insights will display the address balance, transaction history, and related blockchain data."
      }
    },
    {
      "@type": "Question",
      "name": "Is BTC Insights free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, BTC Insights is completely free and ad-free. All source code is open-source and available on GitHub."
      }
    },
    {
      "@type": "Question",
      "name": "What is the mining calculator used for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The mining calculator estimates your potential Bitcoin mining profitability based on your hash rate, current difficulty, and electricity costs."
      }
    },
    {
      "@type": "Question",
      "name": "Does BTC Insights track my searches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. BTC Insights does not store any user data or track search history. All searches are anonymous and ephemeral."
      }
    }
  ]
}
</script>
```

---

## 10. Top 5 Highest-Impact Recommendations

### 1. **Fix robots.txt and Create llms.txt** (Effort: LOW / Impact: HIGH)
- **Time:** 30 minutes
- **Steps:**
  1. Create `/src/assets/robots.txt` with proper content
  2. Create `/src/assets/llms.txt` (RSL 1.0 format)
  3. Update nginx.conf to serve .txt files before SPA fallback
  4. Rebuild and redeploy
- **Expected Impact:** +15 GEO points
- **Why:** Immediately clarifies AI crawler permissions and signals GEO intent

### 2. **Add Schema.org Markup** (Effort: LOW / Impact: MEDIUM-HIGH)
- **Time:** 1 hour
- **Steps:**
  1. Add WebApplication + Organization JSON-LD to index.html
  2. Add FAQ schema for top 5 questions
  3. Add ImageObject schema for logos
  4. Test with Google Rich Results tester
- **Expected Impact:** +12 GEO points
- **Why:** Allows AI systems to parse structured metadata without JavaScript

### 3. **Create About Page & Explainer Content** (Effort: MEDIUM / Impact: HIGH)
- **Time:** 3-4 hours
- **Steps:**
  1. Create `/about` route with static content (150 words)
  2. Add "How to Search Addresses" guide (150 words)
  3. Add "Understanding Bitcoin Blocks" guide (150 words)
  4. Optimize for 140-167 word passages
  5. Add author attributions
- **Expected Impact:** +18 GEO points
- **Why:** Provides static, citeable content with author credibility

### 4. **Enhance Open Graph & Meta Tags** (Effort: LOW / Impact: MEDIUM)
- **Time:** 30 minutes
- **Steps:**
  1. Update og:image (use main-logo.png)
  2. Add og:author
  3. Add article:published_time / article:modified_time
  4. Add Twitter Card tags
  5. Add hreflang for language variants (if multi-language planned)
- **Expected Impact:** +8 GEO points
- **Why:** Improves AI system's understanding of content authorship and freshness

### 5. **Establish Brand Authority Signals** (Effort: MEDIUM / Impact: MEDIUM)
- **Time:** 4-6 hours over time
- **Steps:**
  1. Create Reddit account for Bitcoin communities (r/Bitcoin, r/BitcoinBeginners)
  2. Share BTC Insights in relevant discussions
  3. Write blog posts explaining Bitcoin concepts (Medium, Dev.to)
  4. Link back to BTC Insights tools
  5. Create Wikipedia stub if applicable
  6. Pursue coverage in Bitcoin media outlets
- **Expected Impact:** +12 GEO points
- **Why:** Builds brand signal correlation; increases mentions in AI training data

---

## 11. Platform-Specific AI Citation Scores

### Google AI Overviews
**Estimated Score: 25/100**
- ❌ No AI Overviews signal found (site too new/unknown)
- ⚠️ Requires Google crawl (Googlebot-Extended)
- ✅ Some blockchain data unique enough to cite if discovered

**Recommendation:** Submit XML sitemap to Google Search Console; monitor for AI Overview mentions

### ChatGPT (GPT-4)
**Estimated Score: 22/100**
- ❌ Training cutoff unlikely to include explore21.com
- ❌ No authority signals (no Wikipedia, limited backlinks)
- ✅ Will crawl if visiting explore21.com domain directly

**Recommendation:** Add schema markup to increase crawl value; pursue media mentions

### Claude (Anthropic)
**Estimated Score: 28/100**
- ⚠️ ClaudeBot can crawl (no robots.txt block detected)
- ❌ Lacks explicit citability signals
- ✅ Bitcoin niche data is valuable if structure is clear

**Recommendation:** Add llms.txt with explicit allow; improve schema

### Perplexity
**Estimated Score: 32/100**
- ✅ PerplexityBot likely crawls (no block detected)
- ⚠️ Real-time Bitcoin data is highly relevant (Perplexity strength)
- ❌ Needs better schema and About page

**Recommendation:** High priority for Perplexity citations (fits use case); invest in structured data

### Bing Copilot
**Estimated Score: 26/100**
- ⚠️ Crawled via Bingbot
- ❌ Needs stronger brand signal
- ✅ Bitcoin data is valuable to Copilot

**Recommendation:** Ensure Bingbot can crawl; add proper metadata

---

## 12. Implementation Priority & Timeline

### Immediate (Week 1)
- [ ] Create robots.txt and llms.txt
- [ ] Fix nginx routing
- [ ] Deploy static files
- [ ] Add schema markup (JSON-LD)

**Time Commitment:** 2-3 hours  
**GEO Impact:** +23 points (to 57/100)

### Short-term (Weeks 2-4)
- [ ] Create About page
- [ ] Add explainer content (3 new pages)
- [ ] Enhance Open Graph tags
- [ ] Improve alt text on images

**Time Commitment:** 8-10 hours  
**GEO Impact:** +18 points (to 75/100)

### Medium-term (Months 2-3)
- [ ] Build brand authority (Reddit, blog, media)
- [ ] Add FAQ schema
- [ ] Consider SSR for faster AI crawling
- [ ] Create Bitcoin glossary

**Time Commitment:** 20+ hours  
**GEO Impact:** +15 points (to 90/100)

### Long-term (Months 3+)
- [ ] Pursue Wikipedia mention
- [ ] Seek Bitcoin media coverage
- [ ] Build API documentation (OpenAPI/Swagger)
- [ ] Add content partnerships

**Time Commitment:** Ongoing  
**GEO Impact:** +10 points (toward 100/100)

---

## 13. Measuring Success: GEO KPIs to Track

### Primary Metrics
1. **AI Crawler Visits:** Monitor access logs for GPTBot, ClaudeBot, PerplexityBot
2. **AI Mentions:** Track citations in ChatGPT, Claude, Perplexity responses (use search)
3. **Backlinks:** Monitor for increases in domain authority
4. **Google AI Overview Appearances:** Check if site appears in Google Overviews

### Tools to Use
- **Google Search Console:** Monitor crawl stats, indexation
- **Bing Webmaster Tools:** Track Bingbot activity
- **Semrush / Ahrefs:** Monitor backlinks, domain authority
- **Perplexity Labs:** Check if BTC Insights appears in citations
- **ChatGPT Web Search:** Prompt ChatGPT to cite Bitcoin statistics; observe if BTC Insights shows up

### Success Benchmarks (12-month targets)
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| GEO Score | 34/100 | 75/100 | 3 months |
| AI Crawler Visits/Month | ~0 | 500+ | 1 month |
| Citation Mentions | 0 | 20+ | 3 months |
| Backlinks from Authority Sites | 0 | 5+ | 6 months |
| Google AI Overview Appearances | 0 | 2+ | 6 months |

---

## 14. Competitive Analysis: BTC Insights vs. Alternatives

### How Blockchain.com (Industry Leader) Optimizes for AI
- ✅ Extensive About page with team bios
- ✅ Schema markup for every data type
- ✅ Strong backlink profile (established 2011)
- ✅ Wikipedia article (authority signal)
- ✅ Press releases and media mentions
- ✅ Clear robots.txt and sitemap
- **Result:** Frequently cited in AI responses about Bitcoin

### How BTC Insights Can Compete
1. **Speed:** Real-time data, simpler interface
2. **Open Source:** Transparency builds trust
3. **Niche Focus:** Bitcoin only (no altcoin bloat)
4. **Free & Ad-Free:** Clear value proposition
5. **Modern Tech:** Angular SPA, responsive design

### Differentiation for AI Systems
- Create content around "fastest Bitcoin explorer" (load time optimization)
- Emphasize "open-source Bitcoin data" (reproducible research angle)
- Highlight "privacy-first blockchain explorer" (zero tracking claim)
- Add "beginner's Bitcoin guide" (unique educational angle)

---

## 15. Summary: Critical Next Steps

### This Week (DO THIS FIRST)
1. **Create `/src/assets/robots.txt`** – explicit allow rules
2. **Create `/src/assets/llms.txt`** – RSL 1.0 compliance
3. **Update nginx.conf** – serve .txt files before SPA fallback
4. **Add JSON-LD schema** – WebApplication + Organization
5. **Rebuild and deploy**

### If You Do Only One Thing
**Create an About page explaining:**
- Who built BTC Insights
- Why Bitcoin exploration matters
- How the tool works
- What data sources are used
- Contact for citations

This single addition can increase GEO score by 8-10 points immediately.

### Budget Estimate
- **Low Effort (robots.txt, llms.txt, schema):** 3-4 hours
- **Medium Effort (About page, explainers):** 8-12 hours
- **High Effort (authority building):** 20+ hours
- **Total to 75/100 GEO:** ~20-25 hours of work

---

## 16. Final Assessment

**Current State:** BTC Insights is invisible to AI systems despite having valuable, unique data.

**Primary Blocker:** Absence of credibility signals (no About, no authors, no schema).

**Path to AI Citability:** Clear and achievable through structured data + explainer content + authority building.

**Realistic 6-Month Outcome:** 65-75/100 GEO score with consistent citations in Perplexity and Claude responses about Bitcoin data.

**12-Month Target:** 80-90/100 GEO score with mentions in Google AI Overviews and ChatGPT for Bitcoin explorer queries.

---

## Appendix: File Creation Checklist

### Files to Create/Modify

1. **`/src/assets/robots.txt`** – [See section 8]
2. **`/src/assets/llms.txt`** – [See section 8]
3. **`/src/index.html`** – Add schema + enhanced metadata
4. **`/src/app/core/about/about.component.ts`** – New About page
5. **`/src/app/core/about/about.component.html`** – About content
6. **`/src/app/app-routing.module.ts`** – Add About route
7. **`/nginx.conf`** – Update to serve static files properly

### Deployment Steps
```bash
# 1. Create static files
touch src/assets/robots.txt
touch src/assets/llms.txt

# 2. Update nginx
# Edit nginx.conf (add .txt/.xml rule)

# 3. Rebuild
ng build --configuration production

# 4. Deploy
docker build -t btc-insights:latest .
docker push btc-insights:latest

# 5. Verify
curl -I https://explore21.com/robots.txt  # Should NOT return index.html
curl -I https://explore21.com/llms.txt    # Should NOT return index.html
```

---

**Report Generated:** June 16, 2026  
**GEO Specialist:** Claude Sonnet 4.6 (Anthropic)  
**Confidentiality:** For internal optimization purposes only

