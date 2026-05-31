"use client"

interface Obstacle {
  x: number
  y: number
}

interface RobotMapProps {
  robotPosition?: { x: number; y: number; rotation: number }
  obstacles?: Obstacle[]
  temperature?: number
  humidity?: number
}

export function RobotMap({
  robotPosition = { x: 120, y: 80, rotation: 25 },
  obstacles = [
    { x: 80, y: 60 },
    { x: 180, y: 55 }
  ],
  temperature = 23,
  humidity = 45.2
}: RobotMapProps) {
  return (
    <div className="h-full rounded-xl border bg-white dark:bg-gray-950 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-none tracking-tight">
          Mapa
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="relative">
          {/* Map container with axes */}
          <div className="flex">
            {/* Y-axis label */}
            <div className="flex flex-col justify-center pr-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">x</span>
            </div>
            
            {/* Map area */}
            <div className="relative w-full h-40 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
              {/* Obstacles */}
              {obstacles.map((obstacle, index) => (
                <div
                  key={index}
                  className="absolute w-4 h-4 bg-red-500 rounded-full shadow-sm"
                  style={{
                    left: `${(obstacle.x / 250) * 100}%`,
                    top: `${(obstacle.y / 120) * 100}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                />
              ))}
              
              {/* Robot */}
              <div
                className="absolute transition-all duration-300"
                style={{
                  left: `${(robotPosition.x / 250) * 100}%`,
                  top: `${(robotPosition.y / 120) * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${robotPosition.rotation}deg)`
                }}
              >
                {/* Robot body */}
                <div className="w-10 h-6 bg-gray-400 rounded-sm relative shadow-sm">
                  {/* Direction indicator */}
                  <div 
                    className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0"
                    style={{
                      borderTop: "5px solid transparent",
                      borderBottom: "5px solid transparent",
                      borderLeft: "8px solid #374151"
                    }}
                  />
                  {/* Wheels */}
                  <div className="absolute -bottom-0.5 left-0.5 w-2 h-1 bg-gray-600 rounded-sm" />
                  <div className="absolute -bottom-0.5 right-2 w-2 h-1 bg-gray-600 rounded-sm" />
                  <div className="absolute -top-0.5 left-0.5 w-2 h-1 bg-gray-600 rounded-sm" />
                  <div className="absolute -top-0.5 right-2 w-2 h-1 bg-gray-600 rounded-sm" />
                </div>
              </div>
              
              {/* Coordinates indicator */}
              <div className="absolute bottom-1 right-1 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/80 px-1 rounded">
                (x,y)
              </div>
            </div>
          </div>
          
          {/* X-axis label */}
          <div className="text-center mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">y</span>
          </div>
          
          {/* Legend and environmental data */}
          <div className="mt-3 flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-xs text-red-500 font-medium">Obstacles</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right font-mono">
              <p>Temperatura: {temperature}ºC</p>
              <p>Humitat: {humidity}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}