// components/SlideshowBanner.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause } from 'lucide-react'

/**
 * Props:
 * - slides: Array<{ image: string; title?: string }>
 * - interval: number (ms) between auto-slides; default 5000
 */
export default function SlideshowBanner({ slides, interval = 5000 }) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const length = slides.length
  const sliderRef = useRef(null)

  // Advance on a timer when playing
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length)
    }, interval)
    return () => clearInterval(timer)
  }, [playing, interval, length])

  const goTo = useCallback((idx) => {
    setCurrent(idx % length)
  }, [length])

  const togglePlay = () => setPlaying((p) => !p)

  if (!Array.isArray(slides) || length === 0) return null

  return (
    <div ref={sliderRef} className="relative w-full overflow-hidden rounded-xl">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map(({ image, title }, idx) => (
          <div key={idx} className="min-w-full h-64 md:h-96 flex-shrink-0">
            <img
              src={image}
              alt={title || `slide-${idx}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Play/Pause + Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
        <button
          onClick={togglePlay}
          className="p-2 bg-white bg-opacity-60 hover:bg-opacity-80 rounded-full focus:outline-none"
        >
          {playing ? (
            <Pause className="w-5 h-5 text-calm-blue" />
          ) : (
            <Play className="w-5 h-5 text-calm-blue" />
          )}
        </button>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full focus:outline-none ${
              idx === current
                ? 'bg-calm-blue'
                : 'border-2 border-calm-blue'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
