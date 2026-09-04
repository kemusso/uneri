/**
 * Astro accepts `style` as a string or as an object of CSS properties. Parts that build their own
 * inline custom properties have to merge the user's value in, so both shapes must survive.
 */
export type StyleInput = string | Record<string, string | number | null | undefined | false> | null | undefined;

export function styleToString(style: StyleInput): string {
  if (!style) return '';
  if (typeof style === 'string') return style;
  return Object.entries(style)
    .filter(([, v]) => v !== null && v !== undefined && v !== false && v !== '')
    .map(([k, v]) => `${k.startsWith('--') ? k : k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${v}`)
    .join(';');
}

/** Joins inline style fragments, dropping the empty ones. */
export function joinStyles(...parts: (string | false | null | undefined)[]): string | undefined {
  const out = parts.filter(Boolean).join(';');
  return out || undefined;
}
