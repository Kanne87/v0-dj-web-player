import { type NextRequest, NextResponse } from "next/server"

interface RawSet {
  id: string
  title: string
  date: string
  duration: string // "HH:MM:SS" format
  genre: string[]
  cover: string
  audio: string
  peaks?: number[][] // Optional pre-computed waveform peaks
}

interface RawSetsResponse {
  sets: RawSet[]
}

export interface DJSet {
  id: string
  title: string
  date: string
  duration: number // in seconds
  genres: string[]
  coverUrl: string
  audioUrl: string
  peaks?: number[][] // Optional pre-computed waveform peaks for instant loading
}

function parseDuration(duration: string): number {
  const parts = duration.split(":")
  const hours = Number.parseInt(parts[0] || "0", 10)
  const minutes = Number.parseInt(parts[1] || "0", 10)
  const seconds = Number.parseInt(parts[2] || "0", 10)
  return hours * 3600 + minutes * 60 + seconds
}

function transformSet(rawSet: RawSet): DJSet {
  return {
    id: rawSet.id,
    title: rawSet.title,
    date: rawSet.date,
    duration: parseDuration(rawSet.duration),
    genres: rawSet.genre,
    coverUrl: rawSet.cover,
    audioUrl: rawSet.audio,
    peaks: rawSet.peaks, // Pass through peaks if available
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch("https://kailohmann.de/music/sets.json", {
      // Revalidate every 60 seconds
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch sets" }, { status: response.status })
    }

    const data: RawSetsResponse = await response.json()
    const transformedSets = data.sets.map(transformSet)

    return NextResponse.json(transformedSets, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    })
  } catch (error) {
    console.error("Sets fetch error:", error)
    return NextResponse.json({ error: "Failed to load sets" }, { status: 500 })
  }
}
