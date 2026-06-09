"use client"

// rotation.x = pitch_kalman (°)  → cabeceo (inclinació cap endavant/enrere)
// rotation.y = yaw_kalman   (°)  → gir sobre l'eix vertical
// rotation.z = roll          (°)  → (no calculat pel robot, sempre 0)
interface Robot3DViewProps {
  rotation?: { x: number; y: number; z: number }
}

export function Robot3DView({ rotation = { x: 0, y: 0, z: 0 } }: Robot3DViewProps) {
  return (
    <div className="h-full rounded-xl border bg-white dark:bg-gray-950 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wide leading-none">
          Orientació 3D
        </h3>
      </div>

      <div className="p-6 pt-0 flex flex-col items-center">
        {/* Valors numèrics — pitch, yaw i roll */}
        <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-6 w-full flex justify-between px-4 bg-gray-50 dark:bg-gray-900 py-2 rounded-md border border-gray-100 dark:border-gray-800">
          <span>Pitch: {rotation.x.toFixed(1)}°</span>
          <span>Yaw: {rotation.y.toFixed(1)}°</span>
          <span>Roll: {rotation.z.toFixed(1)}°</span>
        </div>

        {/* Contenidor amb perspectiva 3D */}
        <div
          className="relative w-full h-48 flex items-center justify-center"
          style={{ perspective: "800px" }}
        >
          {/*
            Mapeig eixos sensor → CSS:
              rotateX (CSS) = pitch → cap endavant/enrere = rotation.x
              rotateY (CSS) = yaw   → gir vertical        = rotation.y
              rotateZ (CSS) = roll  → inclinació lateral  = rotation.z
            Signe negatiu per seguir la convenció aeronàutica visual.
          */}
          <div
            className="relative w-[100px] h-[160px]"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${-rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${-rotation.z}deg)`,
              transition: "transform 0.1s linear",
            }}
          >
            {/* Cara Superior */}
            <div
              className="absolute inset-0 bg-slate-700 border border-slate-600 flex flex-col items-center justify-center shadow-inner"
              style={{ transform: "translateZ(20px)" }}
            >
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-white opacity-80 mb-2" />
              <span className="text-white/80 font-bold tracking-widest text-xs">FRONT</span>
            </div>

            {/* Cara Inferior */}
            <div
              className="absolute inset-0 bg-slate-900 border border-slate-800"
              style={{ transform: "translateZ(-20px) rotateY(180deg)" }}
            />

            {/* Frontal — faros */}
            <div
              className="absolute top-0 left-0 w-[100px] h-[40px] bg-slate-800 border border-slate-700 flex justify-around items-center px-2"
              style={{ transformOrigin: "top", transform: "rotateX(-90deg)" }}
            >
              <div className="w-4 h-4 bg-yellow-200 rounded-full shadow-[0_0_12px_#fef08a]" />
              <div className="w-4 h-4 bg-yellow-200 rounded-full shadow-[0_0_12px_#fef08a]" />
            </div>

            {/* Trasera — llums de freno */}
            <div
              className="absolute bottom-0 left-0 w-[100px] h-[40px] bg-slate-800 border border-slate-700 flex justify-between items-center px-2"
              style={{ transformOrigin: "bottom", transform: "rotateX(90deg)" }}
            >
              <div className="w-6 h-2 bg-red-500 rounded-sm shadow-[0_0_8px_#ef4444]" />
              <div className="w-6 h-2 bg-red-500 rounded-sm shadow-[0_0_8px_#ef4444]" />
            </div>

            {/* Lateral Esquerre */}
            <div
              className="absolute top-0 left-0 w-[40px] h-[160px] bg-slate-800 border border-slate-700 flex flex-col justify-between py-4 items-center"
              style={{ transformOrigin: "left", transform: "rotateY(90deg)" }}
            >
              <div className="w-10 h-16 bg-neutral-950 rounded-md border border-neutral-800" style={{ transform: "translateZ(10px) translateX(-5px)" }} />
              <div className="w-10 h-16 bg-neutral-950 rounded-md border border-neutral-800" style={{ transform: "translateZ(10px) translateX(-5px)" }} />
            </div>

            {/* Lateral Dret */}
            <div
              className="absolute top-0 right-0 w-[40px] h-[160px] bg-slate-800 border border-slate-700 flex flex-col justify-between py-4 items-center"
              style={{ transformOrigin: "right", transform: "rotateY(-90deg)" }}
            >
              <div className="w-10 h-16 bg-neutral-950 rounded-md border border-neutral-800" style={{ transform: "translateZ(10px) translateX(5px)" }} />
              <div className="w-10 h-16 bg-neutral-950 rounded-md border border-neutral-800" style={{ transform: "translateZ(10px) translateX(5px)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
