# Authentication & Security Test Plan

## Application Overview

Comprehensive test plan for authentication and security-related features on https://the-internet.herokuapp.com/. This site provides multiple authentication mechanisms including form-based authentication, HTTP Basic Auth, Digest Authentication, and secure file access. Each feature provides different scenarios for testing positive flows, negative cases, and edge conditions.

## Test Scenarios

### 1. Form Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Valid Login Flow

**File:** `tests/form-authentication/valid-login.spec.ts`

**Steps:**
  1. Navigate to /login page
    - expect: Login page displays with username and password fields
    - expect: Instructions show valid credentials (tomsmith/SuperSecretPassword!)
  2. Enter valid username 'tomsmith' in username field
    - expect: Username field accepts the input
    - expect: No validation errors appear
  3. Enter valid password 'SuperSecretPassword!' in password field
    - expect: Password field accepts the input
    - expect: Characters are masked/hidden
  4. Click the 'Login' button
    - expect: User is redirected to /secure page
    - expect: Success message 'You logged into a secure area!' is displayed
    - expect: Secure Area heading is visible
    - expect: Logout link is present

#### 1.2. Logout Functionality

**File:** `tests/form-authentication/logout-flow.spec.ts`

**Steps:**
  1. Complete valid login to reach secure area
    - expect: User is on secure area page
  2. Click the 'Logout' link
    - expect: User is redirected back to /login page
    - expect: Success message 'You logged out of the secure area!' appears
    - expect: Login form is visible again

#### 1.3. Invalid Username

**File:** `tests/form-authentication/invalid-username.spec.ts`

**Steps:**
  1. Navigate to /login page
    - expect: Login page is displayed
  2. Enter invalid username 'wronguser' in username field
    - expect: Username field accepts the input
  3. Enter any password in password field
    - expect: Password field accepts the input
  4. Click the 'Login' button
    - expect: User remains on login page
    - expect: Error message 'Your username is invalid!' is displayed
    - expect: Username and password fields are cleared or remain filled

#### 1.4. Invalid Password

**File:** `tests/form-authentication/invalid-password.spec.ts`

**Steps:**
  1. Navigate to /login page
    - expect: Login page is displayed
  2. Enter valid username 'tomsmith' in username field
    - expect: Username field accepts the input
  3. Enter invalid password 'wrongpassword' in password field
    - expect: Password field accepts the input
  4. Click the 'Login' button
    - expect: User remains on login page
    - expect: Error message 'Your password is invalid!' is displayed
    - expect: Username field retains the valid username
    - expect: Password field is cleared

#### 1.5. Empty Credentials

**File:** `tests/form-authentication/empty-credentials.spec.ts`

**Steps:**
  1. Navigate to /login page
    - expect: Login page is displayed
  2. Leave username field empty
    - expect: Username field is empty
  3. Leave password field empty
    - expect: Password field is empty
  4. Click the 'Login' button
    - expect: User remains on login page
    - expect: Appropriate error message is displayed
    - expect: No successful authentication occurs

#### 1.6. Special Characters in Password

**File:** `tests/form-authentication/special-characters-password.spec.ts`

**Steps:**
  1. Navigate to /login page
    - expect: Login page is displayed
  2. Enter valid username 'tomsmith' in username field
    - expect: Username field accepts the input
  3. Test various special characters in password field: symbols, Unicode, emojis
    - expect: Password field handles special characters correctly
    - expect: System processes special characters without errors
  4. Verify actual password 'SuperSecretPassword!' with exclamation mark works correctly
    - expect: Authentication succeeds with special characters in valid password
    - expect: No character encoding issues occur

#### 1.7. Case Sensitivity Testing

**File:** `tests/form-authentication/case-sensitivity.spec.ts`

**Steps:**
  1. Navigate to /login page
    - expect: Login page is displayed
  2. Test username case variations: 'TomSmith', 'TOMSMITH', 'tomSMITH'
    - expect: Case-sensitive username validation is enforced
    - expect: Only exact case 'tomsmith' allows authentication
  3. Test password case variations: 'supersecretpassword!', 'SUPERSECRETPASSWORD!'
    - expect: Case-sensitive password validation is enforced
    - expect: Only exact case 'SuperSecretPassword!' allows authentication
  4. Verify mixed case combinations
    - expect: Authentication fails with incorrect case combinations
    - expect: Error messages are appropriate for case sensitivity issues

