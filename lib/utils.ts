export function timeAgo(epochMs: number): string {
  const seconds = Math.floor((Date.now() - epochMs) / 1000)
  const intervals: [number, string][] = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [604800, 'w'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ]
  for (const [sec, label] of intervals) {
    const qty = Math.floor(seconds / sec)
    if (qty >= 1) return `${qty}${label}`
  }
  return 'now'
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}
