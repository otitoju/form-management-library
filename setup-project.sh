#!/bin/bash

echo "🚀 Setting up FormCraft project..."

# Create project structure
mkdir -p src/{core,components/{web,native},types,utils,styles,__tests__/{core,components/{web,native}}}
mkdir -p scripts
mkdir -p .github/workflows

echo "📁 Project structure created"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install dev dependencies
echo "📦 Installing dev dependencies..."
npm install --save-dev \
  @types/jest@^29.0.0 \
  @testing-library/react@^14.0.0 \
  @testing-library/react-native@^12.0.0 \
  @testing-library/jest-dom@^6.0.0 \
  jest@^29.0.0 \
  jest-environment-jsdom@^29.0.0 \
  ts-jest@^29.0.0 \
  eslint@^8.0.0 \
  @typescript-eslint/eslint-plugin@^6.0.0 \
  @typescript-eslint/parser@^6.0.0

echo "✅ Dependencies installed"

# Make scripts executable
chmod +x scripts/*.ts

echo "🎉 Setup complete! You can now run:"
echo "  npm test"
echo "  npm run build"
echo "  npm run lint"