#### 1.8. Form Field Validation

**File:** `tests/form-authentication/form-field-validation.spec.ts`

**Steps:**
  1. Navigate to /login page
    - expect: Login page is displayed
  2. Test field length limits and constraints
    - expect: Username field handles maximum character limits
    - expect: Password field handles maximum character limits
  3. Test HTML injection and form manipulation
    - expect: Form fields prevent HTML/script injection
    - expect: Field validation is enforced on client and server side
  4. Test copy/paste functionality in password field
    - expect: Password field allows paste operations
    - expect: Pasted content is properly masked
  5. Test tab navigation between fields
    - expect: Tab key navigation works correctly
    - expect: Form submission works via Enter key

#### 1.9. Direct Secure Area Access

**File:** `tests/form-authentication/direct-secure-access.spec.ts`

**Steps:**
  1. Navigate directly to /secure page without logging in
    - expect: User is redirected to login page or access is denied
    - expect: No unauthorized access to secure content occurs

#### 1.10. Session Management

**File:** `tests/form-authentication/session-management.spec.ts`

**Steps:**
  1. Complete valid login to reach secure area
    - expect: User is authenticated and on secure page
  2. Open new tab/window and navigate to /secure
    - expect: Session state is maintained across tabs
    - expect: User can access secure area in new tab/window
  3. Logout from original tab
    - expect: User is logged out from all sessions
    - expect: Secure area becomes inaccessible in other tabs

### 2. Basic Authentication

**Seed:** `tests/seed.spec.ts`

#### 2.1. Valid Basic Auth Credentials

**File:** `tests/basic-auth/valid-credentials.spec.ts`

**Steps:**
  1. Navigate to /basic_auth with embedded credentials: https://admin:admin@the-internet.herokuapp.com/basic_auth
    - expect: Page loads successfully with HTTP 200 status
    - expect: Success message 'Congratulations! You must have the proper credentials.' is displayed
    - expect: Basic Auth heading is visible

#### 2.2. Invalid Basic Auth Credentials

**File:** `tests/basic-auth/invalid-credentials.spec.ts`

**Steps:**
  1. Navigate to /basic_auth with invalid credentials: https://wronguser:wrongpass@the-internet.herokuapp.com/basic_auth
    - expect: HTTP 401 Unauthorized response
    - expect: Authentication error occurs
    - expect: Access is denied with ERR_INVALID_AUTH_CREDENTIALS

#### 2.3. Basic Auth Dialog Handling

**File:** `tests/basic-auth/auth-dialog.spec.ts`

**Steps:**
  1. Navigate to /basic_auth without embedded credentials
    - expect: Browser basic auth dialog appears
    - expect: Dialog prompts for username and password
  2. Enter valid credentials (admin/admin) in the dialog
    - expect: Page loads successfully
    - expect: Success message is displayed

#### 2.4. Basic Auth Dialog Cancellation

**File:** `tests/basic-auth/auth-dialog-cancel.spec.ts`

**Steps:**
  1. Navigate to /basic_auth without embedded credentials
    - expect: Browser basic auth dialog appears
  2. Cancel/dismiss the authentication dialog
    - expect: Access is denied
    - expect: HTTP 401 status or authentication error occurs
    - expect: User cannot access the protected resource

#### 2.5. Empty Basic Auth Credentials

**File:** `tests/basic-auth/empty-credentials.spec.ts`

**Steps:**
  1. Navigate to /basic_auth with empty credentials: https://:@the-internet.herokuapp.com/basic_auth
    - expect: HTTP 401 Unauthorized response
    - expect: Authentication fails
    - expect: Access is denied

#### 2.6. Browser Credential Storage

**File:** `tests/basic-auth/browser-credential-storage.spec.ts`

**Steps:**
  1. Navigate to /basic_auth and authenticate with valid credentials through browser dialog
    - expect: Authentication succeeds and page loads
    - expect: Browser may offer to save credentials (browser-dependent)
  2. Navigate away and return to /basic_auth
    - expect: Browser may auto-fill credentials from storage
    - expect: Re-authentication behavior varies by browser settings
  3. Test credential persistence across browser sessions
    - expect: Stored credentials behave according to browser policies
    - expect: Security implications of credential storage are considered
  4. Test clearing stored credentials
    - expect: Credential clearing functionality works as expected
    - expect: Subsequent visits require fresh authentication

