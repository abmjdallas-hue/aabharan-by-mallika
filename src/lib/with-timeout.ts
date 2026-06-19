export const TIMEOUT_MESSAGE = 'Request timed out. Please check your connection and try again.'

/**
 * Race a promise against a timeout so a hung network call rejects instead of
 * leaving the UI spinning forever. Resolves/rejects with the original promise
 * if it settles first; otherwise rejects with a timeout Error after `ms`.
 */
export function withTimeout<T>(p: PromiseLike<T>, ms = 20000): Promise<T> {
  return Promise.race([
    p as Promise<T>,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(TIMEOUT_MESSAGE)), ms),
    ),
  ])
}
