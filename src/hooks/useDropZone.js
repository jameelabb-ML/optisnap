import { useState, useCallback, useRef } from 'react'

// EXTENDED ALLOWED SCHEMAS: Added vector type markers natively to support SVG files
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']

export function useDropZone(onFiles) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const dragCounter = useRef(0)

  const validateFiles = (fileList) => {
    const files = Array.from(fileList)
    
    // Validates files against either their MIME type or their explicit trailing file extensions
    const valid = files.filter(f => ACCEPTED.includes(f.type) || f.name.toLowerCase().endsWith('.svg'))
    const invalid = files.length - valid.length

    if (invalid > 0) {
      // UPDATED LABEL WRITING: Included SVG in your error helper string string
      setError(`${invalid} file(s) skipped — only PNG, JPG, JPEG, WEBP, SVG supported`)
      setTimeout(() => setError(null), 4000)
    }
    return valid
  }

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items?.length > 0) setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const files = validateFiles(e.dataTransfer.files)
    if (files.length > 0) onFiles(files)
  }, [onFiles])

  const handleFileInput = useCallback((e) => {
    const files = validateFiles(e.target.files)
    if (files.length > 0) onFiles(files)
    e.target.value = ''
  }, [onFiles])

  return {
    isDragging,
    error,
    handlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
    handleFileInput,
  }
}
