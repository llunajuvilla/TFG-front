import { useState, useEffect, useRef, useCallback } from 'react';

export interface SensorData {
  timestamp: number;
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  angles: { acc: number; gyroRaw: number; kalman: number; };
  biasG: number;
}

export function useRobotWebSocket(ipAddress: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!ipAddress) return;

    // Si ya hay uno abierto, lo cerramos antes de abrir otro
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`ws://${ipAddress}:81`);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      setIsConnected(true);
      console.log("Connectat al robot");
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("Connexió perduda. Intentant reconnectar en 3 segons...");
      
      // AUTO-RECONEXIÓN MAGICA:
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = (error) => {
      // Un error suele ir seguido de un close, forzamos el close para auto-reconnectar
      ws.close(); 
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        const byteLength = event.data.byteLength;
        
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
      }
    };

    wsRef.current = ws;
  }, [ipAddress]);

  useEffect(() => {
    connect();

    return () => {
      // Limpieza profunda al desmontar
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // Evita que salte la reconexión si cerramos la página a propósito
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendCommand = useCallback((command: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(command));
    }
  }, []);

  return { isConnected, sensorData, sendCommand };
}