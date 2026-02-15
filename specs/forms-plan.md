# Forms & Inputs Test Plan

## Application Overview

Comprehensive testing of form elements and input controls on the-internet.herokuapp.com, covering checkboxes, dropdowns, file uploads, text inputs, number inputs, sliders, dynamic controls, and authentication forms. Each test suite validates positive flows, negative scenarios, boundary conditions, and accessibility considerations.

## Test Scenarios

### 1. Checkboxes

**Seed:** `tests/seed.spec.ts`

#### 1.1. Checkbox Initial States

**File:** `tests/forms/checkboxes/initial-states.spec.ts`

**Steps:**
  1. Navigate to /checkboxes
    - expect: Page loads successfully
    - expect: First checkbox is unchecked by default
    - expect: Second checkbox is checked by default

#### 1.2. Checkbox Toggle Functionality

**File:** `tests/forms/checkboxes/toggle-functionality.spec.ts`

**Steps:**
  1. Navigate to /checkboxes
    - expect: Page loads with checkbox 1 unchecked and checkbox 2 checked
  2. Click on the unchecked checkbox (checkbox 1)
    - expect: Checkbox 1 becomes checked
    - expect: State persists without page refresh
  3. Click on the checked checkbox (checkbox 2)
    - expect: Checkbox 2 becomes unchecked
    - expect: State persists without page refresh
  4. Click both checkboxes multiple times
    - expect: Each click toggles the respective checkbox state
    - expect: Both checkboxes can be checked simultaneously
    - expect: Both checkboxes can be unchecked simultaneously

#### 1.3. Checkbox Keyboard Navigation

**File:** `tests/forms/checkboxes/keyboard-navigation.spec.ts`

**Steps:**
  1. Navigate to /checkboxes and focus on checkbox 1 using Tab key
    - expect: Checkbox 1 receives focus indicator
    - expect: Checkbox is accessible via keyboard
  2. Press Space key while checkbox 1 is focused
    - expect: Checkbox 1 toggles state
    - expect: Visual feedback indicates state change
  3. Tab to checkbox 2 and press Space key
    - expect: Checkbox 2 toggles state
    - expect: Tab navigation works between checkboxes

### 2. Dropdown Selection

**Seed:** `tests/seed.spec.ts`

#### 2.1. Dropdown Initial State

**File:** `tests/forms/dropdown/initial-state.spec.ts`

**Steps:**
  1. Navigate to /dropdown
    - expect: Page loads successfully
    - expect: Dropdown shows 'Please select an option' as default
    - expect: Default option is disabled and cannot be reselected

#### 2.2. Dropdown Option Selection

**File:** `tests/forms/dropdown/option-selection.spec.ts`

**Steps:**
  1. Navigate to /dropdown
    - expect: Dropdown is in default state
  2. Click on dropdown to open options
    - expect: Dropdown opens showing all available options
    - expect: Option 1 and Option 2 are selectable
    - expect: Default option is disabled
  3. Select 'Option 1'
    - expect: Dropdown value changes to 'Option 1'
    - expect: Dropdown closes
    - expect: Selection persists without page refresh
  4. Open dropdown again and select 'Option 2'
    - expect: Dropdown value changes to 'Option 2'
    - expect: Previous selection is replaced

#### 2.3. Dropdown Keyboard Navigation

**File:** `tests/forms/dropdown/keyboard-navigation.spec.ts`

**Steps:**
  1. Navigate to /dropdown and focus dropdown using Tab key
    - expect: Dropdown receives focus indicator
  2. Press Enter or Space to open dropdown
    - expect: Dropdown opens showing all options
  3. Use arrow keys to navigate between options
    - expect: Focus moves between Option 1 and Option 2
    - expect: Disabled option is skipped in navigation
  4. Press Enter to select focused option
    - expect: Option is selected
    - expect: Dropdown closes
    - expect: Selected value is displayed
  5. Press Escape while dropdown is open
    - expect: Dropdown closes without changing selection

### 3. File Upload

**Seed:** `tests/seed.spec.ts`

#### 3.1. File Upload Interface

**File:** `tests/forms/file-upload/interface.spec.ts`

**Steps:**
  1. Navigate to /upload
    - expect: Page loads with file upload interface
    - expect: Choose File button is present
    - expect: Upload button is present
    - expect: Instructions mention drag and drop support

#### 3.2. Valid File Upload

**File:** `tests/forms/file-upload/valid-upload.spec.ts`

**Steps:**
  1. Navigate to /upload
    - expect: File upload interface is ready
  2. Click 'Choose File' button and select a small text file (.txt)
    - expect: File picker dialog opens
    - expect: Selected file name is displayed
  3. Click 'Upload' button
    - expect: Upload process initiates
    - expect: Success message or confirmation is displayed
    - expect: File is successfully uploaded

