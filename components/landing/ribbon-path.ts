/**
 * Centre-line of the 3D ribbon artwork (`public/landing/ink-ribbon-*.webp`),
 * traced in its 1200×552 pixel space. Drawing order follows the Arabic
 * reading direction: the loop (right), the yellow fold, then the check (left).
 *
 * `width` is the mask stroke needed to cover the ribbon at that segment
 * (measured by rendering the strokes in Chromium: 99.98% of opaque pixels);
 * `duration`/`delay` keep one continuous drawing speed across the joins
 * (segment easings end/start with matching slopes).
 */
export const RIBBON_VIEWBOX = { width: 1200, height: 552 }

export const RIBBON_SEGMENTS = [
  {
    key: 'loop',
    width: 176,
    d: 'M842 300C814 230 812 118 862 72C910 30 1020 30 1080 70C1128 110 1122 262 1082 322C1048 366 960 374 880 366',
  },
  {
    key: 'fold',
    width: 134,
    d: 'M880 366C820 330 750 250 700 180C670 135 645 100 600 85',
  },
  {
    key: 'check',
    width: 200,
    d: 'M600 85C560 78 545 90 530 110C470 190 360 340 290 425C270 450 245 462 228 445L130 200',
  },
] as const

/** One continuous path for the thin ink line in the site intro. */
export const RIBBON_PATH = RIBBON_SEGMENTS.map(({ d }, index) =>
  index === 0 ? d : d.replace(/^M[\d.]+ [\d.]+/, ''),
).join('')
