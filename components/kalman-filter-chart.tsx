"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"

interface KalmanSample {
  time: number
  pitch_raw: number
  pitch_kalman: number
  yaw_raw: number
  yaw_kalman: number
}

interface KalmanFilterChartProps {
  data?: KalmanSample[]
}

// Dades d'exemple deterministes — sense Math.random() per evitar
// l'error d'hidratació SSR/CSR de Next.js
const NOISE = [1.2, -0.8, 1.5, -1.1, 0.6, -1.4, 1.8, -0.5, 1.3, -0.9,
               0.7, -1.6, 1.1, -0.4, 1.7, -1.2, 0.9, -0.7, 1.4, -1.0]
const DEMO_DATA: KalmanSample[] = Array.from({ length: 20 }, (_, i) => ({
  time:         parseFloat((i * 0.5).toFixed(1)),
  pitch_raw:    parseFloat((Math.sin(i * 0.4) * 8 + NOISE[i] * 2).toFixed(2)),
  pitch_kalman: parseFloat((Math.sin(i * 0.4) * 7.5).toFixed(2)),
  yaw_raw:      parseFloat((i * 2.1 + NOISE[i] * 1.5).toFixed(2)),
  yaw_kalman:   parseFloat((i * 2.0).toFixed(2)),
}))

export function KalmanFilterChart({ data }: KalmanFilterChartProps) {
  const chartData = (data && data.length > 0) ? data : DEMO_DATA
  const isLive = data && data.length > 0

  return (
    <div className="h-full rounded-xl border bg-white dark:bg-gray-950 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wide">
            Filtre Kalman
          </h3>
          {isLive ? (
            <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              En viu
            </span>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-600 italic">demo</span>
          )}
        </div>

        {/* Llegenda manual amb colors clars */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 pt-1">
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-0.5 bg-blue-400" />  Pitch brut
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-0.5 bg-blue-600 border-dashed border-t-2 border-blue-600" />  Pitch Kalman
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-0.5 bg-orange-400" />  Yaw brut
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-0.5 bg-orange-600 border-dashed border-t-2 border-orange-600" />  Yaw Kalman
          </span>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9 }}
                label={{ value: "t (s)", position: "insideBottomRight", offset: -4, fontSize: 9 }}
              />
              <YAxis
                tick={{ fontSize: 9 }}
                label={{ value: "°", angle: -90, position: "insideLeft", fontSize: 9 }}
              />
              <Tooltip
                contentStyle={{ fontSize: "11px", padding: "4px 8px" }}
                formatter={(value: ValueType | undefined, name: NameType | undefined) => {
                  if (value === undefined || value === null) return ["—", String(name ?? "")]
                  const label =
                    name === "pitch_raw"    ? "Pitch brut"   :
                    name === "pitch_kalman" ? "Pitch Kalman" :
                    name === "yaw_raw"      ? "Yaw brut"     : "Yaw Kalman"
                  return [`${Number(value).toFixed(2)}°`, label]
                }}
                labelFormatter={(t) => `t = ${t} s`}
              />

              {/* Pitch brut — línia fina i translúcida */}
              <Line
                type="monotone"
                dataKey="pitch_raw"
                stroke="#93c5fd"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
              {/* Pitch Kalman — línia gruixuda contínua */}
              <Line
                type="monotone"
                dataKey="pitch_kalman"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              {/* Yaw brut */}
              <Line
                type="monotone"
                dataKey="yaw_raw"
                stroke="#fdba74"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
              {/* Yaw Kalman */}
              <Line
                type="monotone"
                dataKey="yaw_kalman"
                stroke="#ea580c"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Valors instantanis */}
        {isLive && chartData.length > 0 && (() => {
          const last = chartData[chartData.length - 1]
          return (
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 dark:bg-blue-950/40 rounded-lg p-2">
                <p className="text-blue-400 font-medium mb-0.5">Pitch</p>
                <p className="font-mono text-blue-700 dark:text-blue-300">
                  Brut: {last.pitch_raw.toFixed(1)}°
                </p>
                <p className="font-mono text-blue-900 dark:text-blue-100 font-bold">
                  Kalman: {last.pitch_kalman.toFixed(1)}°
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/40 rounded-lg p-2">
                <p className="text-orange-400 font-medium mb-0.5">Yaw</p>
                <p className="font-mono text-orange-700 dark:text-orange-300">
                  Brut: {last.yaw_raw.toFixed(1)}°
                </p>
                <p className="font-mono text-orange-900 dark:text-orange-100 font-bold">
                  Kalman: {last.yaw_kalman.toFixed(1)}°
                </p>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
