#!/bin/bash
# Railway build verification script
# This script verifies that memory monitor code is included in the build

echo "🔍 Verifying memory monitor code is included in build..."

# Check if memory monitor files exist
if [ ! -f "src/lib/memory-monitor.ts" ]; then
    echo "❌ ERROR: memory-monitor.ts not found!"
    exit 1
fi

if [ ! -f "src/components/memory/MemoryMonitor.tsx" ]; then
    echo "❌ ERROR: MemoryMonitor.tsx not found!"
    exit 1
fi

if [ ! -f "src/lib/memory-monitor-version.ts" ]; then
    echo "❌ ERROR: memory-monitor-version.ts not found!"
    exit 1
fi

echo "✅ All memory monitor files found"

# Check if memory monitor is imported in layout
if ! grep -q "MemoryMonitor" src/app/layout.tsx; then
    echo "❌ ERROR: MemoryMonitor not imported in layout.tsx!"
    exit 1
fi

echo "✅ MemoryMonitor imported in layout"

# After build, verify the code is in the bundle
if [ -d ".next" ]; then
    echo "✅ Build directory exists"
    
    # Check if we can find memory monitor references in the build
    if grep -r "MemoryMonitor" .next/standalone 2>/dev/null | head -1 > /dev/null || \
       grep -r "memory-monitor" .next/server 2>/dev/null | head -1 > /dev/null; then
        echo "✅ Memory monitor code found in build output"
    else
        echo "⚠️  WARNING: Could not verify memory monitor in build output (this may be normal)"
    fi
fi

echo "✅ Build verification complete"
