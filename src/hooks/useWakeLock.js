import { useEffect, useRef, useCallback } from 'react';

/**
 * Keeps the screen awake while TTS is active (Screen Wake Lock API)
 */
export const useWakeLock = (enabled) => {
  const sentinelRef = useRef(null);

  const release = useCallback(async () => {
    if (!sentinelRef.current) return;
    try {
      await sentinelRef.current.release();
    } catch {
      // Already released by the browser
    }
    sentinelRef.current = null;
  }, []);

  const request = useCallback(async () => {
    if (!enabled || !('wakeLock' in navigator)) return;
    if (sentinelRef.current || document.visibilityState !== 'visible') return;

    try {
      const sentinel = await navigator.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      sentinel.addEventListener('release', () => {
        if (sentinelRef.current === sentinel) sentinelRef.current = null;
      });
    } catch (error) {
      console.debug('Wake lock not granted:', error.message);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) request();
    else release();
    return () => { release(); };
  }, [enabled, request, release]);

  // Browser releases wake lock when tab is hidden — re-acquire when visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) request();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, request]);

  return { isSupported: typeof navigator !== 'undefined' && 'wakeLock' in navigator };
};
