"use client"

import { useRef, useEffect } from "react"

interface RobotMapProps {
  position?: { x: number; y: number }   // metres (de la odometria del robot)
  yawDeg?:   number                      // ° (yaw_kalman del robot)
  encoders?: { left: number; right: number }
  ambient?:  { temperature: number; humidity: number }   // DHT11
}

const MAP_SIZE_M  = 3.0   // metres que representa cada meitat del mapa
const TRAIL_MAX   = 200   // màxim de punts del rastre

export function RobotMap({
  position = { x: 0, y: 0 },
  yawDeg   = 0,
  encoders,
  ambient,
}: RobotMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailRef  = useRef<Array<{ x: number; y: number }>>([])

  // Acumula el rastre
  useEffect(() => {
    trailRef.current.push({ ...position })
    if (trailRef.current.length > TRAIL_MAX) {
      trailRef.current.shift()
    }
  }, [position])

  // Dibuixa cada vegada que canvia la posició o el yaw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext("2d")
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2

    // Metres → píxels
    const scale = (W / 2) / MAP_SIZE_M

    const toCanvas = (mx: number, my: number) => ({
      px: cx + mx * scale,
      py: cy - my * scale,  // y invertit (pantalla cap avall)
    })

    // ── Fons ──
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = "#f9fafb"
    ctx.fillRect(0, 0, W, H)

    // ── Graella ──
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth   = 1
    const step = scale * 0.5  // línia cada 0,5 m
    for (let x = cx % step; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = cy % step; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // ── Eixos ──
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth   = 1.5
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke()

    // ── Etiquetes de distància ──
    ctx.fillStyle  = "#9ca3af"
    ctx.font       = "9px monospace"
    ctx.textAlign  = "center"
    for (let m = 0.5; m < MAP_SIZE_M; m += 0.5) {
      const { px } = toCanvas(m, 0)
      ctx.fillText(`${m}m`, px, cy + 10)
    }

    // ── Rastre ──
    const trail = trailRef.current
    if (trail.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = "#93c5fd"
      ctx.lineWidth   = 1.5
      ctx.setLineDash([3, 3])
      const start = toCanvas(trail[0].x, trail[0].y)
      ctx.moveTo(start.px, start.py)
      for (let i = 1; i < trail.length; i++) {
        const p = toCanvas(trail[i].x, trail[i].y)
        ctx.lineTo(p.px, p.py)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }

    // ── Robot ──
    const { px, py } = toCanvas(position.x, position.y)
    const yawRad     = (yawDeg * Math.PI) / 180

    ctx.save()
    ctx.translate(px, py)
    ctx.rotate(-yawRad)  // CSS: y-axis invertit

    // Cos del robot
    ctx.fillStyle   = "#1e293b"
    ctx.strokeStyle = "#475569"
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.roundRect(-8, -12, 16, 24, 3)
    ctx.fill()
    ctx.stroke()

    // Fletxa de direcció (frontal)
    ctx.fillStyle = "#f59e0b"
    ctx.beginPath()
    ctx.moveTo(0, -16)
    ctx.lineTo(-5, -10)
    ctx.lineTo(5, -10)
    ctx.closePath()
    ctx.fill()

    ctx.restore()

    // ── Coordenades actuals ──
    ctx.fillStyle = "#6b7280"
    ctx.font      = "10px monospace"
    ctx.textAlign = "left"
    ctx.fillText(`x: ${position.x.toFixed(2)} m`, 6, H - 22)
    ctx.fillText(`y: ${position.y.toFixed(2)} m`, 6, H - 10)

  }, [position, yawDeg])

  return (
    <div className="h-full rounded-xl border bg-white dark:bg-gray-950 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wide">
            Mapa Odometria
          </h3>
          {encoders && (
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
              L: {encoders.left} | R: {encoders.right}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 pt-0 flex justify-center">
        <canvas
          ref={canvasRef}
          width={280}
          height={220}
          className="rounded-lg border border-gray-100 dark:border-gray-800"
        />
        {ambient && (
          <div className="flex flex-col gap-1 text-xs font-mono">
            <span className="text-gray-600 dark:text-gray-300">
              Temperatura: <span className="font-bold">{ambient.temperature.toFixed(1)} °C</span>
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              Humitat: <span className="font-bold">{ambient.humidity.toFixed(0)} %</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
