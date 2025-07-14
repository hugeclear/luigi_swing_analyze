export interface SwingData {
  id: number;
  date: string;
  club: string;
  distance: number;
  accuracy: number;
  swingSpeed: number;
  ballSpeed: number;
  launchAngle: number;
  spinRate: number;
  direction: string;
  curvature: number;
  trajectory: TrajectoryPoint[];
  swingPath: SwingPathPoint[];
  sensorData: SensorData[];
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
  time: number;
}

export interface SwingPathPoint {
  x: number;
  y: number;
  z: number;
  speed: number;
  phase: string;
}

export interface SensorData {
  phase: string;
  time: number;
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
  clubFaceAngle: number;
  wristAngle: number;
}

export type SkillLevel = 'beginner' | 'amateur' | 'pro';
export type SwingPhase = 'アドレス' | 'テイクアウェイ' | 'トップ' | 'ダウンスイング' | 'インパクト' | 'フォロースルー';