#### 3.3. Multiple File Format Support

**File:** `tests/forms/file-upload/file-formats.spec.ts`

**Steps:**
  1. Navigate to /upload
    - expect: File upload interface is ready
  2. Upload a small image file (.jpg)
    - expect: Image file uploads successfully
  3. Upload a small PDF file (.pdf)
    - expect: PDF file uploads successfully
  4. Upload a small document file (.docx)
    - expect: Document file uploads successfully or appropriate error message if format not supported

#### 3.4. Upload Without File Selection

**File:** `tests/forms/file-upload/no-file-selected.spec.ts`

**Steps:**
  1. Navigate to /upload
    - expect: File upload interface is ready
    - expect: No file is selected initially
  2. Click 'Upload' button without selecting a file
    - expect: Appropriate error message displays
    - expect: Upload does not proceed
    - expect: User is prompted to select a file

#### 3.5. Large File Upload Handling

**File:** `tests/forms/file-upload/large-file.spec.ts`

**Steps:**
  1. Navigate to /upload
    - expect: File upload interface is ready
  2. Attempt to upload a large file (>10MB if size limits exist)
    - expect: Appropriate handling of large files
    - expect: Error message if file exceeds size limit
    - expect: Progress indication for valid large files

#### 3.6. Drag and Drop File Upload

**File:** `tests/forms/file-upload/drag-drop.spec.ts`

**Steps:**
  1. Navigate to /upload
    - expect: File upload interface supports drag and drop
  2. Drag a file over the upload area
    - expect: Visual feedback indicates drop zone
    - expect: Upload area highlights during drag
  3. Drop the file in the upload area
    - expect: File is selected
    - expect: File name displays
    - expect: Ready for upload
  4. Click 'Upload' button
    - expect: File uploads successfully via drag and drop method

### 4. Text Inputs and Number Inputs

**Seed:** `tests/seed.spec.ts`

#### 4.1. Number Input Basic Functionality

**File:** `tests/forms/inputs/number-input-basic.spec.ts`

**Steps:**
  1. Navigate to /inputs
    - expect: Page loads with number input field
    - expect: Input accepts numeric values
    - expect: Spinner controls are visible
  2. Type a valid positive number (e.g., '123')
    - expect: Number is accepted and displayed
    - expect: Value persists in field
  3. Type a valid negative number (e.g., '-456')
    - expect: Negative number is accepted and displayed
  4. Type a decimal number (e.g., '12.34')
    - expect: Decimal number handling (accepted or rejected based on field configuration)

#### 4.2. Number Input Invalid Data

**File:** `tests/forms/inputs/number-input-invalid.spec.ts`

**Steps:**
  1. Navigate to /inputs
    - expect: Number input field is ready
  2. Type alphabetic characters (e.g., 'abc')
    - expect: Invalid characters are rejected or appropriate validation message appears
  3. Type special characters (e.g., '!@#$')
    - expect: Special characters are rejected or validation feedback provided
  4. Type mixed alphanumeric input (e.g., '12abc')
    - expect: Invalid portion is rejected or appropriate error handling

#### 4.3. Number Input Spinner Controls

**File:** `tests/forms/inputs/number-spinner.spec.ts`

**Steps:**
  1. Navigate to /inputs
    - expect: Number input with spinner controls is visible
  2. Click the up spinner arrow multiple times
    - expect: Value increments with each click
    - expect: Value increases appropriately
  3. Click the down spinner arrow multiple times
    - expect: Value decrements with each click
    - expect: Value decreases appropriately
  4. Use arrow keys (up/down) while field is focused
    - expect: Arrow keys increment/decrement value
    - expect: Keyboard navigation works for value adjustment

#### 4.4. Number Input Boundary Values

**File:** `tests/forms/inputs/number-boundaries.spec.ts`

**Steps:**
  1. Navigate to /inputs
    - expect: Number input field is ready
  2. Type a very large number (e.g., '999999999999999')
    - expect: Large number handling (accepted or appropriate limit indication)
  3. Type zero ('0')
    - expect: Zero value is accepted and displayed
  4. Clear field and leave empty
    - expect: Empty field handling (blank state or default value behavior)

### 5. Form Authentication

**Seed:** `tests/seed.spec.ts`

#### 5.1. Login Form Interface

**File:** `tests/forms/authentication/form-interface.spec.ts`

**Steps:**
  1. Navigate to /login
    - expect: Login page loads with username and password fields
    - expect: Login button is present
    - expect: Instructions specify valid credentials (tomsmith/SuperSecretPassword!)

#### 5.2. Valid Login Credentials

**File:** `tests/forms/authentication/valid-login.spec.ts`

