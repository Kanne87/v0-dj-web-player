"use client"

import { type DJSet, formatDuration, formatDate } from "@/lib/data"
import Image from "next/image"

interface SetCardProps {
  set: DJSet
  isActive: boolean
  isPlaying: boolean
  onClick: () => void
}

export function SetCard({ set, isActive, isPlaying, onClick }: SetCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-left group ${
        isActive ? "bg-primary/10 border border-primary/30" : "bg-card hover:bg-secondary border border-transparent"
      }`}
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <Image src={set.coverUrl || "/placeholder.svg"} alt={set.title} fill className="object-cover" />
        {isActive && isPlaying && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex gap-0.5">
              <span className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              <span className="w-1 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "450ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
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
      </div>
    </button>
  )
}
