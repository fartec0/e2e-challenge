## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the App](#running-the-app)
4. [Running Tests](#running-tests)
5. [Test Suites](#test-suites)
6. [Testing Strategy](#testing-strategy)
7. [Instructions](#instructions)

---

## Prerequisites

- **Node.js** (v22.14 or later) - Download from nodejs.org or use nvm
  `nvm install 22.14`
  `nvm use 22.14`

---

## Installation

1. **Clone** this repository (or download the source).
2. **Install dependencies**:

   `npm install`


---

## Running the App

1. **Serve** the app locally:

   `vite` or `npm run dev`
   
   It will compile and run the React app on **<http://localhost:5173/>** by default.

2. **Open** your browser at <http://localhost:5173/>.

---

## Running Tests

1. **Make sure the app is running** in another terminal window:

   ```bash
   npm run dev
   ```
   
2. **Run all tests**:

   ```bash
   npm run test
   ```

3. **Run specific test suite**:

   ```bash
   npx playwright test tests/accessibility.spec.js
   ```

4. **View test reports**:

   ```bash
   npm run test:report
   ```

---

## Test Suites

### Basic Tests

Located in `tests/example.spec.js`
- **Basic test**: Verifies that the application loads correctly with the expected page title.

### Accessibility Tests

Located in `tests/accessibility.spec.js`
- **Should have proper semantic structure**: Ensures the application has appropriate DOM structure.
- **All images should have alt text**: Verifies that all images in the application have alt text for screen readers.
- **Should have sufficient color contrast**: Tests that the application has readable color contrast.

### Compatibility Tests

Located in `tests/compatibility.spec.js`
- **Should render correctly in different browsers**: Validates the application works in Chromium, Firefox, and WebKit.
- **Should display properly on different viewports**: Ensures responsive design works on Desktop, Tablet, and Mobile screen sizes.

### Performance Tests

Located in `tests/performance.spec.js`
- **Page load time should be acceptable**: Verifies that the application loads within an acceptable timeframe (under 3 seconds).
- **Animations should be smooth**: Checks that animations in the application run smoothly.
- **Should not have memory leaks**: Monitors memory usage to detect potential memory leaks.

### Reliability Tests

Located in `tests/reliability.spec.js`
- **Should handle repeated interactions**: Tests application stability under rapid user interactions.
- **Should recover from errors**: Validates that the application can recover gracefully from JavaScript errors.
- **Should handle network fluctuations**: Ensures the application remains functional during offline/online transitions.

### Security Tests

Located in `tests/security.spec.js`
- **Should have appropriate Content Security Policy headers**: Checks for proper security headers.
- **Should sanitize user input to prevent XSS**: Tests protection against cross-site scripting attacks.
- **Should use HTTPS for external resources**: Verifies that external resources are loaded securely.

### Scalability Tests

Located in `tests/scalability.spec.js`
- **Should handle large data loads**: Tests application performance with large datasets.
- **Should handle concurrent operations**: Validates the application's behavior under concurrent user sessions.
- **Should maintain performance under load**: Ensures performance doesn't degrade significantly under load.

---

## Testing Strategy

This project uses a Page Object Model (POM) pattern for organizing and maintaining test code. The POM pattern improves test maintainability by separating page-specific logic from test logic.

For detailed information about our POM implementation, please see:
- [POM-STRATEGY.md](POM-STRATEGY.md)

Additional project documentation:
- [CONTRIBUTE.md](CONTRIBUTE.md) - Guidelines for contributors
- [IMPROVEMENTS.md](IMPROVEMENTS.md) - Planned improvements to the test suite

---

## Instructions

1. Add a playwright testing suite to the project

2. Add some end-to-end tests in a way you believe is most efficient.

3. Creating a Page Object Model (POM) to assist your tests if you want to, this is not mandatory.

4. Avoid modifying the application’s source files directly, if possible.
5. Using any type of AI is permitted and encouraged

---

## Submitting Your Test

After completing the challenge, please follow these steps to submit your work for evaluation:

1. Create a new **private repository** on GitHub.
2. Add a new readme or edit this one with the instructions about how to run your tests
3. Add the following GitHub user as a collaborator so we can access and review your solution:
`gabrielbs`, `hugodom`

---

**Happy Testing!**