**Steps:**
  1. Navigate to /login
    - expect: Login form is displayed
  2. Enter valid username 'tomsmith'
    - expect: Username field accepts input
    - expect: Text is visible in field
  3. Enter valid password 'SuperSecretPassword!'
    - expect: Password field accepts input
    - expect: Text is masked/hidden for security
  4. Click Login button
    - expect: Login succeeds
    - expect: Redirected to secure area
    - expect: Success message confirms authentication

#### 5.3. Invalid Login Credentials

**File:** `tests/forms/authentication/invalid-login.spec.ts`

**Steps:**
  1. Navigate to /login
    - expect: Login form is displayed
  2. Enter invalid username 'invaliduser' and valid password
    - expect: Login fails
    - expect: Error message displays indicating invalid credentials
  3. Enter valid username and invalid password 'wrongpassword'
    - expect: Login fails
    - expect: Error message displays indicating invalid credentials
  4. Enter both invalid username and invalid password
    - expect: Login fails
    - expect: Error message displays indicating invalid credentials

#### 5.4. Empty Login Form Submission

**File:** `tests/forms/authentication/empty-submission.spec.ts`

**Steps:**
  1. Navigate to /login
    - expect: Login form is displayed
  2. Click Login button without entering any credentials
    - expect: Form validation prevents submission or appropriate error message
    - expect: Required field validation messages appear
  3. Enter only username and leave password empty
    - expect: Form validation indicates password is required
  4. Enter only password and leave username empty
    - expect: Form validation indicates username is required

#### 5.5. Login Form Field Validation

**File:** `tests/forms/authentication/field-validation.spec.ts`

**Steps:**
  1. Navigate to /login
    - expect: Login form is ready
  2. Test username field with extremely long input (>1000 characters)
    - expect: Field handles long input appropriately
    - expect: No application errors occur
  3. Test special characters in username field
    - expect: Special characters are handled appropriately
  4. Test special characters in password field
    - expect: Special characters in password work correctly (as password contains special chars)

### 6. Password Recovery Form

**Seed:** `tests/seed.spec.ts`

#### 6.1. Password Recovery Interface

**File:** `tests/forms/password-recovery/interface.spec.ts`

**Steps:**
  1. Navigate to /forgot_password
    - expect: Password recovery page loads
    - expect: Email input field is present
    - expect: Retrieve password button is present

#### 6.2. Valid Email Submission

**File:** `tests/forms/password-recovery/valid-email.spec.ts`

**Steps:**
  1. Navigate to /forgot_password
    - expect: Password recovery form is displayed
  2. Enter valid email format 'test@example.com'
    - expect: Email field accepts valid email format
  3. Click 'Retrieve password' button
    - expect: Form submits successfully
    - expect: Confirmation message or redirect occurs
    - expect: Process completes without errors

#### 6.3. Invalid Email Formats

**File:** `tests/forms/password-recovery/invalid-email.spec.ts`

**Steps:**
  1. Navigate to /forgot_password
    - expect: Password recovery form is displayed
  2. Enter invalid email format 'notanemail'
    - expect: Email validation prevents submission or shows error message
  3. Enter email without domain 'test@'
    - expect: Email validation handles incomplete email
  4. Enter email with multiple @ symbols 'test@@example.com'
    - expect: Email validation catches malformed email
  5. Leave email field empty and submit
    - expect: Required field validation prevents submission

### 7. Dynamic Controls

**Seed:** `tests/seed.spec.ts`

#### 7.1. Dynamic Controls Interface

**File:** `tests/forms/dynamic-controls/interface.spec.ts`

**Steps:**
  1. Navigate to /dynamic_controls
    - expect: Dynamic controls page loads
    - expect: Checkbox with 'Remove' button is present
    - expect: Disabled text input with 'Enable' button is present
    - expect: Page explains dynamic element behavior

#### 7.2. Checkbox Remove and Add Functionality

**File:** `tests/forms/dynamic-controls/checkbox-remove-add.spec.ts`

**Steps:**
  1. Navigate to /dynamic_controls
    - expect: Checkbox and Remove button are visible
  2. Click 'Remove' button
    - expect: Button text changes to indicate loading/processing
    - expect: Checkbox disappears from page
    - expect: Button text changes to 'Add'
    - expect: Loading message appears and disappears
  3. Click 'Add' button
    - expect: Button shows loading state
    - expect: Checkbox reappears on page
    - expect: Button text changes back to 'Remove'
    - expect: Loading message appears and disappears
  4. Test checkbox before and after removal/addition
    - expect: Checkbox functionality works normally before removal
    - expect: Checkbox functionality works normally after being added back

#### 7.3. Text Input Enable and Disable Functionality

**File:** `tests/forms/dynamic-controls/input-enable-disable.spec.ts`

