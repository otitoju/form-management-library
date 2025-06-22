# Testing Guide

This guide covers how to test the @formcraft/core package locally and prepare it for publishing.

## Local Testing

### 1. Unit Tests

Run the comprehensive test suite:

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

### 2. Type Checking

Ensure TypeScript types are correct:

\`\`\`bash
npm run type-check
\`\`\`

### 3. Linting

Check code quality:

\`\`\`bash
# Check for issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix
\`\`\`

### 4. Local Package Testing

Test the built package in a real application:

\`\`\`bash
# Build the package
npm run build

# Create and run test app
npm run test:local
cd test-app
npm run dev
\`\`\`

This creates a test React app that imports your package locally.

## Manual Testing Checklist

### Web Components
- [ ] Input validation works correctly
- [ ] Error messages display properly
- [ ] Form submission prevents invalid data
- [ ] Accessibility attributes are present
- [ ] Styling can be customized
- [ ] TypeScript types work correctly

### React Native Components
- [ ] Components render on mobile
- [ ] Touch interactions work
- [ ] Modal select functions properly
- [ ] Styling is consistent
- [ ] Performance is acceptable

### Core Functionality
- [ ] Form state updates correctly
- [ ] Validation rules work as expected
- [ ] Schema builder creates proper rules
- [ ] Cross-platform compatibility
- [ ] Memory leaks are avoided

## Integration Testing

### Test with Different React Versions

\`\`\`bash
# Test with React 16.8+
npm install react@16.8.0 react-dom@16.8.0
npm test

# Test with React 17
npm install react@17 react-dom@17
npm test

# Test with React 18 (latest)
npm install react@18 react-dom@18
npm test
\`\`\`

### Test with Different TypeScript Versions

\`\`\`bash
# Test with TypeScript 4.x
npm install typescript@4.9
npm run type-check

# Test with TypeScript 5.x
npm install typescript@5
npm run type-check
\`\`\`

## Performance Testing

### Bundle Size Analysis

\`\`\`bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle
npx webpack-bundle-analyzer dist/index.js
\`\`\`

### Memory Leak Testing

Create a test that mounts/unmounts components repeatedly:

\`\`\`tsx
// Add to your test suite
it('should not leak memory on mount/unmount', () => {
  for (let i = 0; i < 100; i++) {
    const { unmount } = render(<TestForm />)
    unmount()
  }
  // Check memory usage doesn't grow significantly
})
\`\`\`

## Automated Testing

### GitHub Actions Workflow

Create \`.github/workflows/test.yml\`:

\`\`\`yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        react-version: [16.8, 17, 18]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: \${{ matrix.node-version }}
      
      - run: npm ci
      - run: npm install react@\${{ matrix.react-version }}
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
\`\`\`

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] Linting passes
- [ ] Package builds successfully
- [ ] Documentation is up to date
- [ ] Version number is appropriate
- [ ] CHANGELOG.md is updated
- [ ] Git tags are ready

## Publishing Process

### Beta Release

\`\`\`bash
# Publish beta version
npm run publish:beta
\`\`\`

### Production Release

\`\`\`bash
# Publish to latest tag
npm run publish:latest
\`\`\`

### Using the Publishing Script

\`\`\`bash
# Interactive publishing
npm run scripts/publish-package.ts
\`\`\`

This script will:
1. Run all tests and checks
2. Build the package
3. Bump version
4. Publish to npm
5. Push git tags

## Troubleshooting

### Common Issues

**Tests failing in CI but passing locally:**
- Check Node.js version compatibility
- Ensure all dependencies are properly listed
- Verify environment variables

**TypeScript errors:**
- Update @types packages
- Check tsconfig.json configuration
- Verify peer dependency versions

**Build failures:**
- Clear node_modules and reinstall
- Check rollup configuration
- Verify all imports are correct

**Publishing errors:**
- Ensure you're logged into npm: \`npm login\`
- Check package name availability
- Verify npm registry settings
\`\`\`
