# Contributing to the E2E Testing Project

Thank you for your interest in contributing to our end-to-end testing project. This document provides guidelines and instructions to help you contribute effectively.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Writing Tests](#writing-tests)
4. [Code Style](#code-style)
5. [Pull Request Process](#pull-request-process)
6. [Adding New Test Suites](#adding-new-test-suites)

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/e2e-challenge.git
   cd e2e-challenge
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Environment

1. **Required software**:
   - Node.js (v22.14 or later)
   - Playwright

2. **Setup**:
   - Install browsers for Playwright:
     ```bash
     npx playwright install
     ```

## Writing Tests

### Test Structure

We follow the "-ilities" testing approach, focusing on these quality attributes:
- **Accessibility**: Ensuring the app is usable by people with disabilities
- **Compatibility**: Ensuring the app works across different browsers and devices
- **Performance**: Ensuring the app responds quickly and efficiently
- **Reliability**: Ensuring the app behaves consistently and recovers from errors
- **Security**: Ensuring the app protects data and prevents vulnerabilities
- **Scalability**: Ensuring the app performs well under increased load

### Guidelines for New Tests

1. **Use descriptive test names** that clearly state what is being tested
2. **Keep tests independent** so they can be run in any order
3. **Add comments** to explain complex testing logic
4. **Use appropriate assertions** to verify expected behavior

## Code Style

We follow these conventions:
- Use ES6+ syntax
- Use async/await for asynchronous code
- Use descriptive variable and function names
- Keep test files focused on a single "-ility" aspect

## Pull Request Process

1. **Create a branch** with a descriptive name
2. **Make your changes** and commit them with clear messages
3. **Run all tests** to ensure nothing breaks
   ```bash
   npm run test
   ```
4. **Push your changes** to your fork
5. **Submit a pull request** with a clear description of the changes

## Adding New Test Suites

To add a new test suite:

1. **Create a new file** in the `tests` directory with a descriptive name ending with `.spec.js`
2. **Import required modules**:
   ```javascript
   import { test, expect } from '@playwright/test';
   ```
3. **Group related tests** using `test.describe`
4. **Ensure your new tests** follow the existing patterns
5. **Document your test suite** by updating the README.md file

Happy contributing!