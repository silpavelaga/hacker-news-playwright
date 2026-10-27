# Hacker News ordering test

TypeScript and Playwright test for the Velstar technical assignment. Checks that
the first 100 articles on Hacker News Newest are sorted from newest to oldest.

## Run locally

Requires Node.js 22 or later.

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

Use `npm run test:headed` to watch the test and `npm run report` to view the HTML
report. On Linux, install browser dependencies with
`npx playwright install --with-deps chromium`.

## Structure

- `pages/NewestPage.ts`: locators, navigation, article extraction and pagination.
- `tests/newest.spec.ts`: count, uniqueness, timestamp and ordering assertions.
- `playwright.config.ts`: Chromium configuration and failure diagnostics.
- `.github/workflows/playwright.yml`: GitHub Actions workflow.

## Approach

The test follows the More link until it has exactly 100 articles, preserving
their displayed order. It reads exact UTC timestamps from `.age[title]` and
compares adjacent articles, including across page boundaries. Equal timestamps
are allowed. Duplicate articles or missing timestamps fail the test.

The feed is live, so site availability and changes during pagination can affect
results. A screenshot and trace are saved on failure. Retries are disabled so
an ordering failure remains visible.

## CI

GitHub Actions installs dependencies and Chromium, checks TypeScript and runs
the test on pushes to `master`. Results appear in the workflow logs.

A GitHub Actions run must be checked after publishing the repository.
