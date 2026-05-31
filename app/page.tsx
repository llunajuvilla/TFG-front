"use client"

import { useState, useEffect } from "react"
import { useRobotWebSocket } from "@/hooks/useRobotWebSocket"

import { ControlPanel } from "@/components/control-panel"
import { Robot3DView } from "@/components/robot-3d-view"
import { MPUSensor } from "@/components/mpu-sensor"
import { RobotMap } from "@/components/robot-map"
import { KalmanFilterChart } from "@/components/kalman-filter-chart"

export default function RobotDashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const [mode, setMode] = useState<"manual" | "automatic" | "return">("automatic")
  const [messages, setMessages] = useState(["Esperant connexió..."])
  
  // IP ESP32
  const ESP32_IP = "192.168.1.15" 
  
  // WWebSockets
  const { isConnected, sensorData, sendCommand } = useRobotWebSocket(ESP32_IP)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleModeChange = (newMode: "manual" | "automatic" | "return") => {
    setMode(newMode)
    // Ejemplo de cómo mandar un comando al ESP32
    sendCommand({ cmd: "change_mode", mode: newMode })
    setMessages(prev => [`Mode canviat a: ${newMode}`, ...prev.slice(0, 2)])
  }

  const handleDirectionCommand = (direction: "forward" | "backward" | "left" | "right" | "stop") => {
    // Mandamos la dirección al robot
    sendCommand({ cmd: "move", direction: direction })
    setMessages(prev => [`Moviment: ${direction}`, ...prev.slice(0, 2)])
  }

  // Preparamos datos seguros por si el sensorData aún es null (desconectado)
  const currentGyro = sensorData?.gyroscope || { x: 0, y: 0, z: 0 }
  const currentAcc = sensorData?.accelerometer || { x: 0, y: 0, z: 0 }
  const robotRotation = sensorData ? { 
    x: sensorData.angles.kalman, // Usamos el filtro de Kalman para X [cite: 34]
    y: 0, 
    z: 0 
  } : { x: 0, y: 0, z: 0 }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Panel de Control del Robot
          </h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ControlPanel 
              onModeChange={handleModeChange} 
              onDirectionCommand={handleDirectionCommand}
              messages={messages} 
            />
          </div>
          <div className="lg:col-span-1">
            <Robot3DView rotation={robotRotation} />
          </div>
          <div className="lg:col-span-1">
            <MPUSensor gyroscope={currentGyro} accelerometer={currentAcc} />
          </div>
          
          <div className="md:col-span-1 lg:col-span-2">
            <RobotMap />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <KalmanFilterChart />
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col sm:flex-row items-center justify-between text-sm shadow-sm">
          <div className="flex items-center gap-6 mb-2 sm:mb-0">
            <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
              <span className="relative flex h-3 w-3">
                {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              {isConnected ? 'Connectat' : 'Desconnectat'}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Mode: <span className="font-semibold text-gray-900 dark:text-white capitalize">{mode}</span>
            </span>
          </div>
          <div className="text-gray-500 dark:text-gray-400 font-mono">
            Última actualització: {isMounted ? new Date().toLocaleTimeString() : "--:--:--"}
          </div>
        </div>
      </div>
    </main>
  )
}