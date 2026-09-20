---
name: browsing-hackernews
description: "Use when the user wants to interact with Hacker News (news.ycombinator.com) — read top stories from the frontpage, extract a post's data and comments, or search stories via the Algolia HN search API. No authentication required. HN uses server-rendered HTML, so extraction works reliably without a browser (though a browser still works fine)."
source: https://github.com/browsing-skills/browsing-skills/tree/main/skills/news.ycombinator.com
---

# Hacker News — Browsing Skill

Use this index to choose the HN action that matches the user request, then open the linked reference file for the complete navigation, requirements, code, and return shape.

## Freebuff runtime note

Freebuff has no live-browser JS execution on external sites, so the `page.evaluate` snippets in the references cannot run verbatim. Equivalent Freebuff paths that DO work:

- **search** → call the Algolia API directly, e.g. read `https://hn.algolia.com/api/v1/search?query=<url-encoded-query>&tags=story&hitsPerPage=<n>` — returns the exact JSON shape documented in [references/search.md](references/search.md).
- **frontpage** → read `https://news.ycombinator.com/` (server-rendered; the extracted text contains rank, title, domain, score, author, age, and comment counts in order — parse positionally).
- **post-data** → read `https://news.ycombinator.com/item?id=<id>` and parse title/score/author/comments from the extracted text.

## Action Index

- **frontpage** — Extract top stories from the HN frontpage (rank, title, URL, score, author, comment count). Supports pagination. Full spec: [references/frontpage.md](references/frontpage.md).
- **post-data** — Extract a specific post's details (title, URL, score, author, age) and its top-level comments. Full spec: [references/post-data.md](references/post-data.md).
- **search** — Search Hacker News stories via the Algolia HN search API. No browser navigation required — calls the API via fetch. Full spec: [references/search.md](references/search.md).

## Benchmarks

Benchmarks compare the maintained skill action against a no-skill browser agent that inspects the live page DOM and derives selectors at runtime. Full notes live in [BENCHMARKS.md](https://github.com/browsing-skills/browsing-skills/blob/main/BENCHMARKS.md) in the source repo.

| Action | With Skill | Without Skill | Notes |
|---|---:|---:|---|
| frontpage | TBD | TBD | TBD |
| post-data | TBD | TBD | TBD |
| search | TBD | TBD | TBD |
