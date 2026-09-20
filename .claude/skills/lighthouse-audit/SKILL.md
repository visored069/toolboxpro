---
name: lighthouse-audit
description: >
  USE when the user wants a Lighthouse-style audit of performance,
  accessibility, best-practices, or SEO for any website — e.g. "audit my
  site's SEO", "check performance scores", "Lighthouse report", "accessibility
  audit". Two paths: (A) Google's PageSpeed Insights API (no install needed,
  works in Freebuff today) and (B) running Lighthouse locally via npx and
  reading the generated JSON report (user-approved terminal work).
source: https://github.com/GoogleChrome/lighthouse
---

# Lighthouse — web quality auditing

Lighthouse is Google's audit tool for performance, accessibility, best
practices, and SEO. Freebuff cannot execute the Lighthouse CLI in-browser,
but two practical paths exist.

## Path A — PageSpeed Insights API (works in Freebuff today)

Google runs Lighthouse as a service. Fetch this URL with the URL-reading
tool (URL-encode the target):

```
https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<ENCODED_URL>&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile
```

- `strategy=` `mobile` (default, recommended) or `desktop`
- Omit `category` params to get all categories
- The JSON response contains `lighthouseResult.categories` (scores 0–1 per
  category), `lighthouseResult.audits` (individual checks with `score`,
  `displayValue`, `details`), and `loadingExperience` (real-user CrUX field
  data when available).

Practical notes:
- The public API is **rate-limited** — a `429 Too Many Requests` means wait
  and retry later (minutes, not seconds); it does not mean the site is broken.
- The first JSON block can be huge; if the read truncates, re-fetch with the
  same URL and extract specific audits by name
  (`lighthouseResult.audits["first-contentful-paint"]`,
  `.audits["largest-contentful-paint"]`, `.audits["cumulative-layout-shift"]`,
  `.audits["total-blocking-time"]`, `.audits["server-response-time"]`).
- No API key needed for light use; add `&key=<API_KEY>` for reliable quota.

## Path B — Lighthouse CLI locally (requires user-approved terminal)

With the user's approval, run once (Node is required):

```
npx lighthouse <URL> --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```

Then read `lighthouse-report.json` (a `read_files` call with an offset around
the `categories`/`audits` keys avoids loading the whole multi-MB file).
CI variant: `npx @lhci/cli autorun` (Lighthouse CI) collects reports and
enforces score budgets.

## Auditing Freebuff-built sites

For this workspace's own sites, prefer Path A against the **production**
domain; the local dev server can also be audited but scores will include
unminified sources. For static sites, the usual high-impact findings are:
unoptimized images (add width/height + compression), missing meta
descriptions, contrast failures in dark mode, missing `lang` attribute,
and render-blocking font CSS.

## Interpreting scores

0.9–1.0 good · 0.5–0.9 needs improvement · <0.5 poor. Report category
scores plus the failing audits with the largest score deficits — never
report only the aggregate.
