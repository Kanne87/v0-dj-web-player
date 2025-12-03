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
    title: "Midnight Warehouse Session",
    date: "2024-11-15",
    duration: 5400, // 90 min
    genres: ["Techno", "Dark Techno"],
    coverUrl: "/dark-techno-warehouse-abstract-art.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Summer Rooftop Vibes",
    date: "2024-10-28",
    duration: 7200, // 120 min
    genres: ["House", "Deep House"],
    coverUrl: "/summer-sunset-rooftop-party-abstract.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Underground Berlin Mix",
    date: "2024-09-20",
    duration: 4500, // 75 min
    genres: ["Minimal", "Tech House"],
    coverUrl: "/berlin-underground-club-neon-lights-abstract.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "4",
    title: "Peak Time Energy",
    date: "2024-08-10",
    duration: 3600, // 60 min
    genres: ["Hard Techno", "Industrial"],
    coverUrl: "/industrial-rave-strobe-lights-abstract.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "5",
    title: "Afterhours Downtempo",
    date: "2024-07-05",
    duration: 6300, // 105 min
    genres: ["Ambient", "Downtempo"],
    coverUrl: "/ambient-chill-sunrise-abstract-waves.jpg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
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
