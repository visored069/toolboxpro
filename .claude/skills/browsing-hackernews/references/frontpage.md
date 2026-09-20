# Hacker News — Frontpage Reference

## Requirements
**Auth:** Not required. HN frontpage is public.
**Browser:** Not required. HN is server-rendered HTML — a static HTTP fetch is sufficient, but a browser works fine too.

## Freebuff runtime note
No `page.evaluate` available in Freebuff. Instead, read `https://news.ycombinator.com/` (or `https://news.ycombinator.com/news?p=<page>` for pagination) with the URL-reading tool and parse the extracted text: stories appear in order with rank, title, domain, points, author, age, and comment count. The JSON snippets below document the canonical return shape to reproduce in your summary.

## How to run this action (browser agents)
Navigate to the page, then execute the action's code via `page.evaluate()` (or the chrome-bridge `/run-action` endpoint):
```js
const result = await page.evaluate(async (code) => {
  const tool = eval(code);
  return await tool.execute({ mode: "data", page: 1 });
}, scriptCode);
const data = JSON.parse(result.content[0].text);
```
Use `mode: "display"` for self-contained HTML output instead of JSON.

---

## Action: frontpage
Use when the user wants to read the top stories currently listed on Hacker News.

**Navigate to:** `https://news.ycombinator.com/` for page 1, or `https://news.ycombinator.com/news?p=<page>` for subsequent pages.

**Returns:** `{ stories: [{ id, rank, title, url, domain, score, author, age, commentsUrl, commentsCount, hnUrl }], totalStories, page }`
