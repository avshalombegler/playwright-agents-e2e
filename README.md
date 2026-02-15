# Playwright E2E Testing Suite

A comprehensive end-to-end testing suite built with Playwright for testing authentication flows, security features, and form interactions on [The Internet](https://the-internet.herokuapp.com/) - a widely used web application for testing purposes.

## 🎯 Project Overview

This project provides thorough test coverage for various authentication mechanisms and web form interactions, implementing industry best practices for E2E testing with Playwright and TypeScript.

### Key Features Tested

- **Authentication Systems**: Form-based login, HTTP Basic Auth, Digest Authentication
- **Security Features**: Secure file downloads, session management, back-button security
- **Form Interactions**: Input validation, password recovery, credential handling
- **Cross-Browser Testing**: Chromium support with extensible configuration for Firefox and Safari

## 🏗️ Project Structure

```plaintext
playwright-agents-e2e/
├── e2e/
│   ├── fixtures/           # Test fixtures for authentication and page objects
│   │   ├── authFixtures.ts
│   │   ├── pageFixtures.ts
│   │   └── index.ts
│   ├── pages/              # Page Object Model implementation
│   │   ├── BasePage.ts     # Base page with common functionality
│   │   ├── LoginPage.ts    # Form authentication page
│   │   ├── BasicAuthPage.ts
│   │   ├── DigestAuthPage.ts
│   │   ├── SecurePage.ts
│   │   └── ...
│   ├── tests/              # Test suite organization
│   │   ├── seed.spec.ts    # Initial setup tests
│   │   ├── basic-auth/     # HTTP Basic Authentication tests
│   │   ├── digest-auth/    # Digest Authentication tests
│   │   ├── form-authentication/ # Form-based login tests
│   │   ├── password-recovery/   # Password recovery flow tests
│   │   ├── secure-download/     # File download security tests
│   │   └── security/           # General security tests
│   └── utils/              # Utility functions
│       ├── authUtils.ts
│       ├── downloadUtils.ts
│       ├── testHelpers.ts
│       └── validationUtils.ts
├── specs/                  # Test planning documentation
├── .github/
│   └── workflows/
│       └── playwright.yml  # CI/CD pipeline
├── playwright.config.ts    # Playwright configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager

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

### Running Tests

#### Run all tests

```bash
npx playwright test
```

#### Run tests with UI mode

```bash
npx playwright test --ui
```

#### Run specific test suites

```bash
# Form authentication tests
npx playwright test e2e/tests/form-authentication/

# Basic authentication tests  
npx playwright test e2e/tests/basic-auth/

# Security tests
npx playwright test e2e/tests/security/
```

#### Run tests in headed mode (visible browser)

```bash
npx playwright test --headed
```

#### Generate test reports

```bash
npx playwright show-report
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

## 🔧 Configuration

### Playwright Configuration

The project uses a centralized configuration in [playwright.config.ts](playwright.config.ts):

- **Test Directory**: `./e2e/tests`
- **Parallel Execution**: Enabled for faster test runs
- **Retry Strategy**: 2 retries on CI, 0 locally
- **Reporting**: HTML reports with GitHub integration for CI
- **Browser Support**: Currently configured for Chromium (extensible)

### Environment Configuration

- **CI Detection**: Automatic optimization for CI environments
- **Screenshots**: Captured on failure
- **Traces**: Collected on retry for debugging
- **Workers**: Optimized for CI (4 workers) vs local development

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow:

### Features

- **Automated Testing**: Runs on push/PR to main/master branches
- **Caching Strategy**: Node modules and Playwright browsers cached for performance
- **Test Reports**: Automatic HTML report generation
- **GitHub Pages**: Test reports published to GitHub Pages
- **Artifact Management**: Test results preserved for 30 days

### Workflow Triggers

- Push to main/master branches
- Pull requests targeting main/master
- Manual workflow dispatch

## 📋 Test Organization

### Page Object Model

- **BasePage**: Common functionality across all pages
- **Specialized Pages**: Login, Secure Area, Authentication-specific pages
- **Consistent API**: Standardized interaction methods

### Fixtures

- **Authentication Fixtures**: Pre-configured auth scenarios
- **Page Fixtures**: Page object initialization and management
- **Utility Integration**: Helper functions and validation utilities

### Test Structure

```typescript
// Example test structure
import { pageTest as test, expect } from '../../fixtures';

test.describe('Authentication Feature', () => {
  test('should handle valid login flow', async ({ loginPage, securePage }) => {
    await loginPage.navigateToLogin();
    await loginPage.loginWithValidCredentials();
    await securePage.verifyLoginSuccessMessage();
  });
});
```

## 🛠️ Development Guidelines

### Adding New Tests

1. Create test files in appropriate subdirectories under `e2e/tests/`
2. Use existing fixtures and page objects when possible
3. Follow the established naming conventions
4. Include both positive and negative test scenarios

### Page Object Development

1. Extend `BasePage` for common functionality
2. Use semantic locators (roles, labels) for better maintainability
3. Implement verification methods alongside action methods
4. Follow async/await patterns consistently

### Utility Functions

- **authUtils.ts**: Authentication helper functions
- **testHelpers.ts**: General test utilities
- **validationUtils.ts**: Assertion helpers
- **downloadUtils.ts**: File download testing utilities

## 📊 Reporting

### Local Development

- HTML reports generated in `playwright-report/`
- Open reports with `npx playwright show-report`

### CI/CD Environment

- Reports automatically published to GitHub Pages
- Artifacts uploaded for failed test investigations
- Integration with GitHub's checks API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests following existing patterns
4. Ensure all tests pass locally
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
