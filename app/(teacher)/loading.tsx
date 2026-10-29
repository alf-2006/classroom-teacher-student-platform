export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-5 py-16"
    >
      <span className="sr-only">بنجهّز الصفحة…</span>
      <div className="w-full max-w-xl animate-pulse space-y-4" aria-hidden="true">
        <div className="h-5 w-32 rounded bg-surface-subtle" />
        <div className="h-12 w-2/3 rounded bg-surface-subtle" />
        <div className="h-24 w-full rounded-2xl bg-surface-subtle" />
      </div>
    </div>
  )
}
