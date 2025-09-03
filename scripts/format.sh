#!/bin/bash

# Quick formatting script for Cursor
# Run this script to format all code files

echo "🎨 Running Prettier formatting..."
npm run prettier

echo "✅ Formatting complete!"
echo "📋 You can also run:"
echo "   npm run prettier:check  # Check formatting without changing files"
echo "   npm run lint:fix        # Fix ESLint issues"
