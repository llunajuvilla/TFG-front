"use client"

import { useState } from "react"
type Mode = "manual" | "auto" | "return"
type Direction = "forward" | "backward" | "left" | "right" | "stop"

interface ControlPanelProps {
  onModeChange?: (mode: Mode) => void
  onDirectionCommand?: (direction: Direction) => void
  onResetAngle?: () => void
  onResetPosition?: () => void
  messages?: string[]
  currentMode?: "manual" | "auto"
}

export function ControlPanel({
  onModeChange,
  onDirectionCommand,
  onResetAngle,
  onResetPosition,
  messages = [],
  currentMode,
}: ControlPanelProps) {
  const [isAutomatic, setIsAutomatic] = useState(false)
  const [isReturn, setIsReturn] = useState(false)

  // Si el robot confirma el mode externament, sincronitza els checkboxes
  const effectiveAuto = currentMode !== undefined ? currentMode === "auto" : isAutomatic
  const effectiveReturn = currentMode !== undefined ? false : isReturn

  const handleAutomaticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsAutomatic(checked)
    if (checked) {
      setIsReturn(false)
      onModeChange?.("auto")
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

  const isManualActive = !effectiveAuto && !effectiveReturn

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

        {/* Directional controls */}
        <div className="flex flex-col items-center py-2">
          <div className="grid grid-cols-3 gap-1 w-fit">
            {/* Row 1: Up */}
            <div />
            <button
              onMouseDown={() => handleDirection("forward")}
              onMouseUp={() => handleDirection("stop")}
              onMouseLeave={() => handleDirection("stop")}
              onTouchStart={() => handleDirection("forward")}
              onTouchEnd={() => handleDirection("stop")}
              disabled={!isManualActive}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none touch-none"
              aria-label="Forward"
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="20,5 35,35 20,28 5,35" fill="#d1d5db" />
              </svg>
            </button>
            <div />

            {/* Row 2: Left, Stop, Right */}
            <button
              onMouseDown={() => handleDirection("left")}
              onMouseUp={() => handleDirection("stop")}
              onMouseLeave={() => handleDirection("stop")}
              onTouchStart={() => handleDirection("left")}
              onTouchEnd={() => handleDirection("stop")}
              disabled={!isManualActive}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none touch-none"
              aria-label="Left"
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="5,20 35,5 28,20 35,35" fill="#d1d5db" />
              </svg>
            </button>
            <button
              onClick={() => handleDirection("stop")}
              disabled={!isManualActive}
              className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-white text-xs font-bold disabled:opacity-40 disabled:hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none touch-none"
              aria-label="Stop"
            >
              Stop
            </button>
            <button
              onMouseDown={() => handleDirection("right")}
              onMouseUp={() => handleDirection("stop")}
              onMouseLeave={() => handleDirection("stop")}
              onTouchStart={() => handleDirection("right")}
              onTouchEnd={() => handleDirection("stop")}
              disabled={!isManualActive}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none touch-none"
              aria-label="Right"
            >
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="35,20 5,5 12,20 5,35" fill="#d1d5db" />
              </svg>
            </button>

            {/* Row 3: Down */}
            <div />
            <button
              onMouseDown={() => handleDirection("backward")}
              onMouseUp={() => handleDirection("stop")}
              onMouseLeave={() => handleDirection("stop")}
              onTouchStart={() => handleDirection("backward")}
              onTouchEnd={() => handleDirection("stop")}
              disabled={!isManualActive}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none touch-none"
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
              checked={effectiveAuto}
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
              checked={effectiveReturn}
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

        {/* Log de missatges */}
        <div>
          <p className="text-sm font-medium mb-2">Informació:</p>
          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
            {displayMessages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </div>

        {/* Botons de reset — apareixen només si es passen les props */}
        {(onResetAngle || onResetPosition) && (
          <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
            {onResetAngle && (
              <button
                onClick={onResetAngle}
                className="flex-1 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Reset angles
              </button>
            )}
            {onResetPosition && (
              <button
                onClick={onResetPosition}
                className="flex-1 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Reset posició
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}