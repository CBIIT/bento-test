# Bento Playwright Tests

This repository contains end-to-end Playwright tests for Bento Tools.

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Install

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browser binaries (first-time setup):

```bash
npx playwright install
```

## Run Tests

Run all tests:

```bash
npm test
```

Run in headed mode (visible browser):

```bash
npm run test:headed
```

Run with Playwright UI mode:

```bash
npm run test:ui
```

Run in debug mode:

```bash
npm run test:debug
```

Run a single spec file:

```bash
npx playwright test tests/bento-tools-e2e.spec.ts
```

## Test Report

After execution, open the HTML report:

```bash
npx playwright show-report
```

The report is generated in:

- `playwright-report/`

Artifacts for failed tests are stored in:

- `test-results/`

## Main Test File

- `tests/bento-tools-e2e.spec.ts`

## Notes

- Base configuration is in `playwright.config.ts`.
- Project scripts are defined in `package.json`.
- If selectors become flaky, review and refine role/text locators in the spec.

