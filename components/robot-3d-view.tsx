"use client"

interface Robot3DViewProps {
  rotation?: { x: number; y: number; z: number }
}

export function Robot3DView({ rotation = { x: 0, y: 0, z: 0 } }: Robot3DViewProps) {
  return (
    <div className="h-full rounded-xl border bg-white dark:bg-gray-950 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wide leading-none tracking-tight">
          Orientació 3D
        </h3>
      </div>
      
      <div className="p-6 pt-0 flex flex-col items-center">
        {/* Marcador numérico superior */}
        <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-6 w-full flex justify-between px-4 bg-gray-50 dark:bg-gray-900 py-2 rounded-md border border-gray-100 dark:border-gray-800">
          <span>X: {rotation.x.toFixed(1)}°</span>
          <span>Y: {rotation.y.toFixed(1)}°</span>
          <span>Z: {rotation.z.toFixed(1)}°</span>
        </div>
        
        {/* Contenedor principal con Perspectiva 3D */}
        <div 
          className="relative w-full h-48 flex items-center justify-center" 
          style={{ perspective: "800px" }}
        >
          {/* El cuerpo del robot (Caja 3D) */}
          <div 
            className="relative w-[100px] h-[160px]"
            style={{
              transformStyle: "preserve-3d",
              // IMPORTANTE: Aquí se mapean los ejes del sensor a los de la pantalla.
              // En CSS: rotateX es Pitch (cabeceo), rotateY es Yaw (giro), rotateZ es Roll (inclinación lateral)
              transform: `rotateX(${-rotation.y}deg) rotateY(${-rotation.z}deg) rotateZ(${-rotation.x}deg)`,
              transition: "transform 0.1s linear"
            }}
          >
            
            {/* 1. Cara Superior (Techo) */}
            <div 
              className="absolute inset-0 bg-slate-700 border border-slate-600 flex flex-col items-center justify-center shadow-inner"
              style={{ transform: "translateZ(20px)" }}
            >
              {/* Flecha y texto indicando el morro */}
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-white opacity-80 mb-2" />
              <span className="text-white/80 font-bold tracking-widest text-xs">FRONT</span>
            </div>

            {/* 2. Cara Inferior (Chasis) */}
            <div 
              className="absolute inset-0 bg-slate-900 border border-slate-800"
              style={{ transform: "translateZ(-20px) rotateY(180deg)" }}
            />

            {/* 3. Frontal (Morro con faros) */}
            <div 
              className="absolute top-0 left-0 w-[100px] h-[40px] bg-slate-800 border border-slate-700 flex justify-around items-center px-2"
              style={{ transformOrigin: "top", transform: "rotateX(-90deg)" }}
            >
              <div className="w-4 h-4 bg-yellow-200 rounded-full shadow-[0_0_12px_#fef08a]" />
              <div className="w-4 h-4 bg-yellow-200 rounded-full shadow-[0_0_12px_#fef08a]" />
            </div>

            {/* 4. Trasera (Luces de freno) */}
            <div 
              className="absolute bottom-0 left-0 w-[100px] h-[40px] bg-slate-800 border border-slate-700 flex justify-between items-center px-2"
              style={{ transformOrigin: "bottom", transform: "rotateX(90deg)" }}
            >
              <div className="w-6 h-2 bg-red-500 rounded-sm shadow-[0_0_8px_#ef4444]" />
              <div className="w-6 h-2 bg-red-500 rounded-sm shadow-[0_0_8px_#ef4444]" />
            </div>

            {/* 5. Lateral Izquierdo (Con ruedas) */}
            <div 
              className="absolute top-0 left-0 w-[40px] h-[160px] bg-slate-800 border border-slate-700 flex flex-col justify-between py-4 items-center"
              style={{ transformOrigin: "left", transform: "rotateY(90deg)" }}
            >
               {/* Rueda delantera izquierda */}
               <div 
                  className="w-10 h-16 bg-neutral-950 rounded-md border border-neutral-800" 
                  style={{ transform: "translateZ(10px) translateX(-5px)" }} 
               />
               {/* Rueda trasera izquierda */}
               <div 
                  className="w-10 h-16 bg-neutral-950 rounded-md border border-neutral-800" 
                  style={{ transform: "translateZ(10px) translateX(-5px)" }} 
               />
            </div>

            {/* 6. Lateral Derecho (Con ruedas) */}
            <div 
              className="absolute top-0 right-0 w-[40px] h-[160px] bg-slate-800 border border-slate-700 flex flex-col justify-between py-4 items-center"
              style={{ transformOrigin: "right", transform: "rotateY(-90deg)" }}
            >
               {/* Rueda delantera derecha */}
               <div 
                  className="w-10 h-16 bg-neutral-950 rounded-md border border-neutral-800" 
                  style={{ transform: "translateZ(10px) translateX(5px)" }} 
               />
               {/* Rueda trasera derecha */}
               <div 
                  className="w-10 h-16 bg-neutral-950 rounded-md border border-neutral-800" 
                  style={{ transform: "translateZ(10px) translateX(5px)" }} 
               />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}