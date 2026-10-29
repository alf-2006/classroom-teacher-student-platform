export const SEQUENCE = {
  width: 960,
  height: 720,
  frames: 96,
  mobileFrames: 48,
  path: '/scroll-sequence/v1',
} as const

export function clampProgress(value: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0))
}

export function frameAt(progress: number, count: number): number {
  return Math.round(clampProgress(progress) * Math.max(0, count - 1))
}

export function sectionProgress(top: number, height: number, viewport: number, pinned: boolean) {
  return pinned
    ? clampProgress(-top / Math.max(1, height - viewport))
    : clampProgress((viewport - top) / Math.max(1, viewport + height))
}

export function chapterAt(progress: number): number {
  return Math.min(3, Math.floor(clampProgress(progress) * 4))
}

export function frameUrl(index: number, mobile = false): string {
  return `${SEQUENCE.path}${mobile ? '/mobile' : ''}/frame-${String(index).padStart(3, '0')}.webp`
}

type FrameImage = ImageBitmap | HTMLImageElement

/** Demand-driven loading: three transfers, twelve decoded frames, no full-sequence decode. */
export class SequenceLoader {
  private readonly cache = new Map<number, FrameImage>()
  private readonly pending = new Set<number>()
  private readonly failed = new Map<
    number,
    { attempts: number; retryAt: number; permanent: boolean }
  >()
  private readonly controller = new AbortController()
  private queue: number[] = []
  private disposed = false
  private active = 0

  constructor(
    private readonly mobile: boolean,
    private readonly onReady: () => void,
  ) {}

  request(index: number) {
    if (this.disposed) return
    const total = this.mobile ? SEQUENCE.mobileFrames : SEQUENCE.frames
    const nearby = [index]
    for (let delta = 1; delta <= 5; delta++) nearby.push(index + delta, index - delta)
    this.queue = nearby.filter((i) => {
      const failure = this.failed.get(i)
      const mayRetry =
        !failure || (!failure.permanent && failure.attempts < 2 && Date.now() >= failure.retryAt)
      return i >= 0 && i < total && !this.cache.has(i) && !this.pending.has(i) && mayRetry
    })
    this.pump()
  }

  closest(index: number): { image: FrameImage; index: number } | null {
    let best = -1
    for (const i of this.cache.keys()) {
      if (best === -1 || Math.abs(i - index) < Math.abs(best - index)) best = i
    }
    if (best < 0) return null
    const image = this.cache.get(best)!
    this.cache.delete(best)
    this.cache.set(best, image)
    return { image, index: best }
  }

  private pump() {
    while (!this.disposed && this.active < 3 && this.queue.length) {
      const index = this.queue.shift()!
      if (this.pending.has(index) || this.cache.has(index)) continue
      this.pending.add(index)
      this.active++
      void this.load(index).finally(() => {
        this.pending.delete(index)
        this.active--
        this.pump()
      })
    }
  }

  private async load(index: number) {
    let permanent = false
    try {
      const response = await fetch(frameUrl(index, this.mobile), { signal: this.controller.signal })
      if (!response.ok) {
        permanent = response.status === 404 || response.status === 403
        throw new Error('Frame unavailable')
      }
      const blob = await response.blob()
      const image = await this.decode(blob)
      if (this.disposed) {
        if ('close' in image) image.close()
        return
      }
      this.cache.set(index, image)
      this.failed.delete(index)
      while (this.cache.size > (this.mobile ? 6 : 12)) {
        const oldest = this.cache.keys().next().value!
        const removed = this.cache.get(oldest)!
        this.cache.delete(oldest)
        if ('close' in removed) removed.close()
      }
      this.onReady()
    } catch {
      if (!this.disposed)
        this.failed.set(index, {
          attempts: (this.failed.get(index)?.attempts ?? 0) + 1,
          retryAt: Date.now() + 1000,
          permanent,
        })
    }
  }

  private async decode(blob: Blob): Promise<FrameImage> {
    if (typeof createImageBitmap === 'function') {
      try {
        return await createImageBitmap(blob)
      } catch {
        /* Safari/format fallback below. */
      }
    }
    const url = URL.createObjectURL(blob)
    try {
      const image = new Image()
      image.src = url
      await image.decode()
      return image
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  destroy() {
    this.disposed = true
    this.controller.abort()
    this.queue = []
    this.cache.forEach((image) => {
      if ('close' in image) image.close()
    })
    this.cache.clear()
  }
}
