# Playwright E2E Testing Suite

A Playwright-based E2E testing suite for authentication and security testing using [The Internet](https://the-internet.herokuapp.com/) as the test target.

## 🎯 Overview

This project tests various authentication mechanisms and security features using Playwright with TypeScript, following the Page Object Model pattern.

### Features Tested

- **Form Authentication**: Login/logout flows with credential validation
- **HTTP Basic Auth**: Basic authentication scenarios
- **Digest Authentication**: Digest auth testing
- **Password Recovery**: Email-based password recovery
- **Secure Downloads**: File download with authentication
- **Security**: Back-button security, session management

## 🏗️ Project Structure

```tree
e2e/
├── config/             # Environment configurations
├── data/               # Test data management
├── fixtures/           # Playwright fixtures
├── pages/              # Page Object Model
├── tests/              # Test suites
│   ├── basic-auth/
│   ├── digest-auth/
│   ├── form-authentication/
│   ├── password-recovery/
│   ├── secure-download/
│   └── security/
└── utils/              # Test utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- npm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd playwright-agents-e2e

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run specific test suite
npx playwright test e2e/tests/form-authentication/

# Run in headed mode
npx playwright test --headed

# Show test report
npx playwright show-report
```

### Environment Configuration

```bash
# Set environment (dev, staging, production)
NODE_ENV=staging npx playwright test
```

## 🧪 Test Organization

### Page Object Model

- **BasePage**: Common functionality across pages
- **Specialized Pages**: LoginPage, SecurePage, AuthPage, etc.
- **Fixtures**: Page object initialization and test utilities

### Test Coverage

- **Form Authentication**: Valid/invalid credentials, logout flows
- **HTTP Basic Auth**: Credential validation scenarios  
- **Digest Authentication**: Protocol testing
- **Security**: Unauthorized access, session management
- **Password Recovery**: Email validation flows
- **File Downloads**: Authenticated vs unauthenticated access

### Utilities

- **Logger**: Test logging with structured output
- **CustomAssertions**: Domain-specific assertions
- **TestHelpers**: Common test utilities
- **TestDataManager**: Dynamic test data generation

## 🔧 Configuration

### Playwright Config

- **Test Directory**: `./e2e/tests`
- **Parallel Execution**: Enabled
- **Retry Strategy**: Environment-dependent
- **Reporting**: HTML reports
- **Browser**: Chromium (extensible)

### Environment Support

- **dev**: Development environment
- **staging**: Staging environment  
- **production**: Production environment
- **Custom timeouts**: Environment-specific settings

## 🔄 CI/CD

GitHub Actions workflow included:

- **Automated Testing**: Runs on push/PR
- **Caching**: Node modules and browsers
- **Reporting**: HTML reports published to GitHub Pages
- **Artifacts**: Test results preserved

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Test Target: The Internet](https://the-internet.herokuapp.com/)
- [Page Object Model Guide](https://playwright.dev/docs/pom)

## 📄 License

ISC License

---

**Note**: This suite targets `https://the-internet.herokuapp.com/` for testing purposes only.