### 3. Digest Authentication

**Seed:** `tests/seed.spec.ts`

#### 3.1. Valid Digest Auth Credentials

**File:** `tests/digest-auth/valid-credentials.spec.ts`

**Steps:**
  1. Navigate to /digest_auth with embedded credentials: https://admin:admin@the-internet.herokuapp.com/digest_auth
    - expect: Page loads successfully with HTTP 200 status
    - expect: Success message 'Congratulations! You must have the proper credentials.' is displayed
    - expect: Digest Auth heading is visible

#### 3.2. Invalid Digest Auth Credentials

**File:** `tests/digest-auth/invalid-credentials.spec.ts`

**Steps:**
  1. Navigate to /digest_auth with invalid credentials: https://wronguser:wrongpass@the-internet.herokuapp.com/digest_auth
    - expect: HTTP 401 Unauthorized response
    - expect: Authentication error occurs
    - expect: Access is denied

#### 3.3. Digest Auth vs Basic Auth Differences

**File:** `tests/digest-auth/auth-mechanism-comparison.spec.ts`

**Steps:**
  1. Navigate to /digest_auth with valid credentials
    - expect: Digest authentication mechanism is used
    - expect: Success page is displayed
  2. Compare response headers and authentication method with Basic Auth
    - expect: Different authentication headers are used (Digest vs Basic)
    - expect: Both provide same access level to authenticated content

#### 3.4. Digest Auth Dialog Handling

**File:** `tests/digest-auth/auth-dialog.spec.ts`

**Steps:**
  1. Navigate to /digest_auth without embedded credentials
    - expect: Browser digest auth dialog appears
    - expect: Dialog prompts for username and password
  2. Enter valid credentials (admin/admin) in the dialog
    - expect: Page loads successfully
    - expect: Success message is displayed

#### 3.5. Realm Verification

**File:** `tests/digest-auth/realm-verification.spec.ts`

**Steps:**
  1. Examine authentication challenge response headers
    - expect: Digest authentication includes proper realm information
    - expect: Realm parameter is correctly set and communicated
  2. Test authentication with realm-specific challenges
    - expect: Browser handles realm correctly in authentication dialog
    - expect: Realm information is displayed to user appropriately
  3. Compare realm handling between Basic and Digest authentication
    - expect: Both authentication types handle realms consistently
    - expect: Realm verification works as per HTTP specification

### 4. Secure File Download

**Seed:** `tests/seed.spec.ts`

#### 4.1. Secure Download with Authentication

**File:** `tests/secure-download/authenticated-access.spec.ts`

**Steps:**
  1. Navigate to /download_secure with valid credentials: https://admin:admin@the-internet.herokuapp.com/download_secure
    - expect: Page loads successfully
    - expect: Secure File Downloader heading is visible
    - expect: List of downloadable files is displayed
    - expect: Various file types are available (PDF, TXT, PNG, etc.)
  2. Click on a test file download link (e.g., test.pdf)
    - expect: File download is initiated
    - expect: File is successfully downloaded
    - expect: No authentication errors occur during download

#### 4.2. File Type Validation and Download Completion

**File:** `tests/secure-download/file-validation.spec.ts`

**Steps:**
  1. Navigate to secure download area with authentication
    - expect: File listing is accessible
    - expect: Multiple file types are available
  2. Test downloading different file types (PDF, TXT, PNG, CSV, ZIP, etc.)
    - expect: Each file type downloads correctly
    - expect: Downloaded files maintain proper MIME types
    - expect: File sizes match expected values
  3. Verify download completion and file integrity
    - expect: Downloaded files are complete and not corrupted
    - expect: File content matches expected format
    - expect: No partial downloads or truncated files
  4. Test downloading large files
    - expect: Large file downloads complete successfully
    - expect: Download progress is handled appropriately
    - expect: Timeout handling works for long downloads

#### 4.3. Secure Download without Authentication

**File:** `tests/secure-download/unauthenticated-access.spec.ts`

