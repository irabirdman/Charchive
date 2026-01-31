'use client'

import { useEffect } from 'react'
import { startPeriodicLogging, stopPeriodicLogging, logMemoryUsage } from '@/lib/memory-monitor'
import { MEMORY_MONITOR_VERSION } from '@/lib/memory-monitor-version'

// Force a console log that will definitely show (using error so it's never stripped)
console.error('[MemoryMonitor Component] MODULE LOADED - Version:', MEMORY_MONITOR_VERSION);
console.error('[MemoryMonitor Component] This component should mount and start logging');

/**
 * Client-side memory monitoring component
 * Starts periodic memory logging when mounted
 */
export function MemoryMonitor() {
  useEffect(() => {
    console.log('[MemoryMonitor] Component mounting...');
    
    // Log initial memory on mount
    console.log('[MemoryMonitor] Calling logMemoryUsage...');
    logMemoryUsage('Client', 'MemoryMonitor: Component mounted')
    console.log('[MemoryMonitor] logMemoryUsage called');

    // Start periodic logging
    console.log('[MemoryMonitor] Starting periodic logging...');
    startPeriodicLogging()
    console.log('[MemoryMonitor] Periodic logging started');

    // Cleanup on unmount
    return () => {
      console.log('[MemoryMonitor] Component unmounting...');
      logMemoryUsage('Client', 'MemoryMonitor: Component unmounting')
      stopPeriodicLogging()
    }
  }, [])

  // This component doesn't render anything
  return null
}
