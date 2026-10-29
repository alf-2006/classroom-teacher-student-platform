import { describe, it, expect, vi, afterEach } from 'vitest'
import { SequenceLoader } from '../lib/motion/scroll-sequence'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
describe('sequence resource bounds', () => {
  it('runs at most three initial transfers and aborts them on destroy', () => {
    const requests: RequestInit[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, options: RequestInit) => {
        requests.push(options)
        return new Promise(() => {})
      }),
    )
    const loader = new SequenceLoader(false, () => {})
    loader.request(20)
    expect(requests).toHaveLength(3)
    loader.destroy()
    expect(requests.every((r) => r.signal?.aborted)).toBe(true)
  })
  it('does not retry unavailable frames forever and keeps a null fallback', async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, status: 404 }))
    vi.stubGlobal('fetch', fetchMock)
    const loader = new SequenceLoader(false, () => {})
    loader.request(20)
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(11))
    loader.request(20)
    expect(loader.closest(20)).toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(11)
    loader.destroy()
  })
  it('recovers transient failures on a later request without an endless retry loop', async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, status: 503, blob: async () => new Blob() }))
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => ({ width: 960, height: 720, close: vi.fn() })),
    )
    const loader = new SequenceLoader(false, () => {})
    loader.request(20)
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(11))
    fetchMock.mockResolvedValue({ ok: true, status: 200, blob: async () => new Blob() })
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 10000)
    loader.request(20)
    await vi.waitFor(() => expect(loader.closest(20)?.index).toBe(20))
    expect(fetchMock).toHaveBeenCalledTimes(22)
    loader.destroy()
  })
  it('closes evicted bitmaps and releases the remaining cache', async () => {
    const closed = vi.fn()
    let ready = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, blob: async () => new Blob() })),
    )
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => ({ width: 960, height: 720, close: closed })),
    )
    const loader = new SequenceLoader(false, () => {
      ready++
    })
    loader.request(20)
    await vi.waitFor(() => expect(ready).toBe(11))
    expect(loader.closest(20)?.index).toBe(20)
    loader.request(60)
    await vi.waitFor(() => expect(ready).toBe(22))
    expect(closed).toHaveBeenCalledTimes(10)
    loader.destroy()
    expect(closed).toHaveBeenCalledTimes(22)
  })
})