**Steps:**
  1. Navigate to /download_secure without authentication
    - expect: HTTP 401 Unauthorized response
    - expect: Access is denied
    - expect: File list is not accessible

#### 4.4. Invalid Authentication for Secure Download

**File:** `tests/secure-download/invalid-auth.spec.ts`

**Steps:**
  1. Navigate to /download_secure with invalid credentials: https://wronguser:wrongpass@the-internet.herokuapp.com/download_secure
    - expect: HTTP 401 Unauthorized response
    - expect: Authentication error occurs
    - expect: Access to file download page is denied

#### 4.5. Direct File Access with Authentication

**File:** `tests/secure-download/direct-file-access.spec.ts`

**Steps:**
  1. Navigate directly to a specific file URL with authentication: https://admin:admin@the-internet.herokuapp.com/download_secure/test.pdf
    - expect: File download is initiated directly
    - expect: No intermediary page is required
    - expect: Authentication is verified before file access

#### 4.6. Direct File Access without Authentication

**File:** `tests/secure-download/direct-file-access-unauth.spec.ts`

**Steps:**
  1. Navigate directly to a specific file URL without authentication: https://the-internet.herokuapp.com/download_secure/test.pdf
    - expect: HTTP 401 Unauthorized response
    - expect: File access is denied
    - expect: Authentication is required before file download

### 5. Password Recovery

**Seed:** `tests/seed.spec.ts`

**Note:** Password recovery functionality returns "Internal Server Error" for all requests, indicating limited backend implementation. These tests focus on frontend validation and security aspects.

#### 5.1. Forgot Password with Valid Email

**File:** `tests/password-recovery/valid-email.spec.ts`

**Steps:**
  1. Navigate to /forgot_password page
    - expect: Forgot Password page is displayed
    - expect: Email input field is visible
    - expect: 'Retrieve password' button is present
  2. Enter valid email format 'test@example.com' in email field
    - expect: Email field accepts the input
    - expect: No format validation errors appear
  3. Click 'Retrieve password' button
    - expect: Internal Server Error message appears (known limitation)
    - expect: Request is processed by backend (evidenced by server error)
    - expect: No client-side errors occur

#### 5.2. Forgot Password with Invalid Email Format

**File:** `tests/password-recovery/invalid-email.spec.ts`

**Steps:**
  1. Navigate to /forgot_password page
    - expect: Forgot Password page is displayed
  2. Enter invalid email format 'notanemail' in email field
    - expect: Email field accepts the input
  3. Click 'Retrieve password' button
    - expect: System responds (may show validation error or process anyway)
    - expect: Appropriate handling of invalid email format

#### 5.3. Forgot Password with Empty Email

**File:** `tests/password-recovery/empty-email.spec.ts`

**Steps:**
  1. Navigate to /forgot_password page
    - expect: Forgot Password page is displayed
  2. Leave email field empty
    - expect: Email field remains empty
  3. Click 'Retrieve password' button
    - expect: System responds appropriately
    - expect: Validation error may appear for empty field
    - expect: No successful password reset process occurs

#### 5.4. SQL Injection in Password Recovery

**File:** `tests/password-recovery/sql-injection.spec.ts`

**Steps:**
  1. Navigate to /forgot_password page
    - expect: Forgot Password page is displayed
  2. Enter SQL injection payload in email field: "'; DROP TABLE users; --"
    - expect: System handles malicious input safely
    - expect: No database errors or unintended behavior occurs
    - expect: Input is properly sanitized
  3. Click 'Retrieve password' button
    - expect: System responds without executing malicious SQL
    - expect: No security vulnerabilities are exposed
    - expect: Standard error response occurs

#### 5.5. XSS in Password Recovery

**File:** `tests/password-recovery/xss-prevention.spec.ts`

**Steps:**
  1. Navigate to /forgot_password page
    - expect: Forgot Password page is displayed
  2. Enter XSS payload in email field: "<script>alert('XSS')</script>@test.com"
    - expect: Input is accepted in field
  3. Click 'Retrieve password' button
    - expect: No JavaScript execution occurs
    - expect: Script tags are properly escaped or filtered
    - expect: No XSS vulnerability is exploited

### 6. Security & Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 6.1. HTTPS vs HTTP Protocol

