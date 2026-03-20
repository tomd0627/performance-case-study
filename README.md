# BlueMorning Coffee — Web Performance Case Study

A real-world web performance case study documenting how a fictional local business site was taken from **Lighthouse 23 to 98** by eliminating render-blocking resources, fixing cumulative layout shift, and cutting page weight by 95%.>

---

## What's in this repo

| Path           | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `index.html`   | The case study page — findings, optimisations, results, tools |
| `assets/`      | CSS, JS, and SVG favicon for the case study page              |
| `before/`      | The unoptimised BlueMorning Coffee demo (intentionally bad)   |
| `after/`       | The fully optimised BlueMorning Coffee demo                   |
| `netlify.toml` | Cache headers and redirect config                             |
| `robots.txt`   | Disallows indexing of before/after demos                      |

---

## The eight optimisations

| #   | Fix                                               | Impact                  |
| --- | ------------------------------------------------- | ----------------------- |
| 1   | PNG → WebP at quality 80                          | 4.2MB → 180KB           |
| 2   | Explicit image dimensions + lazy loading          | CLS 0.34 → 0.01         |
| 3   | LCP image preload with `fetchpriority="high"`     | LCP contributed         |
| 4   | Non-blocking font loading (print/onload trick)    | Render-blocking removed |
| 5   | Remove jQuery, replace with 0.8KB vanilla JS      | 90KB → 0.8KB            |
| 6   | Critical CSS inlined, rest loaded non-blocking    | First paint unblocked   |
| 7   | Remove Bootstrap 5 (94% unused), write custom CSS | 94KB saved              |
| 8   | `preconnect` hints + long-lived cache headers     | Repeat visits −90%      |

---

## Results

| Metric                 | Before | After |
| ---------------------- | ------ | ----- |
| Lighthouse Performance | 23     | 98    |
| LCP                    | 8.4s   | 0.9s  |
| CLS                    | 0.34   | 0.01  |
| Page weight            | 5.8MB  | 312KB |
| HTTP requests          | 47     | 12    |

---

## Tools used

All free, no paid subscriptions required.

- **Chrome DevTools** — Performance tab, Network throttling, Coverage
- **PageSpeed Insights** — Lab + field (CrUX) data
- **Squoosh** — PNG → WebP conversion
- **WebPageTest** — Waterfall analysis, filmstrip view

---

## Running locally

No build step. Open `index.html` directly in a browser or use any static server:

```bash
npx serve .
```

---

## Deployment

Deployed on Netlify via Git integration. Cache headers are configured in `netlify.toml`.
