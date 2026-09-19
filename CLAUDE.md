# AI Directories — Agent Working Rules

Project: AI Directories (formerly ToolBox Pro) — static AI-tools directory + 26 browser-based developer tools.
Live: https://toolboxpro-theta.vercel.app/ → canonical https://aidirectories.in

## Standing defaults (apply to EVERY task)

1. **Karpathy discipline** (`.claude/skills/karpathy-guidelines/SKILL.md`): state assumptions, minimum code, no speculative features, surface tradeoffs, surgical changes only. Applied by default, not opt-in.
2. **Workflow** (superpowers skills, installed): new feature → clarifying questions → saved spec (`specs/`) → plan → TDD where testable → verification-before-completion. Full plugin pipeline via `/plugin install superpowers@claude-plugins-official` in Claude Code.
3. **Design taste**: taste-skill + impeccable rules govern every UI task — no purple-gradient-by-default, no generic centered-hero + three cards, OKLCH colors, deliberate typography pairing, real spacing/motion. Run `/impeccable critique` (or the audit skill) before finishing frontend work and fix what it flags.
4. **Security**: before finishing any auth/backend/input-handling task, run through `.claude/skills/owasp-security/SKILL.md` + `.claude/skills/vibesec/SKILL.md` checklists.
5. **Live docs**: Context7 MCP is configured (`.mcp.json`) — pull current framework docs instead of trusting training data when using any specific library.
6. **Self-verification**: Playwright MCP (`.mcp.json`) — smoke-test new pages/components in the browser before calling them done.
7. **Taskmaster**: for large specs/PRDs, break work into ordered tasks with dependencies (task-master CLI installed) instead of one-shotting.
8. **Delegation**: 150+ subagents installed (`~/.claude/agents/`, project `.claude/agents/`) — route specialized work (frontend, testing, security, design review) to the matching agent.
9. **Audit skill** (`.claude/skills/audit/SKILL.md`): user's four-dimension SPEC/DESIGN/CORRECTNESS/QUALITY grading — use whenever asked to audit; be harsh, exercise real behavior.
10. **Dataset guardrail**: run `npm run lint:data` (lint-registry.js) after ANY change to `ai-registry.js`, and `npm run build` (guardrail + link check) before deploying. It fails on model-version strings, superlatives, unverified figures, duplicate slugs, invalid colors, and missing `lastVerified`.

## Honesty constraints (project-specific, hard rules)

- Counts displayed in UI must derive from `ai-registry.js` / `tool-registry.js` at runtime — never hardcode tool/category numbers.
- No superlatives or metrics without data ("popular", "top rated", "weekly updated" are banned without backing).
- Privacy claims only where technically true (dev tools process locally; AI listings are external sites).

## Efficiency: skill hygiene

Periodically (every ~10 tasks or on request), review which skills actually activated; recommend disabling dead weight — unused skills still cost context. Keep this file the single source of truth for standing behavior.
