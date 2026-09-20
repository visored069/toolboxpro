# Hacker News — Search Reference

## Requirements
**Auth:** Not required. The Algolia HN search API is public and CORS-open.
**Browser:** Not required. The action calls the Algolia HN search API via `fetch()` — no page DOM inspection needed.

## Freebuff runtime note
This action is **fully functional in Freebuff** — the Algolia API is a plain public HTTP endpoint. Call it directly with the URL-reading tool:

```
https://hn.algolia.com/api/v1/search?query=<url-encoded-query>&tags=story&hitsPerPage=<limit>
```

The response JSON `hits[]` fields map to the documented return shape: `objectID`, `title`, `url`, `author`, `points`, `num_comments` → `commentsCount`, `created_at` → `createdAt`, and `hnUrl` = `https://news.ycombinator.com/item?id=<objectID>`. `nbHits` → `totalFound`. Useful extra params: `tags=(story,comment)` or omit `tags` for all, `page`/`hitsPerPage` for pagination, and `search_by_date` variant at `/api/v1/search_by_date` for time-sorted results.

---

## Action: search
Use when the user wants to search Hacker News for stories by keyword, topic, or phrase. Uses the Algolia HN search API — no DOM scraping required.

**Endpoint:** `https://hn.algolia.com/api/v1/search?query=<query>&tags=story&hitsPerPage=<limit>`

**Returns:** `{ query, totalFound, stories: [{ objectID, title, url, author, points, commentsCount, createdAt, hnUrl }] }`
