#!/bin/bash

echo "🔧 Fixing Jest TypeScript setup..."

# Install missing dependencies
echo "📦 Installing missing dependencies..."
npm install --save-dev @types/node

# Clear any cached files
echo "🧹 Clearing caches..."
rm -rf node_modules/.cache
rm -rf dist
rm -f tsconfig.tsbuildinfo

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Run type check
echo "🔍 Running type check..."
npx tsc --noEmit

# Run tests
echo "🧪 Running tests..."
npm test

echo "✅ Jest setup fixed!"
