export interface PoseKeypoint {
  x: number;
  y: number;
  confidence: number;
}

export interface SwingAnalysisResult {
  phase: string;
  phaseConfidence: number;
  qualityScore: number;
  features: Float32Array;
  recommendations: string[];
  technicalAdvice: string[];
}

export interface SwingComparison {
  overallSimilarity: number;
  phaseMatches: number[];
  weakestPhases: string[];
  improvementAreas: string[];
}

export interface TipRecommendation {
  tip: any;
  relevanceScore: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string[];
  estimatedImpact: number;
  prerequisitesMet: boolean;
}
