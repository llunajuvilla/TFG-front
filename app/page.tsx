"use client"

import { useState, useEffect } from "react"
import { ControlPanel } from "@/components/control-panel"
import { Robot3DView } from "@/components/robot-3d-view"
import { MPUSensor } from "@/components/mpu-sensor"
import { RobotMap } from "@/components/robot-map"
import { KalmanFilterChart } from "@/components/kalman-filter-chart"

export default function RobotDashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const [mode, setMode] = useState<"manual" | "automatic" | "return">("automatic")
  const [sensorData, setSensorData] = useState({
    gyroscope: { x: 0.12, y: -0.05, z: 0.03 },
    accelerometer: { x: 0.15, y: 9.78, z: 0.22 },
    temperature: 23,
    humidity: 45.2
  })
  const [robotPosition, setRobotPosition] = useState({ x: 120, y: 80, rotation: 25 })
  const [robotRotation, setRobotRotation] = useState({ x: 15, y: 30, z: 0 })
  const [messages, setMessages] = useState([
    "Cap endavant..",
    "Obstacle detectat",
    "Cap enderrere..."
  ])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        gyroscope: {
          x: prev.gyroscope.x + (Math.random() - 0.5) * 0.02,
          y: prev.gyroscope.y + (Math.random() - 0.5) * 0.02,
          z: prev.gyroscope.z + (Math.random() - 0.5) * 0.02
        },
        accelerometer: {
          x: prev.accelerometer.x + (Math.random() - 0.5) * 0.1,
          y: 9.78 + (Math.random() - 0.5) * 0.05,
          z: prev.accelerometer.z + (Math.random() - 0.5) * 0.1
        },
        temperature: 23 + (Math.random() - 0.5) * 0.5,
        humidity: 45.2 + (Math.random() - 0.5) * 1
      }))

      // Update robot orientation based on gyroscope
      setRobotRotation(prev => ({
        x: prev.x + (Math.random() - 0.5) * 2,
        y: prev.y + (Math.random() - 0.5) * 2,
        z: prev.z + (Math.random() - 0.5) * 1
      }))

      // Simulate robot movement in automatic mode
      if (mode === "automatic") {
        setRobotPosition(prev => ({
          x: Math.max(30, Math.min(220, prev.x + (Math.random() - 0.5) * 5)),
          y: Math.max(20, Math.min(100, prev.y + (Math.random() - 0.5) * 3)),
          rotation: prev.rotation + (Math.random() - 0.5) * 5
        }))
      }
    }, 500)

    return () => clearInterval(interval)
  }, [mode])

  const handleModeChange = (newMode: "manual" | "automatic" | "return") => {
    setMode(newMode)
    setMessages(prev => [
      `Mode canviat a: ${newMode}`,
      ...prev.slice(0, 2)
    ])
  }

  // Handle manual directional commands
  const handleDirectionCommand = (direction: "forward" | "backward" | "left" | "right" | "stop") => {
    setMessages(prev => [
      `Comandament manual: ${direction}`,
      ...prev.slice(0, 2)
    ])
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Panel de Control del Robot
          </h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Row 1 */}
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
            <MPUSensor 
              gyroscope={sensorData.gyroscope} 
              accelerometer={sensorData.accelerometer} 
            />
          </div>
          
          {/* Row 2 */}
          <div className="md:col-span-1 lg:col-span-2">
            <RobotMap 
              robotPosition={robotPosition}
              temperature={sensorData.temperature}
              humidity={sensorData.humidity}
            />
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Connectat
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