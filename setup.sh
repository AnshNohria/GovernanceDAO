#!/bin/bash

# Setup script for Governance DAO project
echo "🏗️  Setting up Governance DAO project..."

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is required but not installed."
    exit 1
fi

# Check if forge is available
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry is required but not installed."
    echo "📖 Install from: https://getfoundry.sh/"
    exit 1
fi

echo "📦 Initializing git submodules..."
git submodule update --init --recursive

echo "🔧 Installing Foundry dependencies..."
forge install

echo "🏗️  Building contracts..."
forge build

echo "🧪 Running tests..."
forge test

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Start local blockchain: anvil"
echo "  2. Deploy contracts: npm run deploy:local"
echo "  3. Start frontend: npm run frontend:dev"
echo ""
echo "📚 For more information, see README.md"
