export function safeReturnPath(value: string | undefined): string {
  if (!value) return '/'
  // Only invitation destinations are accepted; no protocols, query strings or encoded slashes.
  return /^\/invite\/[A-Za-z0-9_-]{8,256}$/.test(value) ? value : '/'
}
