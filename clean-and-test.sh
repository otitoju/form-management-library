#!/bin/bash

echo "🧹 Cleaning up project..."

# Remove any duplicate config files
rm -f jest.config.json

# Clear caches
rm -rf node_modules/.cache
rm -rf .jest
npx jest --clearCache

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Run type check
echo "🔍 Type checking..."
npm run type-check

# Run tests
echo "🧪 Running tests..."
npm test

echo "✅ All done!"
