"use client"

import { useState, useCallback, useEffect } from "react"
import { type DJSet } from "@/lib/data"
import { Setlist } from "@/components/setlist"
import { AudioPlayer } from "@/components/audio-player"
import { MiniPlayer } from "@/components/mini-player"

export default function Home() {
  const [sets, setSets] = useState<DJSet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSet, setActiveSet] = useState<DJSet | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await fetch("/api/sets")
        if (response.ok) {
          const data = await response.json()
          setSets(data)
        }
      } catch (error) {
        console.error("Failed to load sets:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSets()
  }, [])

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

  if (isLoading) {
    return (
      <main className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Lade Sets...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen min-h-0 flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Desktop: Sidebar */}
      <aside className="hidden lg:flex lg:w-[300px] lg:flex-shrink-0 lg:min-h-0 border-r border-border">
        <Setlist
          sets={sets}
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
              sets={sets}
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
