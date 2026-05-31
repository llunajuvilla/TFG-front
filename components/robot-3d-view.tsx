"use client"

interface Robot3DViewProps {
  rotation?: { x: number; y: number; z: number }
}

export function Robot3DView({ rotation = { x: 15, y: 30, z: 0 } }: Robot3DViewProps) {
  return (
    <div className="h-full rounded-xl border bg-white dark:bg-gray-950 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wide leading-none tracking-tight">
          Estat del Robot
        </h3>
      </div>
      <div className="p-6 pt-0">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Model 3D orientació</p>
        <div className="relative h-32 bg-gray-100 dark:bg-gray-900 rounded-md flex items-center justify-center overflow-hidden">
          {/* 3D Robot representation using CSS transforms */}
          <div 
            className="relative transition-transform duration-300"
            style={{
              transform: `perspective(200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
              transformStyle: "preserve-3d"
            }}
          >
            {/* Robot body */}
            <div className="w-20 h-10 bg-gray-400 rounded-sm shadow-md relative">
              {/* Front indicator */}
              <div 
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderLeft: "12px solid #6b7280"
                }}
              />
              {/* Wheels */}
              <div className="absolute -bottom-1 left-1 w-4 h-2 bg-gray-600 rounded-sm shadow-sm" />
              <div className="absolute -bottom-1 right-3 w-4 h-2 bg-gray-600 rounded-sm shadow-sm" />
              <div className="absolute -top-1 left-1 w-4 h-2 bg-gray-600 rounded-sm shadow-sm" />
              <div className="absolute -top-1 right-3 w-4 h-2 bg-gray-600 rounded-sm shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}