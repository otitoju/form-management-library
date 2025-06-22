# Publishing Guide

Complete guide for testing and publishing the @formcraft/core package.

## Prerequisites

1. **npm Account**: Create account at [npmjs.com](https://npmjs.com)
2. **npm CLI**: Install and login
   \`\`\`bash
   npm install -g npm
   npm login
   \`\`\`
3. **Git Setup**: Ensure git is configured with your details

## Step-by-Step Publishing Process

### 1. Pre-publish Testing

\`\`\`bash
# Install dependencies
npm install

# Run full test suite
npm test

# Check TypeScript types
npm run type-check

# Lint code
npm run lint

# Build package
npm run build
\`\`\`

### 2. Local Package Testing

Test your package locally before publishing:

\`\`\`bash
# Create test environment
npm run test:local

# In another terminal, start test app
cd test-app
npm run dev
\`\`\`

Visit http://localhost:5173 to test your package in a real app.

### 3. Version Management

Choose appropriate version bump:

- **patch** (1.0.0 → 1.0.1): Bug fixes
- **minor** (1.0.0 → 1.1.0): New features, backward compatible
- **major** (1.0.0 → 2.0.0): Breaking changes

\`\`\`bash
# Bump version
npm version patch  # or minor, major
\`\`\`

### 4. Publishing Options

#### Option A: Manual Publishing

\`\`\`bash
# Publish to latest (production)
npm publish

# Publish to beta
npm publish --tag beta

# Publish to alpha
npm publish --tag alpha
\`\`\`

#### Option B: Automated Publishing Script

\`\`\`bash
# Interactive publishing with checks
npm run scripts/publish-package.ts
\`\`\`

This script will:
- Run all tests and quality checks
- Build the package
- Prompt for version bump and tag
- Publish to npm
- Push git tags

### 5. Post-publish Verification

\`\`\`bash
# Check package on npm
npm view @formcraft/core

# Test installation
npm install @formcraft/core

# Verify package contents
npm pack --dry-run
\`\`\`

## Publishing Checklist

### Before Publishing
- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Package builds successfully (`npm run build`)
- [ ] Local testing completed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped appropriately

### After Publishing
- [ ] Package appears on npmjs.com
- [ ] Installation works: `npm install @formcraft/core`
- [ ] Git tags pushed
- [ ] GitHub release created (optional)
- [ ] Documentation site updated (if applicable)

## Continuous Integration

The package includes GitHub Actions for automated testing and publishing:

### Automated Testing
- Runs on every push and PR
- Tests multiple Node.js versions (16, 18, 20)
- Tests multiple React versions (16.8, 17, 18)
- Generates coverage reports

### Automated Publishing
- Publishes to npm on main branch pushes
- Requires NPM_TOKEN secret in GitHub

### Setting up GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add `NPM_TOKEN` with your npm access token

Generate npm token:
\`\`\`bash
npm token create --read-only
\`\`\`

## Package Distribution Tags

### latest (default)
- Stable, production-ready releases
- Installed by default: `npm install @formcraft/core`

### beta
- Pre-release versions for testing
- Install with: `npm install @formcraft/core@beta`

### alpha
- Early development versions
- Install with: `npm install @formcraft/core@alpha`

## Troubleshooting

### Common Publishing Issues

**"Package name already exists"**
- Choose a unique package name
- Use scoped packages: `@yourname/formcraft`

**"You do not have permission to publish"**
- Ensure you're logged in: `npm whoami`
- Check package name ownership
- Verify npm access token

**"Version already published"**
- Bump version: `npm version patch`
- Cannot republish same version

**Build failures**
- Clear cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check rollup configuration

### Testing Issues

**Tests fail in CI but pass locally**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check for environment-specific code

**TypeScript errors**
- Update @types packages
- Check peer dependency versions
- Verify tsconfig.json settings

## Best Practices

1. **Semantic Versioning**: Follow semver strictly
2. **Changelog**: Keep detailed changelog
3. **Testing**: Test on multiple platforms/versions
4. **Documentation**: Keep README and docs updated
5. **Security**: Regularly audit dependencies
6. **Performance**: Monitor bundle size
7. **Backward Compatibility**: Avoid breaking changes in minor/patch releases

## Package Maintenance

### Regular Tasks
- Update dependencies monthly
- Run security audits: `npm audit`
- Monitor download stats
- Respond to issues and PRs
- Update documentation

### Deprecation Process
If you need to deprecate a version:

\`\`\`bash
npm deprecate @formcraft/core@1.0.0 "Please upgrade to 1.1.0"
\`\`\`

## Support and Community

- Create GitHub issues for bugs
- Use discussions for questions
- Maintain contributor guidelines
- Consider creating a Discord/Slack community
\`\`\`
