"use client"

import type { DJSet } from "@/lib/data"
import { SetCard } from "./set-card"
import { Disc3 } from "lucide-react"

interface SetlistProps {
  sets: DJSet[]
  activeSetId: string | null
  isPlaying: boolean
  onSelectSet: (set: DJSet) => void
}

export function Setlist({ sets, activeSetId, isPlaying, onSelectSet }: SetlistProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Disc3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">DJ Sets</h1>
            <p className="text-sm text-muted-foreground">{sets.length} Sets verfügbar</p>
          </div>
        </div>
      </div>

      {/* Set List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {sets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              isActive={set.id === activeSetId}
              isPlaying={set.id === activeSetId && isPlaying}
              onClick={() => onSelectSet(set)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
