/**
 * Clamp a number between min and max.
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

/**
 * Generate a compressed filename from the original.
 */
export function compressedFilename(originalName) {
  const dotIdx = originalName.lastIndexOf('.')
  if (dotIdx === -1) return `${originalName}_compressed`
  const name = originalName.slice(0, dotIdx)
  const ext  = originalName.slice(dotIdx)
  return `${name}_compressed${ext}`
}

/**
 * Debounce a function.
 */
export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
