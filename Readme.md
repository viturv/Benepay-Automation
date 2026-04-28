# Benepay Automation — Complete Project Documentation

> **Project:** `viturv/Benepay-Automation`
> **Stack:** TypeScript · Playwright · Node.js
> **Target Application:** `https://uat-payouts.benepay.io` (UAT/Staging environment)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [File-by-File Breakdown](#3-file-by-file-breakdown)
   - [package.json](#31-packagejson)
   - [playwright.config.js](#32-playwrightconfigjs)
   - [tsconfig.json](#33-tsconfigjson)
   - [.env](#34-env)
   - [auth.json](#35-authjson)
   - [tests/ folder](#36-tests-folder)
4. [How Authentication Works](#4-how-authentication-works)
5. [Technology Stack Explained](#5-technology-stack-explained)
6. [Setting Up on a New System](#6-setting-up-on-a-new-system)
7. [Running the Tests](#7-running-the-tests)
8. [Important Notes & Best Practices](#8-important-notes--best-practices)

---

## 1. Project Overview

**Benepay Automation** is an end-to-end (E2E) test automation project for the **Benepay** payouts web application. It uses **Playwright** (a browser automation framework) to simulate real user interactions — such as logging in, navigating pages, and verifying functionality — on the UAT (User Acceptance Testing) environment.

The project is designed to:
- Automatically test login flows including **Multi-Factor Authentication (MFA/OTP)**
- Automate repetitive QA tasks on `https://uat-payouts.benepay.io`
- Save browser session state so tests don't need to log in every single time
- Be run by any developer or QA engineer by cloning the repo and following the setup steps

---

## 2. Project Structure

```
Benepay-Automation/
│
├── tests/                    ← All test files live here (TypeScript .spec.ts files)
│
├── .env                      ← Secret environment variables (MFA secret key)
├── auth.json                 ← Saved browser session/login state (Playwright storage state)
├── package.json              ← Project dependencies and metadata
├── package-lock.json         ← Locked dependency versions (auto-generated)
├── playwright.config.js      ← Playwright configuration (browsers, timeouts, base URL, etc.)
├── tsconfig.json             ← TypeScript compiler configuration
└── .gitignore                ← Files excluded from Git tracking
```

---

## 3. File-by-File Breakdown

### 3.1 `package.json`

**Purpose:** Defines the project as a Node.js package and lists all dependencies needed to run the automation.

```json
{
  "name": "benepay-automation",
  "version": "1.0.0",
  "devDependencies": {
    "@playwright/test": "^1.59.1",
    "@types/node": "^25.6.0",
    "dotenv": "^17.4.2",
    "otpauth": "^9.5.0"
  }
}
```

| Dependency | Purpose |
|---|---|
| `@playwright/test` | The core Playwright testing framework. Provides `test()`, `expect()`, browser controls, and the test runner. |
| `@types/node` | TypeScript type definitions for Node.js built-in APIs (like `process.env`, file system, etc.). |
| `dotenv` | Loads environment variables from the `.env` file into `process.env` so secrets are not hardcoded in code. |
| `otpauth` | Generates Time-based One-Time Passwords (TOTP), used to handle the MFA step during login automatically. |

> **Note:** All dependencies are listed under `devDependencies` because this project is purely for testing/development — it does not ship production code.

---

### 3.2 `playwright.config.js`

**Purpose:** The main configuration file for the Playwright test runner. It controls how and where tests run.

Although the file content was not directly accessible via the public GitHub API, based on the project structure and dependencies, a typical config for this project would look like:

```javascript
const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',          // Where Playwright looks for test files
  timeout: 60000,              // Max time per test (60 seconds)
  use: {
    baseURL: 'https://uat-payouts.benepay.io',  // Target application URL
    storageState: 'auth.json',  // Reuse saved login session
    headless: true,             // Run browser without a visible window (CI-friendly)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
```

**Key concepts:**
- `testDir: './tests'` — Playwright scans the `tests/` folder for any file ending in `.spec.ts`.
- `baseURL` — Sets the root URL so test files can use relative paths like `page.goto('/')` instead of the full URL.
- `storageState: 'auth.json'` — Tells Playwright to load a pre-saved login session, skipping the login flow for most tests.
- `headless` — In `true` mode, no browser window opens; used in CI/CD pipelines.

---

### 3.3 `tsconfig.json`

**Purpose:** Configures the TypeScript compiler so it understands how to process `.ts` files in the project.

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "Node16",
    "moduleResolution": "node16",
    "types": ["node"],
    "esModuleInterop": true,
    "strict": true
  }
}
```

| Option | What it means |
|---|---|
| `"target": "ESNext"` | Compiles TypeScript down to the latest JavaScript version supported by the current Node.js. |
| `"module": "Node16"` | Uses Node.js 16+ module system (supports both CommonJS and ES Modules). |
| `"moduleResolution": "node16"` | Tells TypeScript how to find imported files/packages — using the Node 16 algorithm. |
| `"types": ["node"]` | Includes Node.js built-in type definitions so `process`, `Buffer`, etc. are recognized. |
| `"esModuleInterop": true` | Allows `import x from 'module'` syntax even for CommonJS packages (like `dotenv`). |
| `"strict": true` | Enables all strict TypeScript checks — catches more bugs at compile time. |

---

### 3.4 `.env`

**Purpose:** Stores sensitive configuration values that should NOT be hardcoded in source code.

```
MFA_SECRET=LLGCVIHWPVGRF65JN5ILAL3ZC76FFWHMPVJTPKSGF5H5GUBUGSOQ
```

| Variable | Purpose |
|---|---|
| `MFA_SECRET` | The TOTP (Time-based One-Time Password) secret key tied to the Benepay account's 2FA setup. Used by the `otpauth` library to generate the 6-digit MFA code automatically during login. |

**How it's used in code:**
```typescript
import * as dotenv from 'dotenv';
import * as OTPAuth from 'otpauth';

dotenv.config(); // Loads .env into process.env

const totp = new OTPAuth.TOTP({
  secret: OTPAuth.Secret.fromBase32(process.env.MFA_SECRET!),
  digits: 6,
  period: 30,
});

const otp = totp.generate(); // Produces the current 6-digit OTP
```

> ⚠️ **Security Warning:** The `.env` file is committed to this public repository, which means the MFA secret is exposed. In a production project, `.env` should always be added to `.gitignore` and secrets should be managed through a secrets manager or CI/CD environment variables.

---

### 3.5 `auth.json`

**Purpose:** Stores a saved browser session (cookies + localStorage tokens) so Playwright tests can skip the login step.

This file is generated by running a **"global setup"** or a dedicated login test once. Playwright's `storageState` feature captures the authenticated browser state and writes it to `auth.json`.

**What's inside:**
```json
{
  "cookies": [],
  "origins": [
    {
      "origin": "https://uat-payouts.benepay.io",
      "localStorage": [
        {
          "name": "CognitoIdentityServiceProvider.....refreshToken",
          "value": "eyJ..."
        },
        {
          "name": "CognitoIdentityServiceProvider.....accessToken",
          "value": "eyJ..."
        },
        {
          "name": "CognitoIdentityServiceProvider.....idToken",
          "value": "eyJ..."
        }
      ]
    }
  ]
}
```

| Key | What it is |
|---|---|
| `cookies` | HTTP cookies for the session (empty here — app uses localStorage instead). |
| `origins` | A list of origins (websites) with their localStorage contents. |
| `refreshToken` | A long-lived JWT that can get a new access token when the current one expires. |
| `accessToken` | A short-lived JWT used to authorize API calls to the Benepay backend. |
| `idToken` | A JWT containing the user's identity info (email, customer ID, etc.). |
| `clockDrift` | Time difference (in seconds) between the client and the Cognito server — helps with token validity checks. |
| `LastAuthUser` | The Cognito UUID of the last logged-in user. |

**The application uses AWS Cognito** for authentication, which is a cloud identity service by Amazon. The tokens stored here are standard AWS Cognito JWT tokens.

> ⚠️ **Security Warning:** `auth.json` contains real authentication tokens. These tokens expire (the `accessToken` and `idToken` typically expire in 1 hour, the `refreshToken` in 30 days), but they should not be committed to a public repository. Add `auth.json` to `.gitignore` in a real project.

---

### 3.6 `tests/` Folder

**Purpose:** Contains all the Playwright test spec files written in TypeScript.

Each file in this folder typically follows the naming pattern `something.spec.ts` and contains one or more `test()` blocks.

**Example of what a test file looks like:**

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import * as OTPAuth from 'otpauth';
import * as dotenv from 'dotenv';

dotenv.config();

test('User can log in with MFA', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'viturv1512@gmail.com');
  await page.fill('#password', 'YourPassword');
  await page.click('button[type="submit"]');

  // Wait for MFA screen
  await page.waitForSelector('#otp-input');

  // Generate OTP automatically
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(process.env.MFA_SECRET!),
    digits: 6,
    period: 30,
  });

  await page.fill('#otp-input', totp.generate());
  await page.click('button[type="submit"]');

  // Verify successful login
  await expect(page).toHaveURL('/dashboard');

  // Save session for other tests
  await page.context().storageState({ path: 'auth.json' });
});
```

---

## 4. How Authentication Works

The login flow for Benepay UAT is:

```
1. Navigate to https://uat-payouts.benepay.io/login
        ↓
2. Enter email + password
        ↓
3. AWS Cognito SRP (Secure Remote Password) authentication
        ↓
4. MFA prompt appears (6-digit TOTP code required)
        ↓
5. `otpauth` library generates the current TOTP using MFA_SECRET from .env
        ↓
6. Code is entered → Login succeeds
        ↓
7. Cognito returns: accessToken + idToken + refreshToken
        ↓
8. Playwright saves these to auth.json via storageState()
        ↓
9. All future tests load auth.json → skip login entirely
```

---

## 5. Technology Stack Explained

| Technology | Role in this project |
|---|---|
| **Playwright** | Browser automation framework. Opens Chrome/Firefox, clicks buttons, fills forms, reads page content. |
| **TypeScript** | Strongly-typed language that compiles to JavaScript. Catches errors before the tests even run. |
| **Node.js** | JavaScript runtime that executes the TypeScript tests (after compilation). |
| **dotenv** | Loads secrets from `.env` file so they don't appear in the source code. |
| **otpauth** | Implements the TOTP algorithm (RFC 6238) — the same standard used by Google Authenticator. |
| **AWS Cognito** | The identity/auth service used by Benepay. Issues JWTs (JSON Web Tokens) after login. |

---

## 6. Setting Up on a New System

Follow these steps in order to get the project running on a fresh machine.

### Prerequisites

Make sure these are installed:

- **Node.js** (v18 or later) — Download from [nodejs.org](https://nodejs.org)
- **Git** — Download from [git-scm.com](https://git-scm.com)

Verify installation:
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show 9.x.x or higher
git --version    # Should show git version 2.x.x
```

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/viturv/Benepay-Automation.git
cd Benepay-Automation
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

This reads `package.json` and installs:
- `@playwright/test`
- `dotenv`
- `otpauth`
- `@types/node`

---

### Step 3 — Install Playwright Browsers

Playwright needs to download browser binaries (Chromium, Firefox, WebKit). Run:

```bash
npx playwright install
```

> This downloads browsers to a local cache (~200MB). You only need to run this once per machine.

To install only Chromium (faster):
```bash
npx playwright install chromium
```

---

### Step 4 — Set Up the `.env` File

Create a `.env` file in the project root:

```bash
# On Windows (Command Prompt)
echo MFA_SECRET=YOUR_MFA_SECRET_HERE > .env

# On Mac/Linux
echo "MFA_SECRET=YOUR_MFA_SECRET_HERE" > .env
```

Replace `YOUR_MFA_SECRET_HERE` with the actual TOTP secret for the Benepay UAT account. This is the Base32-encoded secret that is normally shown as a QR code when you first set up 2FA — the same secret you would scan with Google Authenticator.

---

### Step 5 — Generate `auth.json` (First-time Login)

The `auth.json` file in the repo may have expired tokens. Run the login test to generate a fresh one:

```bash
npx playwright test tests/login.spec.ts
```

After this runs successfully, `auth.json` will be updated with valid session tokens.

---

### Step 6 — Run All Tests

```bash
npx playwright test
```

To run with a visible browser window (useful for debugging):
```bash
npx playwright test --headed
```

To run a specific test file:
```bash
npx playwright test tests/login.spec.ts
```

To open the interactive UI mode:
```bash
npx playwright test --ui
```

---

### Step 7 — View the Test Report

After tests run, Playwright generates an HTML report:

```bash
npx playwright show-report
```

This opens a browser showing which tests passed, failed, and any screenshots/videos captured on failure.

---

## 7. Running the Tests

| Command | What it does |
|---|---|
| `npx playwright test` | Runs all tests in the `tests/` folder |
| `npx playwright test --headed` | Runs tests with the browser window visible |
| `npx playwright test --ui` | Opens the interactive Playwright UI |
| `npx playwright test tests/login.spec.ts` | Runs only the specified file |
| `npx playwright test --grep "keyword"` | Runs only tests whose name contains "keyword" |
| `npx playwright show-report` | Opens the HTML test report in your browser |
| `npx playwright codegen https://uat-payouts.benepay.io` | Records browser actions and generates test code |

---

## 8. Important Notes & Best Practices

### Security
- **Never commit `.env` to a public repo.** Add it to `.gitignore`:
  ```
  .env
  auth.json
  ```
- **Rotate the MFA_SECRET** if it has been exposed publicly. Log in to the Benepay UAT admin panel, disable 2FA, and re-enable it to get a new secret.
- **auth.json tokens expire.** The `accessToken` and `idToken` expire in ~1 hour. The `refreshToken` lasts ~30 days. If tests fail with authentication errors, re-run the login spec to refresh `auth.json`.

### When Tests Fail
1. **Token expired** → Re-run the login test: `npx playwright test tests/login.spec.ts`
2. **MFA code invalid** → Check that `MFA_SECRET` in `.env` is correct and your system clock is accurate (TOTP is time-sensitive).
3. **Browser not found** → Run `npx playwright install` again.
4. **Element not found** → The UI may have changed. Use `npx playwright codegen` to re-record the selectors.

### Adding New Tests
1. Create a new file in `tests/` — e.g., `tests/payouts.spec.ts`
2. Import from `@playwright/test`
3. Use `storageState` in `playwright.config.js` — your test will start already logged in
4. Run it: `npx playwright test tests/payouts.spec.ts --headed`

---