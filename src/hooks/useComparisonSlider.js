import { useState, useRef, useCallback, useEffect } from 'react'

export function useComparisonSlider() {
  const [position, setPosition] = useState(50) // 0-100
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    updatePosition(e.clientX)
  }, [updatePosition])

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true)
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => updatePosition(e.clientX)
    const handleTouchMove = (e) => {
      e.preventDefault()
      updatePosition(e.touches[0].clientX)
    }
    const handleUp = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [isDragging, updatePosition])

  return {
    position,
    isDragging,
    containerRef,
    handleMouseDown,
    handleTouchStart,
  }
}
