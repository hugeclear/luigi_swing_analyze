import { SwingData, SkillLevel } from '../types/swing';
import { generateTrajectory, generateAdvancedSwingPath, generateSensorData } from './physicsCalculations';

interface ClubData {
  baseDistance: number;
  baseSpeed: number;
  baseLaunch: number;
  baseSpin: number;
}

const clubData: Record<string, ClubData> = {
  'ドライバー': { baseDistance: 230, baseSpeed: 40, baseLaunch: 12, baseSpin: 2800 },
  '3W': { baseDistance: 210, baseSpeed: 38, baseLaunch: 13, baseSpin: 3200 },
  '5I': { baseDistance: 180, baseSpeed: 34, baseLaunch: 16, baseSpin: 5000 },
  '7I': { baseDistance: 155, baseSpeed: 32, baseLaunch: 18, baseSpin: 6200 },
  '9I': { baseDistance: 125, baseSpeed: 28, baseLaunch: 22, baseSpin: 7500 },
  'PW': { baseDistance: 95, baseSpeed: 26, baseLaunch: 26, baseSpin: 8500 },
  'SW': { baseDistance: 75, baseSpeed: 22, baseLaunch: 30, baseSpin: 9500 }
};

export const weightedRandomChoice = (items: string[], weights: number[]): string => {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * total;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[0];
};

export const generateRealisticSwingData = (club: string, skill: SkillLevel = 'amateur'): Omit<SwingData, 'id' | 'date'> => {
  const base = clubData[club];
  const skillMultiplier = skill === 'pro' ? 1.2 : skill === 'amateur' ? 1.0 : 0.8;
  const variance = skill === 'pro' ? 0.05 : skill === 'amateur' ? 0.15 : 0.25;
  
  const distance = Math.round(base.baseDistance * skillMultiplier * (1 + (Math.random() - 0.5) * variance));
  const swingSpeed = Math.round(base.baseSpeed * skillMultiplier * (1 + (Math.random() - 0.5) * variance * 0.5) * 10) / 10;
  const ballSpeed = Math.round(swingSpeed * 3.7 + (Math.random() - 0.5) * 10);
  const launchAngle = Math.round(base.baseLaunch * (1 + (Math.random() - 0.5) * 0.3) * 10) / 10;
  const spinRate = Math.round(base.baseSpin * (1 + (Math.random() - 0.5) * 0.2));
  
  const directions = ['ストレート', 'フェード', 'ドロー', 'スライス', 'フック'];
  const directionWeights = skill === 'pro' ? [60, 20, 20, 0, 0] : skill === 'amateur' ? [40, 25, 25, 5, 5] : [20, 20, 20, 20, 20];
  const direction = weightedRandomChoice(directions, directionWeights);
  
  const curvature = direction === 'ストレート' ? 0 : 
                  direction === 'フェード' ? Math.random() * 8 + 2 :
                  direction === 'ドロー' ? -(Math.random() * 8 + 2) :
                  direction === 'スライス' ? Math.random() * 20 + 10 :
                  -(Math.random() * 20 + 10);

  const accuracy = Math.round(Math.max(50, 100 - Math.abs(curvature) * 2 - (100 - distance / base.baseDistance * 100) * 0.5));

  return {
    club,
    distance,
    accuracy,
    swingSpeed,
    ballSpeed,
    launchAngle,
    spinRate,
    direction,
    curvature,
    trajectory: generateTrajectory(distance, launchAngle, curvature),
    swingPath: generateAdvancedSwingPath(swingSpeed, club),
    sensorData: generateSensorData(swingSpeed, club)
  };
};
