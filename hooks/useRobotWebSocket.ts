import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================
// ImuFrame — ha de coincidir EXACTAMENT amb el struct del .ino
// #pragma pack(push, 1) → sense padding, total 76 bytes
//
// Offset  Mida  Camp
//   0      4    timestamp_ms  (uint32)
//   4      4    ax            (float, m/s²)
//   8      4    ay
//  12      4    az
//  16      4    gx            (float, rad/s)
//  20      4    gy
//  24      4    gz
//  28      4    pitch_acc     (float, °)
//  32      4    pitch_gyro    (float, °)
//  36      4    pitch_kalman  (float, °)
//  40      4    bias_gy       (float)
//  44      4    yaw_gyro      (float, °)
//  48      4    yaw_encoders  (float, °)
//  52      4    yaw_kalman    (float, °)
//  56      4    bias_gz       (float)
//  60      4    enc_left      (int32)
//  64      4    enc_right     (int32)
//  68      4    pos_x         (float, m)
//  72      4    pos_y         (float, m)
// ============================================================
const FRAME_SIZE = 84;

export interface SensorData {
  timestamp: number;
  accelerometer: { x: number; y: number; z: number };  // m/s²
  gyroscope:     { x: number; y: number; z: number };  // rad/s
  pitch: {
    acc:    number;  // °  (angle de l'acceleròmetre)
    gyro:   number;  // °  (integració bruta del giroscopi)
    kalman: number;  // °  (filtre de Kalman pitch)
    bias:   number;
  };
  yaw: {
    gyro:     number;  // °  (integració bruta gz)
    encoders: number;  // °  (odometria encoders)
    kalman:   number;  // °  (filtre de Kalman yaw — orientació real)
    bias:     number;
  };
  encoders: { left: number; right: number };  // polsos acumulats
  position: { x: number; y: number };         // metres
  ambient: { temperature: number; humidity: number };  // DHT11
}

export function useRobotWebSocket(ipAddress: string) {
  const [isConnected, setIsConnected]   = useState(false);
  const [sensorData, setSensorData]     = useState<SensorData | null>(null);
  const [robotMode, setRobotMode]       = useState<'manual' | 'auto'>('manual');
  const wsRef                           = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef             = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!ipAddress) return;
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(`ws://${ipAddress}:81`);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      setIsConnected(true);
      console.log('[WS] Connectat al robot');
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('[WS] Connexió perduda. Reconnectant en 3 s…');
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => ws.close();

    ws.onmessage = (event) => {
      // ── Frame binari (telemetria IMU + odometria) ──
      if (event.data instanceof ArrayBuffer) {
        if (event.data.byteLength !== FRAME_SIZE) return;  // ignorem frames malformats
        const v = new DataView(event.data);
        setSensorData({
          timestamp:     v.getUint32(0,  true),
          accelerometer: {
            x: v.getFloat32(4,  true),
            y: v.getFloat32(8,  true),
            z: v.getFloat32(12, true),
          },
          gyroscope: {
            x: v.getFloat32(16, true),
            y: v.getFloat32(20, true),
            z: v.getFloat32(24, true),
          },
          pitch: {
            acc:    v.getFloat32(28, true),
            gyro:   v.getFloat32(32, true),
            kalman: v.getFloat32(36, true),
            bias:   v.getFloat32(40, true),
          },
          yaw: {
            gyro:     v.getFloat32(44, true),
            encoders: v.getFloat32(48, true),
            kalman:   v.getFloat32(52, true),
            bias:     v.getFloat32(56, true),
          },
          encoders: {
            left:  v.getInt32(60, true),
            right: v.getInt32(64, true),
          },
          position: {
            x: v.getFloat32(68, true),
            y: v.getFloat32(72, true),
          },
          ambient: {
            temperature: v.getFloat32(76, true),
            humidity:    v.getFloat32(80, true),
          },
        });
        return;
      }

      // ── Missatge de text (JSON d'estat) — ex: {"mode":"auto"} ──
      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data);
          if (msg.mode === 'auto' || msg.mode === 'manual') {
            setRobotMode(msg.mode);
          }
        } catch { /* ignorem JSON malformat */ }
      }
    };

    wsRef.current = ws;
  }, [ipAddress]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;  // evita reconexió en desmuntar
        wsRef.current.close();
      }
    };
  }, [connect]);

  // ── Envia un JSON al robot ──
  const sendCommand = useCallback((command: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(command));
    }
  }, []);

  return { isConnected, sensorData, robotMode, sendCommand };
}
