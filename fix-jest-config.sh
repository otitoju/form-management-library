#!/bin/bash

echo "🔧 Fixing Jest configuration..."

# Remove duplicate config files
if [ -f "jest.config.json" ]; then
    rm jest.config.json
    echo "✅ Removed jest.config.json"
fi

# Clear Jest cache
echo "🧹 Clearing Jest cache..."
npx jest --clearCache

# Install missing dependencies if needed
echo "📦 Checking dependencies..."
npm install --save-dev react@^18.0.0 react-dom@^18.0.0

echo "🧪 Running tests..."
npm test

echo "✅ Jest configuration fixed!"
