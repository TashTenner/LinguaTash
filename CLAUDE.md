# LinguaTash — Claude Code notes

## Before every commit

Always run Prettier before staging and committing:

```bash
npx prettier --write <changed files>
```

Or to check without writing:

```bash
npx prettier --check .
```

The CI build (`yarn build`) enforces Prettier via ESLint and will fail if formatting is off.
