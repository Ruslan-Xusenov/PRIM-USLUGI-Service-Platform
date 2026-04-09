#!/bin/bash

# This script initializes Capacitor for mobile app development (WebView wrapper)
# Usage: bash setup_mobile.sh

echo "🚀 Initializing Capacitor for Prim-Uslugi..."

# 1. Install dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 2. Initialize Capacitor
npx cap init prim-uslugi com.primuslugi.app --web-dir out

# 3. Add platforms
npx cap add android
npx cap add ios

echo "✅ Capacitor setup complete!"
echo "To build the app:"
echo "1. Run 'npm run build' (Make sure 'output: export' is in next.config.js)"
echo "2. Run 'npx cap sync'"
echo "3. Run 'npx cap open android' or 'npx cap open ios'"
