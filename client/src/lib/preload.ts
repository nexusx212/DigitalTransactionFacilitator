// Performance optimization: preload critical resources
export function preloadCriticalResources() {
  // Preload common UI components
  const preloadPromises = [
    import("@/components/ui/button"),
    import("@/components/ui/card"),
    import("@/components/ui/input"),
    import("@/components/ui/dialog"),
    import("@/components/layout/sidebar"),
    import("@/components/layout/header"),
  ];

  // Preload in background without blocking
  Promise.all(preloadPromises).catch(() => {
    // Silently fail if preloading fails
  });
}

// Preload critical API data
export async function preloadCriticalData() {
  const currentUser = localStorage.getItem('currentDummyUser');
  if (!currentUser) return;

  const user = JSON.parse(currentUser);
  const headers = {
    'Content-Type': 'application/json',
    'x-firebase-uid': user.uid,
  };

  // Preload critical data in background
  const preloadRequests = [
    fetch('/api/user/' + user.uid, { headers, credentials: 'include' }),
    fetch('/api/product-categories', { headers, credentials: 'include' }),
    fetch('/api/analytics/export', { headers, credentials: 'include' }),
  ];

  Promise.all(preloadRequests.map(req => req.catch(() => null))).catch(() => {
    // Silently fail if preloading fails
  });
}