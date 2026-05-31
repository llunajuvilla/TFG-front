"use client"

interface MPUSensorProps {
  gyroscope?: { x: number; y: number; z: number }
  accelerometer?: { x: number; y: number; z: number }
}

export function MPUSensor({
  gyroscope = { x: 0.12, y: -0.05, z: 0.03 },
  accelerometer = { x: 0.15, y: 9.78, z: 0.22 }
}: MPUSensorProps) {
  return (
    <div className="h-full rounded-xl border bg-white dark:bg-gray-950 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wide leading-none tracking-tight">
          MPU - 6050
        </h3>
      </div>
      <div className="p-6 pt-0 space-y-4">
        <div>
          <p className="text-sm font-semibold mb-2">Giroscopi</p>
          <div className="space-y-1 text-sm font-mono text-gray-700 dark:text-gray-300">
            <p>x: {gyroscope.x.toFixed(2)} rad/s</p>
            <p>y: {gyroscope.y.toFixed(2)} rad/s</p>
            <p>z: {gyroscope.z.toFixed(2)} rad/s</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Acceleròmetre</p>
          <div className="space-y-1 text-sm font-mono text-gray-700 dark:text-gray-300">
            <p>x: {accelerometer.x.toFixed(2)} m/s²</p>
            <p>y: {accelerometer.y.toFixed(2)} m/s²</p>
            <p>z: {accelerometer.z.toFixed(2)} m/s²</p>
          </div>
        </div>
      </div>
    </div>
  )
}