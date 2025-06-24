import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    // Try to get a structured error message if available
    let errorMessage: string;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || res.statusText;
      } catch (e) {
        // If JSON parsing fails, fall back to raw text
        errorMessage = res.statusText;
      }
    } else {
      // If not JSON, get raw text
      errorMessage = await res.text() || res.statusText;
    }
    
    // Special handling for auth errors
    if (res.status === 401) {
      // Redirect to auth page if user tries to access protected resource without authentication
      if (window.location.pathname !== '/auth') {
        console.warn('Authentication required, redirecting to login');
        window.location.href = '/auth';
      }
    }
    
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

// Cache for network requests to avoid redundant calls
const requestCache = new Map<string, Promise<Response>>();

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: { cache?: boolean; skipErrorHandling?: boolean }
): Promise<Response> {
  // Use request caching for GET requests to improve performance
  const cacheKey = method === 'GET' ? url : `${method}:${url}:${JSON.stringify(data)}`;
  const useCache = method === 'GET' && (options?.cache !== false);
  
  if (useCache && requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!.then(res => res.clone());
  }
  
  const skipErrorHandling = options?.skipErrorHandling || false;
  
  const fetchPromise = fetch(url, {
    method,
    headers: {
      ...getAuthHeaders(),
      ...(data ? { "Content-Type": "application/json" } : {})
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    // Add performance hints
    priority: method === 'GET' ? 'high' : 'auto',
  }).then(async (res) => {
    // Special case for /api/logout - always consider it a success regardless of status
    if (url === '/api/logout' && method === 'POST') {
      // For logout, we just want to make sure the request completed, successful or not
      // We'll handle session cleanup on client side regardless
      return res;
    }
    
    // For other requests, apply normal error handling unless specifically skipped
    if (!skipErrorHandling) {
      await throwIfResNotOk(res);
    }
    
    return res;
  });
  
  if (useCache) {
    requestCache.set(cacheKey, fetchPromise);
    // Remove from cache after 2 minutes for faster updates
    setTimeout(() => requestCache.delete(cacheKey), 2 * 60 * 1000);
  }
  
  return fetchPromise;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
      headers: getAuthHeaders(),
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true, // Enable refetch on focus for fresh data
      staleTime: 2 * 60 * 1000, // 2 minutes for faster refresh
      gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time  
      retry: 2, // Retry twice for better reliability
      retryDelay: attemptIndex => Math.min(500 * 2 ** attemptIndex, 5000) // Faster exponential backoff
    },
    mutations: {
      retry: 2, // Retry mutations twice for better reliability
      retryDelay: 500, // Faster retry delay
    },
  },
});
