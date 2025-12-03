"use client"

import type { DJSet } from "@/lib/data"
import Image from "next/image"
import { Play, Pause } from "lucide-react"

interface MiniPlayerProps {
  set: DJSet
  isPlaying: boolean
  onTogglePlay: () => void
  onClick: () => void
}

export function MiniPlayer({ set, isPlaying, onTogglePlay, onClick }: MiniPlayerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex items-center gap-3 z-50 lg:hidden">
      <button onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={set.coverUrl || "/placeholder.svg"} alt={set.title} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h3 className="font-medium text-sm truncate text-foreground">{set.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{set.genres.join(" · ")}</p>
        </div>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onTogglePlay()
        }}
        className="p-3 rounded-full bg-primary text-primary-foreground flex-shrink-0"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>
    </div>
  )
}
