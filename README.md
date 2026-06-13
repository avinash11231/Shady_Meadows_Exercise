# Shady Meadows B&B — Test Automation Suite

This repo contains the automated test suite for the Shady Meadows B&B platform at https://automationintesting.online. It covers both the API layer (Karate DSL) and the user-facing web interface (Playwright).

---

## Project Structure
Shady_Meadows_Exercise/

├── karate/                        # API tests (Karate DSL + Maven)

│   └── src/test/

│       ├── java/api/

│       │   └── ApiTestRunner.java

│       └── resources/

│           ├── features/

│           │   ├── branding.feature

│           │   ├── rooms.feature

│           │   └── booking.feature

│           ├── karate-config.js

│           └── logback-test.xml

│

└── playwright/                    # UI tests (Playwright + JavaScript)

├── pages/

│   ├── HomePage.js

│   └── AdminPage.js

├── tests/

│   ├── homepageSanity.spec.js

│   └── adminAuth.spec.js

└── playwright.config.js

---

## Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 18+
- npm 9+

---

## Running the Tests

### API Tests (Karate)

```bash
cd karate
mvn test
```

The HTML report is generated automatically at:

karate/target/karate-reports/karate-summary.html

Open that file in any browser to see a full breakdown of each scenario,
including request/response payloads and timing.

### UI Tests (Playwright)

```bash
cd playwright
npx playwright test
```

To view the HTML report after a run:

```bash
npx playwright show-report
```

This opens an interactive report in your browser showing pass/fail per test,
screenshots on failure, and execution timelines.

To run a specific test file only:

```bash
npx playwright test tests/homepageSanity.spec.js
npx playwright test tests/adminAuth.spec.js
```

---

## Approach

I split the suite into two separate projects intentionally. Karate runs on the
JVM and Playwright runs on Node.js, so keeping them independent avoids any
dependency conflicts and lets each be run or maintained without touching the other.

For the API side, each Karate feature file maps to one microservice endpoint.
The booking test dynamically fetches a valid room ID before attempting the
creation, so it never relies on hardcoded IDs that could become stale after
a platform reset. Booking dates are also generated randomly at runtime to avoid
date conflicts.

For the UI side, I followed the Page Object Model pattern. All locators and
interactions live in the `pages/` classes, and the test specs only handle 
assertions and flow. This means if the site's markup changes, there's one
place to update rather than hunting through every test file.

The admin bonus test cross-references data between layers: it calls the public
API directly to get the room data, then logs into the admin panel
and verifies the same room appears there. This validates data consistency
across the API and UI rather than just checking that text exists on a page.

---

## Bugs Found

**1. API path change (environment bug)**
The brief states the microservice endpoints as `/branding/`, `/room/`, and
`/booking/`. These paths now return 404. The platform was migrated to a
Next.js frontend which proxies all API traffic through `/api/`, so the correct
paths are `/api/branding`, `/api/room`, and `/api/booking`. The tests have been
updated to reflect the actual live paths.

**2. Booking date conflicts on shared environment**
The platform resets its data every 10 minutes, but between resets the shared
environment can fill up with bookings made by other users running their own
tests. Using static future dates caused intermittent 409 Conflict errors.
The booking test now generates random dates at runtime to minimise the chance
of clashes.

---

## CI/CD Integration

The natural fit here is GitHub Actions, both projects can run in parallel on
every push or pull request with minimal setup.

A workflow file at `.github/workflows/tests.yml` would look roughly like this:

```yaml
name: Test Suite

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  karate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      - run: mvn test
        working-directory: karate
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: karate-report
          path: karate/target/karate-reports/

  playwright:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
        working-directory: playwright
      - run: npx playwright install --with-deps
        working-directory: playwright
      - run: npx playwright test
        working-directory: playwright
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright/playwright-report/
```

A few things worth mentioning about how this would work in practice. The two
jobs run in parallel so the total pipeline time stays short. Reports are
uploaded as artifacts on every run, including failures, so there's always
something to look at when a build breaks. For a production setup I'd also add
a scheduled nightly run against the live environment to catch any upstream
changes to the platform. The API path change we hit here is exactly the kind
of thing a nightly run would surface the morning after a deployment.
