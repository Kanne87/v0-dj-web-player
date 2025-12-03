"use client"

import { useState, useRef, useCallback } from "react"
import { djSets, type DJSet } from "@/lib/data"
import { Setlist } from "@/components/setlist"
import { AudioPlayer } from "@/components/audio-player"
import { MiniPlayer } from "@/components/mini-player"

export default function Home() {
  const [activeSet, setActiveSet] = useState<DJSet | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const wavesurferRef = useRef<{ playPause: () => void } | null>(null)

  const handleSelectSet = useCallback((set: DJSet) => {
    setActiveSet(set)
    setShowPlayer(true)
    setIsPlaying(false)
  }, [])

  const handleTogglePlay = useCallback(() => {
    // This will be handled by the AudioPlayer component internally
    // For the mini player, we'll use a global event or state management
    const event = new CustomEvent("togglePlay")
    window.dispatchEvent(event)
  }, [])

  const handleClosePlayer = useCallback(() => {
    setShowPlayer(false)
  }, [])

  return (
    <main className="h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Desktop: Sidebar */}
      <aside className="hidden lg:flex lg:w-[300px] lg:flex-shrink-0 border-r border-border">
        <Setlist
          sets={djSets}
          activeSetId={activeSet?.id || null}
          isPlaying={isPlaying}
          onSelectSet={handleSelectSet}
        />
      </aside>

      {/* Desktop: Player */}
      <div className="hidden lg:flex lg:flex-1">
        <AudioPlayer set={activeSet} />
      </div>

      {/* Mobile: Conditional Views */}
      <div className="flex flex-col flex-1 lg:hidden">
        {showPlayer && activeSet ? (
          <AudioPlayer set={activeSet} onClose={handleClosePlayer} isMobile />
        ) : (
          <>
            <Setlist
              sets={djSets}
              activeSetId={activeSet?.id || null}
              isPlaying={isPlaying}
              onSelectSet={handleSelectSet}
            />
            {activeSet && (
              <div className="h-20" /> // Spacer for mini player
            )}
          </>
        )}
      </div>

      {/* Mobile: Mini Player (when not in fullscreen player view) */}
      {activeSet && !showPlayer && (
        <MiniPlayer
          set={activeSet}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onClick={() => setShowPlayer(true)}
        />
      )}
    </main>
  )
}
