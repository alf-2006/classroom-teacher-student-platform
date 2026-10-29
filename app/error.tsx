'use client'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main
      id="main-content"
      className="grid min-h-screen place-items-center bg-background px-5 py-12"
    >
      <section className="surface-card max-w-lg p-7 text-center">
        <p className="eyebrow">البيانات مش راضية تتحمّل</p>
        <h1 className="mt-2 text-2xl font-black">في حاجة عطّلت الصفحة</h1>
        <p aria-live="polite" className="mt-3 text-sm leading-7 text-muted">
          مش هنوريك بيانات مش حقيقية. جرّب تاني، ولو المشكلة فضلت موجودة، راجع اتصال Supabase
          وصلاحيات حسابك.
        </p>
        <button
          className="mt-6 min-h-11 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-black text-white hover:bg-primary-700"
          onClick={() => reset()}
          type="button"
        >
          جرّب تاني
        </button>
      </section>
    </main>
  )
}
