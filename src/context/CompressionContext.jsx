import { createContext, useContext, useReducer, useCallback } from 'react'
import { compressImage } from '../services/compressionService'

const CompressionContext = createContext(null)

const initialState = {
  images: [],         
  quality: 0.7,       
  maxSizeMB: 1,
  preset: 'medium',   
  outputFormat: 'original',   
  customWidth: null,       
  customHeight: null,      
  lockAspectRatio: true,   
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_IMAGES':
      return { ...state, images: [...state.images, ...action.payload] }

    case 'REMOVE_IMAGE':
      const imgToRemove = state.images.find(img => img.id === action.payload)
      if (imgToRemove) {
        if (imgToRemove.originalUrl) URL.revokeObjectURL(imgToRemove.originalUrl)
        if (imgToRemove.compressedUrl) URL.revokeObjectURL(imgToRemove.compressedUrl)
      }
      return { ...state, images: state.images.filter(img => img.id !== action.payload) }

    case 'CLEAR_ALL':
      return { ...state, images: [] }

    case 'SET_QUALITY':
      return { ...state, quality: action.payload }

    case 'SET_MAX_SIZE':
      return { ...state, maxSizeMB: action.payload }

    case 'SET_PRESET':
      return { ...state, preset: action.payload, ...presetValues[action.payload] }

    case 'SET_OUTPUT_FORMAT':
      return { ...state, outputFormat: action.payload }

    case 'SET_WIDTH':
      return { ...state, customWidth: action.payload, preset: 'custom' }

    case 'SET_HEIGHT':
      return { ...state, customHeight: action.payload, preset: 'custom' }

    case 'SET_LOCK_ASPECT':
      return { ...state, lockAspectRatio: action.payload }

    case 'UPDATE_IMAGE':
      return {
        ...state,
        images: state.images.map(img =>
          img.id === action.payload.id ? { ...img, ...action.payload } : img
        )
      }

    default:
      return state
  }
}

const presetValues = {
  low:    { quality: 0.4, maxSizeMB: 0.3 },
  medium: { quality: 0.7, maxSizeMB: 1   },
  high:   { quality: 0.9, maxSizeMB: 2   },
}

export function CompressionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const addImages = useCallback((files) => {
    const newImages = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size,
      status: 'idle',     
      progress: 0,
      compressedBlob: null,
      compressedUrl: null,
      compressedSize: null,
      error: null,
    }))
    dispatch({ type: 'ADD_IMAGES', payload: newImages })
    return newImages
  }, [])

  const clearAll = useCallback(() => {
    state.images.forEach(img => {
      if (img.originalUrl) URL.revokeObjectURL(img.originalUrl)
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl)
    })
    dispatch({ type: 'CLEAR_ALL' })
  }, [state.images])

  const removeImage = useCallback((id) => dispatch({ type: 'REMOVE_IMAGE', payload: id }), [])
  const setQuality = useCallback((q) => dispatch({ type: 'SET_QUALITY', payload: q }), [])
  const setMaxSize = useCallback((s) => dispatch({ type: 'SET_MAX_SIZE', payload: s }), [])
  const setPreset  = useCallback((p) => dispatch({ type: 'SET_PRESET',  payload: p }), [])
  const setOutputFormat = useCallback((f) => dispatch({ type: 'SET_OUTPUT_FORMAT', payload: f }), [])
  const setCustomWidth = useCallback((w) => dispatch({ type: 'SET_WIDTH', payload: w }), [])
  const setCustomHeight = useCallback((h) => dispatch({ type: 'SET_HEIGHT', payload: h }), [])
  const setLockAspectRatio = useCallback((l) => dispatch({ type: 'SET_LOCK_ASPECT', payload: l }), [])

  const compressOne = useCallback(async (imageId, currentOptions = null) => {
    const img = state.images.find(i => i.id === imageId)
    if (!img) return

    dispatch({ type: 'UPDATE_IMAGE', payload: { id: imageId, status: 'compressing', progress: 0 } })

    // Build configuration fallback options explicitly prioritizing runtime context variables
    const opts = {
      quality: currentOptions && currentOptions.quality !== undefined ? currentOptions.quality : state.quality,
      maxSizeMB: currentOptions && currentOptions.maxSizeMB !== undefined ? currentOptions.maxSizeMB : state.maxSizeMB,
      outputFormat: currentOptions && currentOptions.outputFormat !== undefined ? currentOptions.outputFormat : state.outputFormat,
      customWidth: currentOptions && currentOptions.customWidth !== undefined ? currentOptions.customWidth : state.customWidth,
      customHeight: currentOptions && currentOptions.customHeight !== undefined ? currentOptions.customHeight : state.customHeight,
      lockAspectRatio: currentOptions && currentOptions.lockAspectRatio !== undefined ? currentOptions.lockAspectRatio : state.lockAspectRatio,
    }

    try {
      const result = await compressImage(img.file, {
        quality: opts.quality,
        maxSizeMB: opts.maxSizeMB,
        outputFormat: opts.outputFormat,
        customWidth: opts.customWidth,
        customHeight: opts.customHeight,
        lockAspectRatio: opts.lockAspectRatio,
        onProgress: (p) => dispatch({ type: 'UPDATE_IMAGE', payload: { id: imageId, progress: p } }),
      })

      const url = URL.createObjectURL(result.blob)
      dispatch({
        type: 'UPDATE_IMAGE',
        payload: {
          id: imageId,
          status: 'done',
          progress: 100,
          compressedBlob: result.blob,
          compressedUrl: url,
          compressedSize: result.blob.size,
        }
      })
    } catch (err) {
      dispatch({ type: 'UPDATE_IMAGE', payload: { id: imageId, status: 'error', error: err.message } })
    }
  }, [state.images, state.quality, state.maxSizeMB, state.outputFormat, state.customWidth, state.customHeight, state.lockAspectRatio])

  const compressAll = useCallback(async (imageIds) => {
    const optionsSnapshot = {
      quality: state.quality,
      maxSizeMB: state.maxSizeMB,
      outputFormat: state.outputFormat,
      customWidth: state.customWidth,
      customHeight: state.customHeight,
      lockAspectRatio: state.lockAspectRatio
    }
    for (const id of imageIds) {
      await compressOne(id, optionsSnapshot)
    }
  }, [compressOne, state.quality, state.maxSizeMB, state.outputFormat, state.customWidth, state.customHeight, state.lockAspectRatio])

  return (
    <CompressionContext.Provider value={{
      ...state,
      addImages,
      removeImage,
      clearAll,
      setQuality,
      setMaxSize,
      setPreset,
      setOutputFormat,
      setCustomWidth,
      setCustomHeight,
      setLockAspectRatio,
      compressOne,
      compressAll,
    }}>
      {children}
    </CompressionContext.Provider>
  )
}

export const useCompression = () => {
  const ctx = useContext(CompressionContext)
  if (!ctx) throw new Error('useCompression must be within CompressionProvider')
  return ctx
}
