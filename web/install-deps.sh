#!/bin/bash

echo "🚀 Nua Security Frontend - Dependency Installation"
echo "=================================================="
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the web directory."
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""

# Try normal install first
npm install

# Check if it succeeded
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "  1. Run: npm run dev"
    echo "  2. Open: http://localhost:3000"
    echo ""
    echo "📖 See QUICKSTART.md for more details"
else
    echo ""
    echo "⚠️  Standard installation failed. Trying with --legacy-peer-deps..."
    echo ""
    
    npm install --legacy-peer-deps
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Dependencies installed successfully with legacy peer deps!"
        echo ""
        echo "📝 Next steps:"
        echo "  1. Run: npm run dev"
        echo "  2. Open: http://localhost:3000"
        echo ""
    else
        echo ""
        echo "❌ Installation failed. Please try manually:"
        echo "  1. Delete node_modules: rm -rf node_modules"
        echo "  2. Delete package-lock.json: rm package-lock.json"
        echo "  3. Try again: npm install --force"
        echo ""
    fi
fi

