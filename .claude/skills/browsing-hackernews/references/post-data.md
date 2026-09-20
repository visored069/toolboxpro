# Hacker News — Post Data Reference

## Requirements
**Auth:** Not required. HN item pages are public.
**Browser:** Not required. HN is server-rendered HTML — a static HTTP fetch is sufficient, but a browser works fine too.

## Freebuff runtime note
No `page.evaluate` available in Freebuff. Instead, read `https://news.ycombinator.com/item?id=<id>` with the URL-reading tool and parse the extracted text: title, points, author, age, and top-level comments (author, age, text) appear in document order. Nested replies are indented in the source; the text extraction flattens indentation, so treat deep threads as best-effort.

## How to run this action (browser agents)
Navigate to the item page, then execute the action's code via `page.evaluate()` (or the chrome-bridge `/run-action` endpoint):
```js
const result = await page.evaluate(async (code) => {
  const tool = eval(code);
  return await tool.execute({ mode: "data" });
}, scriptCode);
const data = JSON.parse(result.content[0].text);
```

---

## Action: post-data
Use when the user wants the details of a specific HN post (title, URL, score, author, age) plus its top-level comments.

**Navigate to:** `https://news.ycombinator.com/item?id=<id>` (the post's HN item URL).

**Returns:** `{ storyId, title, url, score, author, age, commentsCount, comments: [{ author, age, text, indentLevel }] }`