**File:** `tests/security/protocol-security.spec.ts`

**Steps:**
  1. Verify all authentication pages use appropriate protocol
    - expect: Authentication data is transmitted securely
    - expect: No sensitive information is exposed in plain text
  2. Attempt to access authentication pages via HTTP if HTTPS is required
    - expect: Proper redirection to HTTPS occurs
    - expect: Or appropriate security warnings/errors are displayed

#### 6.2. Session Timeout Testing

**File:** `tests/security/session-timeout.spec.ts`

**Steps:**
  1. Login with valid credentials to form authentication
    - expect: User is successfully authenticated
  2. Wait for extended period (test session timeout)
    - expect: Session expires after appropriate timeout
    - expect: User is redirected to login page when accessing secure content
    - expect: Session security is maintained

#### 6.3. Concurrent Session Testing

**File:** `tests/security/concurrent-sessions.spec.ts`

**Steps:**
  1. Login with same credentials from multiple browsers/tabs
    - expect: System handles concurrent sessions appropriately
    - expect: Security is maintained across multiple sessions
  2. Logout from one session
    - expect: Other sessions are handled according to security policy
    - expect: No unauthorized access remains in other sessions

#### 6.4. Browser Back Button After Logout

**File:** `tests/security/back-button-security.spec.ts`

**Steps:**
  1. Login and access secure area
    - expect: User is authenticated and viewing secure content
  2. Logout successfully
    - expect: User is logged out and redirected to login page
  3. Use browser back button to return to secure area
    - expect: Access to secure content is denied
    - expect: User is redirected to login page
    - expect: No cached secure content is displayed

#### 6.5. Authentication Header Manipulation

**File:** `tests/security/header-manipulation.spec.ts`

**Steps:**
  1. Attempt to access protected resources with manually crafted authentication headers
    - expect: Invalid headers are rejected
    - expect: Only properly authenticated requests are granted access
    - expect: No header injection vulnerabilities exist

#### 6.6. Cross-Browser Authentication Compatibility

**File:** `tests/security/cross-browser-auth.spec.ts`

**Steps:**
  1. Test Form Authentication across different browsers (Chrome, Firefox, Safari, Edge)
    - expect: Login functionality works consistently across browsers
    - expect: Session management behaves appropriately per browser
    - expect: Password field masking works correctly in all browsers
  2. Test Basic Auth dialog handling across browsers
    - expect: Browser dialogs appear and function correctly
    - expect: Credential storage behavior varies appropriately by browser
    - expect: Authentication headers are handled consistently
  3. Test Digest Auth across different browsers
    - expect: Digest authentication mechanism works in all browsers
    - expect: Browser-specific differences are documented and handled
  4. Compare security features across browsers
    - expect: Each browser enforces appropriate security policies
    - expect: Differences in credential handling are noted and tested

#### 6.7. Authentication Performance Testing

**File:** `tests/security/auth-performance.spec.ts`

**Steps:**
  1. Measure authentication response times for Form Authentication
    - expect: Login responses occur within acceptable time limits
    - expect: Performance is consistent across multiple attempts
  2. Test Basic/Digest Auth performance with embedded credentials
    - expect: Authentication overhead is minimal
    - expect: Response times are consistent and acceptable
  3. Test concurrent authentication requests
    - expect: System handles multiple simultaneous auth requests
    - expect: No performance degradation under normal load
  4. Test authentication with slow network conditions
    - expect: Authentication works reliably with network delays
    - expect: Appropriate timeout handling occurs

#### 6.8. Mobile Browser Authentication

**File:** `tests/security/mobile-browser-auth.spec.ts`

**Steps:**
  1. Test Form Authentication on mobile browsers
    - expect: Touch input works correctly for form fields
    - expect: Virtual keyboard handling is appropriate
    - expect: Mobile viewport displays form correctly
  2. Test Basic/Digest Auth dialogs on mobile
    - expect: Authentication dialogs are mobile-friendly
    - expect: Input fields are accessible via touch
    - expect: Dialog dismissal works correctly on mobile
  3. Test file download authentication on mobile
    - expect: Secure file downloads work on mobile browsers
    - expect: File handling follows mobile browser conventions
    - expect: Authentication state is maintained during downloads
