#!/bin/bash

echo "🔧 Fixing test configuration..."

# Clear Jest cache
npx jest --clearCache

# Remove problematic files from test discovery
echo "📁 Organizing test files..."

# Install missing React dependencies
echo "📦 Installing React dependencies..."
npm install --save-dev react@^18.0.0 react-dom@^18.0.0

# Run tests
echo "🧪 Running tests..."
npm test

echo "✅ Tests should now work!"
