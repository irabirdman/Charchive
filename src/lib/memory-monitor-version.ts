/**
 * Build-time version identifier for memory monitor
 * This file helps verify the memory monitor code is included in the build
 */

export const MEMORY_MONITOR_VERSION = '1.0.0';
export const MEMORY_MONITOR_BUILD_TIME = new Date().toISOString();

// Log at module load time (this will be in the bundle)
console.error('[MemoryMonitor] Version:', MEMORY_MONITOR_VERSION);
console.error('[MemoryMonitor] Build time:', MEMORY_MONITOR_BUILD_TIME);
