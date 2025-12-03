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
    title: "Test Set 1",
    date: "2024-01-15",
    duration: 3600, // 01:00:00
    genres: ["Electronic"],
    coverUrl: "https://picsum.photos/seed/set1/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Test Set 2",
    date: "2024-02-20",
    duration: 2700, // 00:45:00
    genres: ["Ambient"],
    coverUrl: "https://picsum.photos/seed/set2/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Test Set 3",
    date: "2024-03-10",
    duration: 4500, // 01:15:00
    genres: ["Chillout"],
    coverUrl: "https://picsum.photos/seed/set3/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
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
