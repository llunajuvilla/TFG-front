import { useState, useEffect, useRef, useCallback } from 'react';

// Estructura adaptada a tu ImuFrame del ESP32
export interface SensorData {
  timestamp: number;
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  angles: {
    acc: number;
    gyroRaw: number;
    kalman: number;
  };
  biasG: number;
}

export function useRobotWebSocket(ipAddress: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!ipAddress) return;

    // Tu código Arduino inicia el WebSocket en el puerto 81 [cite: 36]
    const wsUrl = `ws://${ipAddress}:81`;
    const ws = new WebSocket(wsUrl);
    
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = (error) => console.error("Error WebSocket:", error);

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Comprobamos el tamaño del paquete recibido
        const byteLength = event.data.byteLength;
        
        // Si el paquete es de 44 bytes (el que esperamos de IMUWIFI.ino)
        if (byteLength === 44) {
          const view = new DataView(event.data);
          setSensorData({
            timestamp: view.getUint32(0, true),
            accelerometer: {
              x: view.getFloat32(4, true),
              y: view.getFloat32(8, true),
              z: view.getFloat32(12, true),
            },
            gyroscope: {
              x: view.getFloat32(16, true),
              y: view.getFloat32(20, true),
              z: view.getFloat32(24, true),
            },
            angles: {
              acc: view.getFloat32(28, true),
              gyroRaw: view.getFloat32(32, true),
              kalman: view.getFloat32(36, true),
            },
            biasG: view.getFloat32(40, true)
          });
        } 
        // Si el paquete es de 28 bytes
        else if (byteLength === 28) {
          const view = new DataView(event.data);
          setSensorData({
            timestamp: view.getUint32(0, true),
            accelerometer: {
              x: view.getFloat32(4, true),
              y: view.getFloat32(8, true),
              z: view.getFloat32(12, true),
            },
            gyroscope: {
              x: view.getFloat32(16, true),
              y: view.getFloat32(20, true),
              z: view.getFloat32(24, true),
            },
            // Como no tenemos ángulos en este paquete antiguo, ponemos 0
            angles: { acc: 0, gyroRaw: 0, kalman: 0 },
            biasG: 0
          });
        } else {
          console.warn(`Paquete recibido con tamaño inesperado: ${byteLength} bytes.`);
        }
      }
    };

    wsRef.current = ws;

    // Limpieza al desmontar el componente
    return () => {
      ws.close();
    };
  }, [ipAddress]);

  // Función para enviar comandos en JSON al ESP32
  const sendCommand = useCallback((command: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(command));
    } else {
      console.warn("WebSocket no está conectado. Comando ignorado.");
    }
  }, []);

  return { isConnected, sensorData, sendCommand };
}