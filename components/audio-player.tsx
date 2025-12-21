"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { type DJSet, formatDuration, formatDate } from "@/lib/data"
import Image from "next/image"
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Download, X } from "lucide-react"

interface AudioPlayerProps {
  set: DJSet | null
  onClose?: () => void
  isMobile?: boolean
  onPlayStateChange?: (isPlaying: boolean) => void
}

function getProxiedAudioUrl(url: string): string {
  // If it's already a local URL or blob, use it directly
  if (url.startsWith("/") || url.startsWith("blob:")) {
    return url
  }
  // Proxy external URLs through our API route
  return `/api/audio?url=${encodeURIComponent(url)}`
}

export function AudioPlayer({ set, onClose, isMobile = false, onPlayStateChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    onPlayStateChange?.(isPlaying)
  }, [isPlaying, onPlayStateChange])

  useEffect(() => {
    const handleTogglePlay = () => {
      if (audioRef.current && isReady) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play()
        }
      }
    }

    window.addEventListener("togglePlay", handleTogglePlay)
    return () => window.removeEventListener("togglePlay", handleTogglePlay)
  }, [isReady, isPlaying])

  // Native audio element setup (instant playback)
  useEffect(() => {
    if (!audioRef.current || !set) return

    const audio = audioRef.current
    const audioUrl = getProxiedAudioUrl(set.audioUrl)

    setIsReady(false)
    setIsPlaying(false)
    setCurrentTime(0)

    audio.src = audioUrl
    audio.volume = isMuted ? 0 : volume
    audio.load()

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsReady(true)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      audio.pause()
      audio.src = ""
    }
  }, [set])

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = useCallback(() => {
    if (audioRef.current && isReady) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }, [isReady, isPlaying])

  const skip = useCallback(
    (seconds: number) => {
      if (audioRef.current && isReady) {
        const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
        audioRef.current.currentTime = newTime
      }
    },
    [isReady, currentTime, duration],
  )

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
  }, [isMuted])

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !progressBarRef.current || !isReady) return

      const rect = progressBarRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      const newTime = percentage * duration

      audioRef.current.currentTime = newTime
    },
    [duration, isReady],
  )

  const handleDownload = useCallback(() => {
    if (set) {
      const link = document.createElement("a")
      link.href = getProxiedAudioUrl(set.audioUrl)
      link.download = `${set.title}.mp3`
      link.click()
    }
  }, [set])

  if (!set) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-card flex items-center justify-center">
            <Volume2 className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <p>Wähle ein Set aus der Liste</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col bg-background overflow-hidden ${isMobile ? "h-full" : "flex-1 h-full"}`}>
      {/* Hidden native audio element for instant playback */}
      <audio ref={audioRef} preload="metadata" />

      {/* Mobile Header */}
      {isMobile && onClose && (
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">Now Playing</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={`flex-1 min-h-0 flex flex-col items-center justify-center p-4 gap-3 ${isMobile ? "" : "lg:p-6"}`}>
        {/* Cover Artwork */}
        <div className="flex-shrink relative w-full max-w-[min(50vh,20rem)] aspect-square rounded-xl overflow-hidden shadow-2xl mb-6">
          <Image src={set.coverUrl || "/placeholder.svg"} alt={set.title} fill className="object-cover" priority />
          {!isReady && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Title & Date */}
        <div className="flex-shrink-0 text-center mb-6">
          <h1 className="text-xl font-bold text-foreground mb-1 text-balance">{set.title}</h1>
          <p className="text-muted-foreground">{formatDate(set.date)}</p>
          <div className="flex gap-2 mt-2 justify-center flex-wrap">
            {set.genres.map((genre) => (
              <span key={genre} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-shrink-0 w-full max-w-lg mb-4">
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="relative h-2 bg-secondary rounded-full cursor-pointer group hover:h-3 transition-all"
          >
            {/* Progress */}
            <div
              className="absolute h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            {/* Hover indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/50"
              style={{
                left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        </div>

        {/* Time Display */}
        <div className="flex-shrink-0 flex justify-between w-full max-w-lg text-sm text-muted-foreground mb-6 font-mono">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration || set.duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex-shrink-0 flex items-center gap-4 mb-6">
          <button
            onClick={() => skip(-15)}
            className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            disabled={!isReady}
            aria-label="15 Sekunden zurück"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="p-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            disabled={!isReady}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <button
            onClick={() => skip(15)}
            className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            disabled={!isReady}
            aria-label="15 Sekunden vor"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Volume & Download */}
        <div className="flex-shrink-0 flex items-center gap-4 w-full max-w-lg">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label={isMuted ? "Ton an" : "Ton aus"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number.parseFloat(e.target.value))
              if (isMuted) setIsMuted(false)
            }}
            className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            aria-label="Lautstärke"
          />

          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-secondary transition-colors ml-auto"
            aria-label="Download"
          >
            <Download className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
