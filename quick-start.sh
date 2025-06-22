#!/bin/bash

echo "🚀 Quick Start Guide for FormCraft"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please make sure you're in the project directory."
    exit 1
fi

echo "1️⃣ Installing dependencies..."
npm install

echo ""
echo "2️⃣ Running basic test..."
npm test

echo ""
echo "3️⃣ Type checking..."
npm run type-check

echo ""
echo "4️⃣ Building project..."
npm run build

echo ""
echo "✅ Setup complete! Available commands:"
echo "  npm test          - Run tests"
echo "  npm run test:watch - Run tests in watch mode"
echo "  npm run lint      - Check code quality"
echo "  npm run build     - Build the package"
echo "  npm run dev       - Build in watch mode"
echo ""
echo "🎉 Your FormCraft library is ready!"