**Steps:**
  1. Navigate to /dynamic_controls
    - expect: Text input is disabled
    - expect: Enable button is present
  2. Verify disabled input cannot be interacted with
    - expect: Input field does not accept text
    - expect: Input appears visually disabled
  3. Click 'Enable' button
    - expect: Button shows loading state
    - expect: Text input becomes enabled
    - expect: Button text changes to 'Disable'
    - expect: Loading message appears and disappears
  4. Type text into enabled input field
    - expect: Input accepts text input
    - expect: Text is visible and editable
  5. Click 'Disable' button
    - expect: Button shows loading state
    - expect: Text input becomes disabled again
    - expect: Button text changes to 'Enable'
    - expect: Entered text remains but field becomes non-interactive

#### 7.4. Dynamic Controls Loading States

**File:** `tests/forms/dynamic-controls/loading-states.spec.ts`

**Steps:**
  1. Navigate to /dynamic_controls
    - expect: Both control sections are in initial state
  2. Click Remove button and observe loading behavior
    - expect: Loading message appears
    - expect: Button becomes disabled during loading
    - expect: Loading completes with state change
    - expect: UI updates appropriately
  3. Click Enable button and observe loading behavior
    - expect: Loading message appears
    - expect: Button becomes disabled during loading
    - expect: Loading completes with state change
    - expect: UI updates appropriately

### 8. Horizontal Slider

**Seed:** `tests/seed.spec.ts`

#### 8.1. Slider Interface and Initial State

**File:** `tests/forms/slider/interface.spec.ts`

**Steps:**
  1. Navigate to /horizontal_slider
    - expect: Horizontal slider page loads
    - expect: Slider control is visible
    - expect: Initial value is 0
    - expect: Value display shows current slider value
    - expect: Instructions explain interaction methods

#### 8.2. Slider Mouse Interaction

**File:** `tests/forms/slider/mouse-interaction.spec.ts`

**Steps:**
  1. Navigate to /horizontal_slider
    - expect: Slider is at initial position (0)
  2. Click and drag slider handle to the right
    - expect: Slider handle moves with mouse
    - expect: Value display updates in real-time
    - expect: Value increases as slider moves right
  3. Drag slider handle to the left
    - expect: Slider handle moves with mouse
    - expect: Value display updates
    - expect: Value decreases as slider moves left
  4. Click directly on slider track at different positions
    - expect: Slider handle jumps to clicked position
    - expect: Value updates to reflect new position

#### 8.3. Slider Keyboard Navigation

**File:** `tests/forms/slider/keyboard-navigation.spec.ts`

**Steps:**
  1. Navigate to /horizontal_slider and focus slider
    - expect: Slider receives keyboard focus
    - expect: Focus indicator is visible
  2. Press right arrow key multiple times
    - expect: Slider value increases with each key press
    - expect: Value display updates
    - expect: Handle position moves right
  3. Press left arrow key multiple times
    - expect: Slider value decreases with each key press
    - expect: Value display updates
    - expect: Handle position moves left
  4. Test Home and End keys (if supported)
    - expect: Home key moves to minimum value
    - expect: End key moves to maximum value

#### 8.4. Slider Boundary Values

**File:** `tests/forms/slider/boundary-values.spec.ts`

**Steps:**
  1. Navigate to /horizontal_slider
    - expect: Slider is ready for testing
  2. Move slider to minimum possible value
    - expect: Slider reaches minimum boundary
    - expect: Value display shows minimum value
    - expect: Cannot move further left
  3. Move slider to maximum possible value
    - expect: Slider reaches maximum boundary
    - expect: Value display shows maximum value
    - expect: Cannot move further right
  4. Test precision of value steps
    - expect: Value increments are consistent
    - expect: Value precision matches expected decimal places

## Test Data Management

To ensure consistent and maintainable test data across all form testing scenarios, use the following standardized test data structure:

```typescript
export const testData = {
  validCredentials: {
    username: 'tomsmith',
    password: 'SuperSecretPassword!'
  },
  testFiles: {
    smallText: 'fixtures/small-file.txt',
    smallImage: 'fixtures/test-image.jpg',
    smallPdf: 'fixtures/test-document.pdf',
    smallDocx: 'fixtures/test-document.docx',
    largeFile: 'fixtures/large-file.zip'
  },
  validEmails: [
    'test@example.com', 
    'user.name@domain.co.uk',
    'test.email+tag@subdomain.domain.com'
  ],
  invalidEmails: [
    'notanemail', 
    'test@', 
    'test@@example.com',
    '@example.com',
    'test@.com',
    'test..email@example.com'
  ],
  numberInputValues: {
    valid: [0, 1, -1, 123, -456, 999999],
    invalid: ['abc', '!@#$', '12abc', 'a12', '12.34.56'],
    boundary: [0, -999999999999999, 999999999999999]
  },
  longTextInput: 'a'.repeat(1001), // For testing field length limits
  sliderValues: {
    minimum: 0,
    maximum: 5,
    stepSize: 0.5
  }
};
