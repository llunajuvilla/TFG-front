"use client"

import { useState } from "react"

type Mode = "manual" | "automatic" | "return"
type Direction = "forward" | "backward" | "left" | "right" | "stop"

interface ControlPanelProps {
  onModeChange?: (mode: Mode) => void
  onDirectionCommand?: (direction: Direction) => void
  messages?: string[]
}

export function ControlPanel({ onModeChange, onDirectionCommand, messages = [] }: ControlPanelProps) {
  const [isAutomatic, setIsAutomatic] = useState(false)
  const [isReturn, setIsReturn] = useState(false)

  const handleAutomaticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsAutomatic(checked)
    if (checked) {
      setIsReturn(false)
      onModeChange?.("automatic")
    } else if (!isReturn) {
      onModeChange?.("manual")
    }
  }

  const handleReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsReturn(checked)
    if (checked) {
      setIsAutomatic(false)
      onModeChange?.("return")
    } else if (!isAutomatic) {
      onModeChange?.("manual")
    }
  }

  const handleDirection = (direction: Direction) => {
    onDirectionCommand?.(direction)
  }

  const isManualActive = !isAutomatic && !isReturn

  const defaultMessages = [
    "Cap endavant..",
    "Obstacle detectat",
    "Cap enderrere..."
  ]

  const displayMessages = messages.length > 0 ? messages : defaultMessages

  return (
    <div className="h-full rounded-xl border bg-card text-card-foreground shadow-sm bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="font-bold text-red-500 dark:text-red-400 uppercase tracking-wide text-sm leading-none tracking-tight">
          Control Robot
        </h3>
      </div>
      <div className="p-6 pt-0 space-y-4">
        {/* Directional controls - always visible */}
        <div className="flex flex-col items-center py-2">
          <div className="grid grid-cols-3 gap-1 w-fit">
            {/* Row 1: Up arrow */}
            <div />
            <button
              onClick={() => handleDirection("forward")}
              disabled={!isManualActive}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Forward"
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="20,5 35,35 20,28 5,35" fill="#d1d5db" />
              </svg>
            </button>
            <div />
            
            {/* Row 2: Left, Stop, Right */}
            <button
              onClick={() => handleDirection("left")}
              disabled={!isManualActive}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Left"
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="5,20 35,5 28,20 35,35" fill="#d1d5db" />
              </svg>
            </button>
            <button
              onClick={() => handleDirection("stop")}
              disabled={!isManualActive}
              className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-white text-xs font-bold disabled:opacity-40 disabled:hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Stop"
            >
              Stop
            </button>
            <button
              onClick={() => handleDirection("right")}
              disabled={!isManualActive}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Right"
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="35,20 5,5 12,20 5,35" fill="#d1d5db" />
              </svg>
            </button>
            
            {/* Row 3: Down arrow */}
            <div />
            <button
              onClick={() => handleDirection("backward")}
              disabled={!isManualActive}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Backward"
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="20,35 5,5 20,12 35,5" fill="#d1d5db" />
              </svg>
            </button>
            <div />
          </div>
        </div>

        {/* Mode toggles */}
        <div className="flex gap-6 justify-center">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="automatic"
              checked={isAutomatic}
              onChange={handleAutomaticChange}
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-black dark:accent-white"
            />
            <label 
              htmlFor="automatic" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Automàtic
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="return"
              checked={isReturn}
              onChange={handleReturnChange}
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-black dark:accent-white"
            />
            <label 
              htmlFor="return" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Retorn
            </label>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Informació:</p>
          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
            {displayMessages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}