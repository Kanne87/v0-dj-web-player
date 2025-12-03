export interface DJSet {
  id: string
  title: string
  date: string
  duration: number // in seconds
  genres: string[]
  coverUrl: string
  audioUrl: string
}

export const djSets: DJSet[] = [
  {
    id: "1",
    title: "Rise Festival 2024",
    date: "2025-11-23",
    duration: 5565, // 01:32:45
    genres: ["Drum & Bass"],
    coverUrl: "https://kailohmann.de/music/cover1.jpg",
    audioUrl: "https://kailohmann.de/music/2025-11-23 Cellschock Testmaterial.mp3",
  },
]

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}
