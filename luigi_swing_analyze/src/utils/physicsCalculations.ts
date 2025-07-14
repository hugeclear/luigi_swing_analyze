import { TrajectoryPoint, SwingPathPoint, SensorData } from '../types/swing';

export const generateTrajectory = (distance: number, launchAngle: number, curvature: number): TrajectoryPoint[] => {
  const points: TrajectoryPoint[] = [];
  const steps = 80;
  const gravity = 9.81;
  const initialVelocity = Math.sqrt(distance * gravity / Math.sin(2 * launchAngle * Math.PI / 180));
  
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * (distance / (initialVelocity * Math.cos(launchAngle * Math.PI / 180)));
    const x = initialVelocity * Math.cos(launchAngle * Math.PI / 180) * t;
    const y = Math.max(0, initialVelocity * Math.sin(launchAngle * Math.PI / 180) * t - 0.5 * gravity * t * t);
    const z = curvature * (x / distance) * (1 - x / distance) * 4 * 20;
    
    points.push({ x, y, z, time: t });
  }
  
  return points;
};

export const generateAdvancedSwingPath = (swingSpeed: number, club: string): SwingPathPoint[] => {
  const points: SwingPathPoint[] = [];
  const steps = 60;
  const speedFactor = swingSpeed / 40;
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const angle = (progress - 0.5) * Math.PI * 1.4;
    
    const clubFactor = club.includes('ドライバー') ? 1.2 : 
                      club.includes('I') ? 1.0 : 0.8;
    
    const x = Math.sin(angle) * 120 * clubFactor;
    const y = Math.cos(angle) * 80 + 30;
    const z = Math.sin(angle * 2) * 20 * speedFactor;
    const dynamicY = y + Math.sin(progress * Math.PI) * speedFactor * 10;
    
    points.push({ 
      x, 
      y: dynamicY, 
      z,
      speed: Math.abs(Math.sin(progress * Math.PI)) * swingSpeed,
      phase: progress < 0.3 ? 'バックスイング' : 
             progress < 0.7 ? 'ダウンスイング' : 
             progress < 0.8 ? 'インパクト' : 'フォロースルー'
    });
  }
  
  return points;
};

export const generateSensorData = (swingSpeed: number, club: string): SensorData[] => {
  const phases = ['アドレス', 'テイクアウェイ', 'トップ', 'ダウンスイング', 'インパクト', 'フォロースルー'];
  const timeStamps = [0, 300, 800, 1200, 1400, 2000];
  
  return phases.map((phase, index) => ({
    phase,
    time: timeStamps[index],
    acceleration: {
      x: Math.sin(index * Math.PI / phases.length) * swingSpeed * (Math.random() * 0.2 + 0.9),
      y: Math.cos(index * Math.PI / phases.length) * swingSpeed * (Math.random() * 0.2 + 0.9),
      z: Math.random() * swingSpeed * 0.3
    },
    gyroscope: {
      x: Math.sin(index * Math.PI * 2 / phases.length) * 200 * (Math.random() * 0.3 + 0.85),
      y: Math.cos(index * Math.PI * 2 / phases.length) * 150 * (Math.random() * 0.3 + 0.85),
      z: Math.random() * 100 - 50
    },
    clubFaceAngle: index < 4 ? Math.random() * 10 - 5 : Math.random() * 20 - 10,
    wristAngle: 20 - index * 8 + Math.random() * 10
  }));
};
