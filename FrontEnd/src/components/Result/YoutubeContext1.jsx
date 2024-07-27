// YouTubeContext.js
import React, { createContext, useContext, useRef } from 'react'

const YouTubeContext = createContext()

export const YouTubeProvider = ({ children }) => {
  const playerRef = useRef(null) // 비디오 플레이어 참조 저장

  return (
    <YouTubeContext.Provider value={{ playerRef }}>
      {children}
    </YouTubeContext.Provider>
  )
}

export const useYouTube = () => useContext(YouTubeContext)
