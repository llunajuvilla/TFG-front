"use client"

import { useState, useEffect, useRef } from "react"
import { useRobotWebSocket } from "@/hooks/useRobotWebSocket"

import { ControlPanel }      from "@/components/control-panel"
import { Robot3DView }       from "@/components/robot-3d-view"
import { MPUSensor }         from "@/components/mpu-sensor"
import { RobotMap }          from "@/components/robot-map"
import { KalmanFilterChart } from "@/components/kalman-filter-chart"

// ── Tipus per al gràfic de Kalman ──
interface KalmanSample {
  time:         number;  // s
  pitch_acc:    number;  // °  (acelerómetro, referencia)
  pitch_raw:    number;  // ° (integración bruta del giroscopio)
  pitch_kalman: number;  // ° (filtro de Kalman)
  yaw_raw:      number;  // °
  yaw_kalman:   number;  // °
}

const MAX_CHART_SAMPLES = 200  // últims 200 punts (~20 s a 10 Hz)

export default function RobotDashboard() {
  const [isMounted, setIsMounted] = useState(false)
  // El mode es sincronitza des del ESP32 via JSON; inicialment "manual"
  const [mode, setMode]           = useState<"manual" | "auto">("manual")
  const [messages, setMessages]   = useState(["Esperant connexió…"])
  const [chartData, setChartData] = useState<KalmanSample[]>([])
  const chartTimeRef              = useRef<number | null>(null)  // timestamp del primer frame (ms)

  const ESP32_IP = "192.168.137.224"  // <-- CANVIA A LA TEVA IP LOCAL DEL ESP32
  const { isConnected, sensorData, robotMode, sendCommand } = useRobotWebSocket(ESP32_IP)

  // Sincronitza el mode local amb l'estat que confirma el robot
  useEffect(() => {
    setMode(robotMode)
  }, [robotMode])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Acumula mostres per al gràfic cada vegada que arriba un frame nou
  useEffect(() => {
    if (!sensorData) return
    // Usem el timestamp real del robot (ms) per calcular el temps relatiu en segons
    if (chartTimeRef.current === null) chartTimeRef.current = sensorData.timestamp
    const tSec = parseFloat(((sensorData.timestamp - chartTimeRef.current) / 1000).toFixed(2))
    const sample: KalmanSample = {
      time:         tSec,
      pitch_acc:    parseFloat(sensorData.pitch.acc.toFixed(2)),
      pitch_raw:    parseFloat(sensorData.pitch.gyro.toFixed(2)),
      pitch_kalman: parseFloat(sensorData.pitch.kalman.toFixed(2)),
      yaw_raw:      parseFloat(sensorData.yaw.gyro.toFixed(2)),
      yaw_kalman:   parseFloat(sensorData.yaw.kalman.toFixed(2)),
    }
    setChartData(prev => [...prev.slice(-MAX_CHART_SAMPLES + 1), sample])
  }, [sensorData])

  // ── Canvi de mode ──
  const handleModeChange = (newMode: "manual" | "auto" | "return") => {
    sendCommand({ cmd: "mode", value: newMode })
    setMessages(prev => [`Canviant mode a: ${newMode}`, ...prev.slice(0, 2)])
    // No actualitzem `mode` aquí; esperem la confirmació del robot via JSON
  }

  // ── Moviment manual ──
  // El robot espera: { cmd: "move", direction: "forward"|"backward"|"left"|"right"|"stop" }
  const handleDirectionCommand = (direction: "forward" | "backward" | "left" | "right" | "stop") => {
    sendCommand({ cmd: "move", direction })
    setMessages(prev => [`Moviment: ${direction}`, ...prev.slice(0, 2)])
  }

  // ── Reset d'angles / posició ──
  const handleResetAngle    = () => sendCommand({ cmd: "reset_angle" })
  const handleResetPosition = () => {
    sendCommand({ cmd: "reset_position" })
    setMessages(prev => ["Posició i angles resetejats", ...prev.slice(0, 2)])
  }

  // ── Valors segurs quan el WebSocket no ha rebut dades ──
  const gyro = sensorData?.gyroscope ?? { x: 0, y: 0, z: 0 }
  const acc  = sensorData?.accelerometer ?? { x: 0, y: 0, z: 0 }

  // Rotació 3D:
  //  - pitch (cabeceo) = pitch_kalman  → eix X del CSS (rotateX)
  //  - yaw   (gir)     = yaw_kalman   → eix Y del CSS (rotateY)
  const robotRotation = {
    x: sensorData?.pitch.kalman ?? 0,
    y: sensorData?.yaw.kalman   ?? 0,
    z: 0,
  }

  // Posició del mapa en metres (calculada per odometria + Kalman al robot)
  const robotPosition = sensorData?.position ?? { x: 0, y: 0 }
  const robotYaw      = sensorData?.yaw.kalman ?? 0

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Panel de Control del Robot
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Panel de control */}
          <div className="lg:col-span-1">
            <ControlPanel
              onModeChange={handleModeChange}
              onDirectionCommand={handleDirectionCommand}
              onResetAngle={handleResetAngle}
              onResetPosition={handleResetPosition}
              messages={messages}
              currentMode={mode}
            />
          </div>

          {/* Vista 3D */}
          <div className="lg:col-span-1">
            <Robot3DView rotation={robotRotation} />
          </div>

          {/* Dades IMU */}
          <div className="lg:col-span-1">
            <MPUSensor gyroscope={gyro} accelerometer={acc} />
          </div>

          {/* Mapa odometria */}
          <div className="md:col-span-1 lg:col-span-2">
            <RobotMap
              position={robotPosition}
              yawDeg={robotYaw}
              encoders={sensorData?.encoders}
              ambient={sensorData?.ambient}
              obstacles={sensorData?.obstacles}
            />
          </div>

          {/* Gràfic Kalman (dades en temps real) */}
          <div className="md:col-span-1 lg:col-span-1">
            <KalmanFilterChart data={chartData} />
          </div>
        </div>

        {/* Barra d'estat */}
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col sm:flex-row items-center justify-between text-sm shadow-sm">
          <div className="flex items-center gap-6 mb-2 sm:mb-0">
            {/* Indicador de connexió */}
            <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
              <span className="relative flex h-3 w-3">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              </span>
              {isConnected ? 'Connectat' : 'Desconnectat'}
            </span>

            {/* Mode confirmat pel robot */}
            <span className="text-gray-500 dark:text-gray-400">
              Mode:{' '}
              <span className={`font-semibold capitalize ${mode === 'auto' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {mode}
              </span>
            </span>

            {/* Posició actual */}
            {sensorData && (
              <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">
                X: {sensorData.position.x.toFixed(2)} m &nbsp;
                Y: {sensorData.position.y.toFixed(2)} m &nbsp;
                Yaw: {sensorData.yaw.kalman.toFixed(1)}°
              </span>
            )}
          </div>

          <div className="text-gray-500 dark:text-gray-400 font-mono">
            Última actualització: {isMounted ? new Date().toLocaleTimeString() : "--:--:--"}
          </div>
        </div>

      </div>
    </main>
  )
}
