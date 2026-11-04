# Playwright UI and API Automation Demo

> **Demonstration project:** this repository is a deliberately small portfolio sample, not a production test programme or a security assessment.

This project shows a client how I turn a business flow into maintainable, repeatable UI and REST API checks. It exercises a pinned local instance of [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/), an intentionally insecure training application with an Angular UI, REST API and SQLite data store. Juice Shop is free and open source under the [MIT licence](https://github.com/juice-shop/juice-shop/blob/master/LICENSE); its own documentation supports local Docker execution. The tested image is pinned to `bkimminich/juice-shop:v20.3.0` for repeatability.

## What the demo covers

Eight tests cover three customer-facing processes in Chromium:

- product catalogue: seeded product details and search filtering;
- customer registration: successful registration and mismatched-password validation;
- authentication: successful registration-to-login, invalid UI login, API registration/login and duplicate/unknown-user errors.

The suite uses TypeScript, Playwright fixtures, small Page Objects, role/ARIA selectors and contract-level assertions. There are no fixed sleeps. Each test gets an isolated browser context and unique user data. The application runs in a disposable container; `npm run app:stop` removes the container and all generated data. CI performs that cleanup even after failures.

## Requirements

- Node.js 20–24 (verified with Node.js 24.7.0)
- npm (verified with npm 11.5.1)
- Git
- Docker Desktop or Docker Engine with Compose v2

## Run locally

Install exactly the dependency versions in `package-lock.json` and the Chromium binary:

```bash
npm ci
npx playwright install chromium
```

Run the complete suite. Playwright starts Juice Shop automatically and waits for its URL:

```bash
npm run test:types
npm test
```

Useful focused commands:

```bash
npm run test:ui
npm run test:api
npm run test:headed
```

Remove the disposable application and its test data when finished:

```bash
npm run app:stop
```

To inspect the application manually, run `npm run app:start` and open <http://127.0.0.1:3000>. Stop it with `npm run app:stop`.

## Reports and diagnostics

The HTML report is generated in `playwright-report/`. Open it with:

```bash
npm run report
```

On failure, Playwright retains a trace and captures a screenshot in `test-results/`. The report links to both artifacts. Video is intentionally disabled to keep this small demo fast.

## Continuous integration

The GitHub Actions workflow runs on pushes to `main`, pull requests and manual dispatch. It uses `npm ci`, installs only Chromium, checks TypeScript, starts the pinned application through Playwright, and runs all UI/API tests. The HTML report and failure evidence are uploaded as the `playwright-report` artifact for 14 days. Cleanup uses `if: always()` so the disposable application is removed after both successful and failed jobs.

## Demo limitations

- This is representative coverage, not exhaustive functional, accessibility, performance or security testing.
- Only Chromium and the default English locale are covered.
- Juice Shop is intentionally vulnerable and must not be exposed as a real customer application.
- Test users persist only for the lifetime of the disposable container. Unique addresses prevent cross-test collisions; container removal is the persistence-layer cleanup boundary.
- The suite relies on the seeded data and API behaviour of the pinned Juice Shop version. Upgrading the image should be reviewed and tested explicitly.
- No paid services, AI features, ZAP integration or custom dashboard are included.

## Two-minute client demo script

**0:00–0:20 — Context.** “This is a compact demonstration of how I structure reliable UI and API automation around three valuable customer journeys. The target is a pinned, local application, so the run does not depend on a shared demo environment.”

**0:20–0:45 — Structure.** Show `tests/`, the Page Objects and `playwright.config.ts`. Point out unique test data, Chromium-only scope, parallel execution, trace retention and screenshots on failure.

**0:45–1:10 — Run.** Execute `npm test`. Explain that Playwright starts the application and waits for readiness without hard-coded delays. Highlight the UI and API projects in the terminal output.

**1:10–1:35 — Evidence.** Execute `npm run report`. Open one UI test and one API test. Show steps, duration and assertions; mention that a failure would include its screenshot and trace for diagnosis.

**1:35–1:55 — CI value.** Open `.github/workflows/playwright.yml`. Explain locked installation with `npm ci`, type checking, a disposable application and the downloadable report artifact.

**1:55–2:00 — Close.** “This demo is intentionally small, but the same design scales into risk-based regression coverage and gives a client fast, reviewable release evidence.”
