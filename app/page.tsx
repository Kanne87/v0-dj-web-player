"use client"

import { useState, useCallback } from "react"
import { djSets, type DJSet } from "@/lib/data"
import { Setlist } from "@/components/setlist"
import { AudioPlayer } from "@/components/audio-player"
import { MiniPlayer } from "@/components/mini-player"

export default function Home() {
  const [activeSet, setActiveSet] = useState<DJSet | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)

  const handleSelectSet = useCallback((set: DJSet) => {
    setActiveSet(set)
    setShowPlayer(true)
    setIsPlaying(false)
  }, [])

  const handleTogglePlay = useCallback(() => {
    const event = new CustomEvent("togglePlay")
    window.dispatchEvent(event)
  }, [])

  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing)
  }, [])

  const handleClosePlayer = useCallback(() => {
    setShowPlayer(false)
  }, [])

  return (
    <main className="h-screen min-h-0 flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Desktop: Sidebar */}
      <aside className="hidden lg:flex lg:w-[300px] lg:flex-shrink-0 lg:min-h-0 border-r border-border">
        <Setlist
          sets={djSets}
          activeSetId={activeSet?.id || null}
          isPlaying={isPlaying}
          onSelectSet={handleSelectSet}
          onPlayPause={handleTogglePlay}
        />
      </aside>

      {/* Desktop: Player */}
      <div className="hidden lg:flex lg:flex-1 lg:min-h-0">
        <AudioPlayer set={activeSet} onPlayStateChange={handlePlayStateChange} />
      </div>

      {/* Mobile: Conditional Views */}
      <div className="flex flex-col flex-1 min-h-0 lg:hidden">
        {showPlayer && activeSet ? (
          <AudioPlayer set={activeSet} onClose={handleClosePlayer} isMobile onPlayStateChange={handlePlayStateChange} />
        ) : (
          <>
            <Setlist
              sets={djSets}
              activeSetId={activeSet?.id || null}
              isPlaying={isPlaying}
              onSelectSet={handleSelectSet}
              onPlayPause={handleTogglePlay}
            />
            {activeSet && <div className="h-20 flex-shrink-0" />}
          </>
        )}
      </div>

      {/* Mobile: Mini Player */}
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
