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

```bash
# Run with UI mode
npx playwright test --ui

# Run specific test suites
npx playwright test e2e/tests/form-authentication/
npx playwright test e2e/tests/basic-auth/
npx playwright test e2e/tests/security/

# Run in headed mode (visible browser)
npx playwright test --headed

# Generate and view reports
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
```

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

### Environment Configuration

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
- **Multi-runtime**: Node.js 18, 20
- **Smoke testing**: Staging environment validation

### Automation Features

- **Scheduled runs**: Daily weekday regression testing
- **Enhanced reporting**: GitHub Step Summaries + PR comments
- **Artifact management**: Test traces and reports preserved
- **GitHub Pages**: Automated report deployment

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
