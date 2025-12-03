"use client"

import { type DJSet, formatDuration, formatDate } from "@/lib/data"
import Image from "next/image"
import { Play, Pause } from "lucide-react"

interface SetCardProps {
  set: DJSet
  isActive: boolean
  isPlaying: boolean
  onClick: () => void
  onPlayPause?: () => void
}

export function SetCard({ set, isActive, isPlaying, onClick, onPlayPause }: SetCardProps) {
  return (
    <div
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-left group ${
        isActive ? "bg-primary/10 border border-primary/30" : "bg-card hover:bg-secondary border border-transparent"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (isActive && onPlayPause) {
            onPlayPause()
          } else {
            onClick()
          }
        }}
        className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 group/cover"
      >
        <Image src={set.coverUrl || "/placeholder.svg"} alt={set.title} fill className="object-cover" />
        {/* Play/Pause overlay */}
        <div
          className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
            isActive && isPlaying ? "opacity-100" : "opacity-0 group-hover/cover:opacity-100"
          }`}
        >
          {isActive && isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" />
          )}
        </div>
      </button>

      <button onClick={onClick} className="flex-1 min-w-0 text-left">
        <h3 className={`font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>{set.title}</h3>
        <p className="text-sm text-muted-foreground">
          {formatDate(set.date)} · {formatDuration(set.duration)}
        </p>
        <div className="flex gap-2 mt-1.5 flex-wrap">
          {set.genres.map((genre) => (
            <span key={genre} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {genre}
            </span>
          ))}
        </div>
      </button>
    </div>
  )
}
