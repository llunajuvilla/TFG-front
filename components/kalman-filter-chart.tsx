"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

interface KalmanFilterChartProps {
  data?: Array<{ time: number; verdadera: number; filtrada: number }>
}

const defaultData = [
  { time: 0, verdadera: 2, filtrada: 2 },
  { time: 1, verdadera: 3.5, filtrada: 2.8 },
  { time: 2, verdadera: 2.8, filtrada: 3 },
  { time: 3, verdadera: 4.2, filtrada: 3.5 },
  { time: 4, verdadera: 3, filtrada: 3.4 },
  { time: 5, verdadera: 5, filtrada: 4 },
  { time: 6, verdadera: 4.5, filtrada: 4.3 },
  { time: 7, verdadera: 3.8, filtrada: 4.1 },
  { time: 8, verdadera: 5.5, filtrada: 4.5 },
  { time: 9, verdadera: 4, filtrada: 4.4 },
  { time: 10, verdadera: 5.2, filtrada: 4.6 },
  { time: 11, verdadera: 4.8, filtrada: 4.7 },
  { time: 12, verdadera: 3.5, filtrada: 4.3 },
]

export function KalmanFilterChart({ data = defaultData }: KalmanFilterChartProps) {
  return (
    <div className="h-full rounded-xl border bg-white dark:bg-gray-950 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wide leading-none tracking-tight">
          Filtre Kalman
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                label={{ value: "t(s)", position: "insideBottomRight", offset: -5, fontSize: 10 }}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                label={{ value: "z", angle: -90, position: "insideLeft", fontSize: 10 }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "10px" }}
                formatter={(value) => value === "verdadera" ? "Verdadera" : "Filtrada"}
              />
              <Line 
                type="monotone" 
                dataKey="verdadera" 
                stroke="#1f2937" 
                strokeWidth={1.5}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="filtrada" 
                stroke="#9ca3af" 
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}