# Contributing

## Branches

Use a short prefix that matches the work type:

| Prefix | Use for |
| --- | --- |
| `feat/` | New user-facing behavior |
| `fix/` | Bug fixes |
| `chore/` | Tooling, deps, config |
| `docs/` | Documentation only |

Example: `feat/hub-ai-feedback-states`.

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary` in the imperative mood.

| Type | Example |
| --- | --- |
| `feat` | `feat(assistant): handle empty stream` |
| `fix` | `fix(auth): refresh cookie path` |
| `chore` | `chore: bump next patch` |
| `docs` | `docs: env table for JWT` |

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Run **`npm run lint`** and **`npm run type-check`** before opening a PR.

## Pull requests

1. Push your branch and open a PR against **`main`** (or the active release branch).
2. Fill in the PR template (testing steps, screenshots for UI).
3. Keep the diff focused; prefer follow-up PRs over unrelated changes.

## Code style

- **ESLint:** `eslint.config.mjs` extends `next/core-web-vitals` and `next/typescript`. Run **`npm run lint`**.
- **TypeScript:** strict mode is enabled in **`tsconfig.json`**.
- **Formatting:** align with existing files (2-space indent, Prettier-compatible style where applicable). There is no Prettier script in this repo yet; avoid large-scale reformat-only diffs.
