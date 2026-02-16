# Playwright E2E Testing Suite

A comprehensive end-to-end testing suite built with Playwright and TypeScript, featuring automated CI/CD pipeline, code quality enforcement, and cross-browser testing for authentication flows and security features on [The Internet](https://the-internet.herokuapp.com/).

## 🎯 Project Overview

This project provides thorough test coverage for various authentication mechanisms and web form interactions, implementing industry best practices for E2E testing with Playwright and TypeScript.

### Key Features Tested

- **Authentication Systems**: Form-based login, HTTP Basic Auth, Digest Authentication
- **Security Features**: Secure file downloads, session management, back-button security
- **Form Interactions**: Input validation, password recovery, credential handling
- **Cross-Browser Testing**: Chromium, Firefox, and WebKit support
- **Quality Assurance**: ESLint, Prettier, TypeScript integration
- **CI/CD Pipeline**: Automated testing, quality gates, performance monitoring

## 🏗️ Project Structure

```plaintext
playwright-agents-e2e/
├── e2e/
│   ├── config/             # ⭐ Centralized test configuration
│   │   └── testData.ts     # Test data and environment config
│   ├── fixtures/           # Test fixtures for authentication and page objects
│   │   ├── authFixtures.ts
│   │   ├── pageFixtures.ts
│   │   └── index.ts
│   ├── pages/              # Page Object Model implementation
│   │   ├── BasePage.ts     # Base page with common functionality & error handling
│   │   ├── LoginPage.ts    # Form authentication page
│   │   ├── BasicAuthPage.ts
│   │   ├── DigestAuthPage.ts
│   │   ├── SecurePage.ts
│   │   └── ...
│   ├── setup/              # ⭐ Global setup/teardown
│   │   ├── globalSetup.ts  # Pre-test setup (clean screenshots)
│   │   └── globalTeardown.ts  # Post-test cleanup (archive results)
│   ├── tests/              # Test suite organization
│   │   ├── seed.spec.ts    # Initial setup tests
│   │   ├── basic-auth/     # HTTP Basic Authentication tests
│   │   ├── digest-auth/    # Digest Authentication tests
│   │   ├── form-authentication/ # Form-based login tests (with tags)
│   │   ├── password-recovery/   # Password recovery flow tests
│   │   ├── secure-download/     # File download security tests
│   │   └── security/           # General security tests
│   └── utils/              # Utility functions
│       ├── errorHandler.ts # ⭐ Enhanced error handling
│       ├── testHelpers.ts
│       └── index.ts
├── specs/                  # Test planning documentation
├── .github/
│   └── workflows/
│       └── playwright.yml  # ⭐ CI/CD pipeline with test sharding
├── .env.example           # ⭐ Environment variables template
├── playwright.config.ts   # ⭐ Enhanced with env support, tags, sharding
└── package.json           # ⭐ Added test:smoke, test:ui, and more scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS version recommended)
- npm package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd playwright-agents-e2e
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Playwright browsers**

   ```bash
   npx playwright install
   ```

4. **Verify setup**

   ```bash
   npm run check
   ```

### Running Tests

#### Quick Start Commands

| Command                   | Description                          |
| ------------------------- | ------------------------------------ |
| `npm test`                | Run all tests                        |
| `npm run test:headed`     | Run with visible browser             |
| `npm run test:debug`      | Debug mode with Playwright Inspector |
| `npm run test:ui`         | Launch Playwright UI mode            |
| `npm run test:smoke`      | Run smoke tests only (@smoke tag)    |
| `npm run test:regression` | Run full regression suite            |
| `npm run test:auth`       | Run authentication-related tests     |
| `npm run test:security`   | Run security testing scenarios       |
| `npm run report`          | View latest test report              |

#### Environment Configuration

The project supports environment-based configuration through `.env` files:

1. **Create your local environment file**:

   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**:

   ```bash
   # .env file
   BASE_URL=https://the-internet.herokuapp.com
   TEST_USERNAME=tomsmith
   TEST_PASSWORD=SuperSecretPassword!
   BROWSER=chromium
   HEADLESS=true
   ```

3. **Run tests with environment variables**:

   ```bash
   npm test  # Uses .env configuration
   ```

**Available Environment Variables**:

- `BASE_URL` - Base URL of the application under test
- `TEST_USERNAME` / `TEST_PASSWORD` - Default test credentials
- `CI` - CI environment flag (auto-detected)
- `BROWSER` - Browser to use (chromium, firefox, webkit)
- `HEADLESS` - Run in headless mode (true/false)
- `TIMEOUT` - Test timeout in milliseconds (default: 30000)
- `WORKERS` - Number of parallel workers
- `TEST_GREP` - Run tests matching this pattern (e.g., @smoke)
- `TEST_GREP_INVERT` - Skip tests matching this pattern

#### Development Scripts

```bash
# Run all tests
npm test

# Code quality checks
npm run check          # Lint + format check + type check
npm run fix            # Auto-fix linting + format + type check

# Individual quality tools
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier format
npm run format:check   # Check formatting
npm run type-check     # TypeScript validation

# CI simulation
npm run ci             # Run quality checks + tests
```

#### Playwright Commands

````bash
# Run with UI mode (interactive)
npx playwright test --ui

# Run specific test suites
npx playwright test e2e/tests/form-authentication/
npx playwright test e2e/tests/basic-auth/
npx playwright test e2e/tests/security/

# Run tests with specific tags
npx playwright test --grep @smoke     # Run smoke tests
npx playwright test --grep @critical  # Run critical tests
npx playwright test --grep "@smoke|@critical"  # Run either

# Run in headed mode (visible browser)
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Test sharding (parallel execution)
npx playwright test --shard=1/4 # Run first quarter of tests
npx playwright test --shard=2/4 # Run second quarter of tests

# Debug specific test
npx playwright test --debug path/to/test.spec.ts

# Generate and view reports
npx playwright show-report
```

### Test Tags

Tests are organized using tags for selective execution:

- **@smoke** - Critical path tests (runs on every PR)
- **@regression** - Full regression suite
- **@critical** - High-priority test scenarios
- **@auth** - Authentication-related tests
- **@security** - Security testing scenarios

**Example Usage**:

```bash
npm run test:smoke      # Run smoke tests
npm run test:auth       # Run auth tests
npx playwright test --grep @critical  # Run critical tests
```

## 🧪 Test Coverage

### Authentication Testing

- **Form Authentication**: Valid/invalid credentials, logout flows, empty inputs
- **HTTP Basic Auth**: Valid/invalid credential scenarios
- **Digest Authentication**: Authentication protocol testing
- **Session Management**: Login persistence, secure area access

### Security Testing

- **Access Control**: Unauthorized access prevention
- **File Download Security**: Authenticated vs unauthenticated access
- **Navigation Security**: Back-button behavior, direct URL access
- **Password Recovery**: Email validation, recovery flow testing

### Form & Input Testing

- **Input Validation**: Username/password field validation
- **Error Handling**: Proper error message display
- **Field Behavior**: Input masking, retention, clearing

## �️ Development Setup

### Code Quality Tools

- **ESLint v9**: Modern flat config with TypeScript support
- **Prettier**: Consistent code formatting across the project
- **TypeScript**: Strict type checking and modern language features

### Recommended VS Code Extensions

```bash
# Install essential extensions
code --install-extension ms-vscode.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-playwright.playwright
````

### Development Workflow

1. **Before committing**: Run `npm run fix` to auto-fix issues
2. **Daily development**: Use `npm run check` to verify code quality
3. **VS Code integration**: Extensions provide real-time feedback

## �🔧 Configuration

### Playwright Configuration

The project uses [playwright.config.ts](playwright.config.ts) with:

- **Cross-browser testing**: Chromium, Firefox, WebKit
- **Parallel execution**: Optimized for performance
- **Smart retries**: 2 retries on CI, 0 locally
- **Rich reporting**: HTML reports with trace collection
- **CI optimization**: Enhanced for GitHub Actions

### Runtime Configuration

- **CI Detection**: Automatic optimization for CI environments
- **Screenshots**: Captured on failure
- **Traces**: Collected on retry for debugging
- **Workers**: Optimized for CI (4 workers) vs local development

## 🔄 CI/CD Pipeline

Comprehensive GitHub Actions workflow with industry best practices:

### Quality Gates

- **Dependency validation**: Package-lock integrity checks
- **Security auditing**: npm audit for vulnerabilities
- **Code quality**: ESLint + Prettier + TypeScript validation
- **Performance monitoring**: Test execution time thresholds

### Test Execution

- **Multi-environment**: Ubuntu, Windows, macOS
- **Multi-browser**: Chromium, Firefox, WebKit
- **Test sharding**: 4 parallel shards per browser for faster execution
- **Matrix testing**: 3 OS × 3 browsers × 4 shards = 36 parallel jobs

### Automation Features

- **Scheduled runs**: Daily weekday regression testing
- **Enhanced reporting**: GitHub Step Summaries + PR comments
- **Artifact management**: Test traces and reports preserved
- **GitHub Pages**: Automated report deployment

## 📋 Test Organization

### Test Tags and Annotations

Tests can be organized using tags and annotations for better categorization:

```typescript
import { pageTest as test, expect } from '../../fixtures';

test.describe('Authentication Feature', () => {
  test(
    'should handle valid login',
    {
      tag: ['@smoke', '@critical', '@auth'],
      annotation: [
        { type: 'issue', description: 'AUTH-001' },
        { type: 'story', description: 'User login story' },
      ],
    },
    async ({ loginPage, securePage }) => {
      await test.step('Navigate to login', async () => {
        await loginPage.navigateToLogin();
      });

      await test.step('Perform login', async () => {
        await loginPage.loginWithValidCredentials();
      });

      await test.step('Verify success', async () => {
        await securePage.verifySuccessMessage();
      });
    }
  );
});
```

### Fixtures

- **Authentication Fixtures**: Pre-configured auth scenarios
- **Page Fixtures**: Page object initialization and management
- **Utility Integration**: Helper functions and validation utilities

### Test Structure

```typescript
// Example test with fixtures
import { pageTest as test, expect } from '../../fixtures';

test.describe('Authentication Feature', () => {
  test('should handle valid login', async ({ loginPage, securePage }) => {
    await loginPage.loginWithValidCredentials();
    await securePage.verifySuccessMessage();
  });
});
```

## 🛠️ Development Guidelines

### Code Quality Standards

- Follow ESLint rules (auto-fixable via `npm run fix`)
- Use Prettier formatting (configured in `.prettierrc`)
- Maintain TypeScript strict mode compliance
- Run `npm run check` before committing

### Adding New Tests

1. Use appropriate test directory structure under `e2e/tests/`
2. Leverage existing fixtures and page objects
3. Follow consistent naming conventions
4. Include positive and negative scenarios

### Page Object Development

1. Extend `BasePage` for common functionality
2. Use semantic locators for maintainability
3. Implement verification methods alongside actions
4. Follow async/await patterns consistently

## 🔧 Advanced Features

### Test Data Management

Centralized test data configuration via `e2e/config/testData.ts`:

```typescript
import { TestConfig, TestDataFactory } from './config/testData';

// Use static configuration
const credentials = TestConfig.credentials.valid;

// Generate dynamic test data
const email = TestDataFactory.generateEmail();
const username = TestDataFactory.generateUsername();
```

### Enhanced Error Handling

Automatic error context capture on test failures:

- Full page screenshots
- Console logs
- Network activity
- Browser storage state
- Page state snapshots

All error context is automatically attached to test reports.

### Global Setup & Teardown

- **Global Setup** (`e2e/setup/globalSetup.ts`): Cleans screenshots before test runs
- **Global Teardown** (`e2e/setup/globalTeardown.ts`): Archives results, cleans temp files

### Test Sharding for Performance

Run tests in parallel shards for faster execution:

```bash
# Local sharding
npx playwright test --shard=1/4
npx playwright test --shard=2/4

# CI automatically runs 4 shards per browser/OS combination
```

## 🐛 Troubleshooting

### Common Issues & Solutions

**Tests failing locally but passing in CI?**

```bash
# Clear Playwright cache
npx playwright clean

# Reinstall browsers
npx playwright install --with-deps

# Check environment variables
cat .env  # Ensure .env matches .env.example
```

**Slow test execution?**

```bash
# Run tests in parallel
npx playwright test --workers=4

# Run specific suite instead of all tests
npx playwright test e2e/tests/form-authentication

# Use test sharding
npx playwright test --shard=1/2
```

**Tests timing out?**

```bash
# Increase timeout in .env
echo "TIMEOUT=60000" >> .env

# Or run with increased timeout
npx playwright test --timeout=60000
```

**Want to see what's happening?**

```bash
# Run in headed mode
npm run test:headed

# Use debug mode
npm run test:debug

# Use UI mode for interactive debugging
npm run test:ui
```

**Environment variables not loading?**

````bash
# Ensure .env file exists
cp .env.example .env

# Verify dotenv is installed
npm install

# Check .env file format (no spaces around =)
BASE_URL=https://example.com  # ✅ Correct
BASE_URL = https://example.com  # ❌ Incorrect
```

## 📊 Reporting & Monitoring

### Local Development

- HTML reports: `playwright-report/` directory
- View reports: `npx playwright show-report`
- Trace viewer: Available for failed tests

### CI/CD Environment

- Automated GitHub Pages deployment
- Enhanced GitHub Step Summaries
- PR failure notifications with detailed links
- Performance threshold monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow code quality standards (`npm run check`)
4. Ensure tests pass locally
5. Submit a pull request

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Test Target: The Internet](https://the-internet.herokuapp.com/)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [GitHub Actions for Playwright](https://playwright.dev/docs/ci-github-actions)

## 📄 License

This project is licensed under the ISC License.

---

**Note**: This test suite targets `https://the-internet.herokuapp.com/`, a deliberately vulnerable web application designed for testing security tools and learning security concepts. It should not be used for testing production applications without proper authorization.
````
