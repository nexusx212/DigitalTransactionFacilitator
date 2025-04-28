import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Cache for network requests to avoid redundant calls
const requestCache = new Map<string, Promise<Response>>();

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: { cache?: boolean }
): Promise<Response> {
  // Use request caching for GET requests to improve performance
  const cacheKey = method === 'GET' ? url : `${method}:${url}:${JSON.stringify(data)}`;
  const useCache = method === 'GET' && (options?.cache !== false);
  
  if (useCache && requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!.then(res => res.clone());
  }
  
  const fetchPromise = fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    // Add performance hints
    priority: method === 'GET' ? 'high' : 'auto',
  }).then(async (res) => {
    await throwIfResNotOk(res);
    return res;
  });
  
  if (useCache) {
    requestCache.set(cacheKey, fetchPromise);
    // Remove from cache after 5 minutes
    setTimeout(() => requestCache.delete(cacheKey), 5 * 60 * 1000);
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
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity for better balance
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
      retry: 1, // Retry once for better reliability
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000) // Exponential backoff
    },
    mutations: {
      retry: 1, // Retry mutations once
      retryDelay: 1000, // 1 second delay
    },
  },
});
