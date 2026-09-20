---
name: owasp-cheatsheets
description: >
  USE when researching application security best practices, secure coding
  guidance, vulnerability classes, or hardening recommendations — e.g.
  "how should I prevent XSS", "review this auth flow against OWASP guidance",
  "secure session management", "CSRF protection", "API security checklist",
  "secure CI/CD". Gives live access to the official OWASP Cheat Sheet Series
  (~400 peer-reviewed guides). Complements the static owasp-security skill:
  use that for a quick Top-10 frame, this for deep, current topic guidance.
source: https://github.com/OWASP/CheatSheetSeries (branch: master)
---

# OWASP Cheat Sheet Series — live security research

The official OWASP Cheat Sheet Series repo holds ~400 markdown cheat sheets
covering authentication, authorization, XSS, CSRF, SQL injection, secrets
management, API security, CI/CD security, container security, and more.
Freebuff's web tools can fetch them directly — no extra tools required.

## How to find a sheet

1. List available sheets (paginated API; each entry has `name` and `download_url`):

```
https://api.github.com/repos/OWASP/CheatSheetSeries/contents/cheatsheets
```

2. Fetch a sheet's full content from its raw URL (pattern is stable):

```
https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/cheatsheets/<Sheet_Name>.md
```

Sheet filenames use underscores instead of spaces and end in
`_Cheat_Sheet.md`, e.g. `Session_Management_Cheat_Sheet.md`,
`Cross_Site_Scripting_Prevention_Cheat_Sheet.md`,
`REST_Security_Cheat_Sheet.md`. When unsure of the exact name, grab it from
the directory listing in step 1 — never guess a filename.

Notes:
- Branch is **master** (not main).
- The API response for step 1 can be large; it is truncated per page
  (30 entries) — follow the `Link`-style continuation by appending
  `?page=2`, `?page=3`, etc.
- The official rendered website (https://cheatsheetseries.owasp.org) mirrors
  the same content if the raw fetch of a specific sheet fails.

## How to use the content

- Quote or cite the specific cheat sheet name when applying its guidance.
- Cheat sheets are working sources; prefer them over memorized guidance for
  anything version-sensitive (headers, CSP, cookie flags, TLS config).
- For security review tasks, pair this skill with the static
  `owasp-security` / `vibesec` skills: static skill for breadth, live cheat
  sheet for depth on the specific finding.

## Commonly requested sheets (verified names)

| Topic | Sheet |
|---|---|
| Sessions | `Session_Management_Cheat_Sheet.md` |
| AuthN | `Authentication_Cheat_Sheet.md` |
| AuthZ | `Authorization_Cheat_Sheet.md` |
| XSS | `Cross_Site_Scripting_Prevention_Cheat_Sheet.md` |
| CSRF | `Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md` |
| SQLi | `SQL_Injection_Prevention_Cheat_Sheet.md` |
| APIs | `REST_Security_Cheat_Sheet.md`, `API_Security_Cheat_Sheet.md` |
| CSP | `Content_Security_Policy_Cheat_Sheet.md` |
| Secrets | `Secrets_Management_Cheat_Sheet.md` |
| CI/CD | `CI_CD_Security_Cheat_Sheet.md` |
| Containers | `Docker_Security_Cheat_Sheet.md`, `Kubernetes_Security_Cheat_Sheet.md` |
| LLM/AI | `LLM_Prompt_Injection_Prevention_Cheat_Sheet.md` |

(If any specific fetch 404s, fall back to the directory listing to get the
current exact filename — OWASP renames sheets occasionally.)
