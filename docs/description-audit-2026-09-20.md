# AI Tool Description Audit — 2026-09-20

Scope: all 80 descriptions in `ai-registry.js` and every surface they appear on
(directory cards, detail pages, category pages, homepage, meta descriptions).

## Method

Every description was checked for four failure classes:

1. **Superlatives / "best-in-class" claims** — no verified basis
2. **Unverifiable quality/speed claims** — "studio quality", "ultra-fast", "in seconds"
3. **Counts, versions, durations** — go stale; removed in the earlier accuracy pass
4. **Marketing-copy echo** — wording lifted from the vendor's own positioning rather than neutral capability description

## Findings and fixes (10 descriptions rewritten)

| Tool | Removed claim | Replacement |
|---|---|---|
| elevenlabs | "Most realistic AI voice synthesis" | "AI voice synthesis with voice cloning, text-to-speech, voice changer, and dubbing" |
| stable-diffusion | "massive community" | "community support" |
| flux | "Ultra-fast", "fast inference" | "Photorealistic output, available via API or local deployment" |
| bolt-new | "deploy in seconds" | "code, preview, and deploy" |
| looka | "in minutes" | removed |
| obviously-ai | "in minutes" | removed |
| udio | "studio quality", "realistic vocals" | "vocals and full arrangements" |
| playground-ai | "with commercial license" (unverified licensing term) | "AI image generation and editing" |
| gamma | "beautiful, web-native" | "a web-native format" |
| murf-ai | "studio-quality narration" | "narration in many voices and languages" |

All replacements propagated to every surface: registry, directory cards (full +
lowercase `data-desc`), truncated related-tool snippets on detail/category pages,
meta descriptions.

## Kept deliberately (not violations)

- **"Photorealistic"** (Midjourney, Sora, Flux) — describes output style category, not a superiority ranking.
- **"Enterprise"** (Jasper, Phrasee) — describes target market, verifiable from product positioning.
- **"Open-source"** (Stable Diffusion, Hugging Face, Botpress, LangChain, Vercel AI SDK) — factual, verifiable licensing.
- **"Commercially safe / trained on licensed content"** (Adobe Firefly) — Adobe's own explicit, documented product guarantee.
- **Category nouns like "3D", "real-time"** — capability terms, not claims.

## Enforcement going forward

`node lint-registry.js` (also run by `npm run build`) now fails on:
- model/version strings, all superlatives (incl. "most realistic"), and the
  quality/speed phrases found in this audit ("studio quality", "ultra-fast",
  "in seconds/minutes", "massive community", "commercial license", "beautiful")
- any digit in a description unless whitelisted per-tool (only product names exempt)
- structural drift: wrong tool count, duplicate slugs, missing `lastVerified`,
  invalid hex colors, categories under 6 tools

Adding a tool with an unsupported claim now **breaks the build** instead of shipping.
