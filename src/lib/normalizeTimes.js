export function normalizeTimes (times) {
  return Array.from(new Set(times)).sort()
}
