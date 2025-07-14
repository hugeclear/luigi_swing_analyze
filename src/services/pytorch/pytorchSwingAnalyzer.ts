// @ts-ignore - ONNX型定義は独自実装を使用
import * as ort from 'onnxruntime-web';
import { PoseKeypoint, SwingAnalysisResult, SwingComparison } from '../../types/pytorch';

export class PyTorchSwingAnalyzer {
  private swingSession: any = null; // InferenceSession
  private isInitialized: boolean = false;
  
  private readonly SWING_PHASES = [
    'address', 'takeaway', 'backswing', 'top', 'downswing', 'impact', 'follow-through'
  ];

  async initialize(): Promise<void> {
    try {
      console.log('🔄 PyTorch models loading...');
      
      // ONNX Runtime Web の初期化設定
      // @ts-ignore
      ort.env.wasm.wasmPaths = '/node_modules/onnxruntime-web/dist/';
      
      // 現在はダミー実装（後でONNXモデルに置き換え）
      await new Promise(resolve => setTimeout(resolve, 1000)); // ローディング模擬
      
      this.isInitialized = true;
      console.log('✅ PyTorch models loaded successfully (Mock)');
    } catch (error) {
      console.error('❌ Failed to load PyTorch models:', error);
      // 開発中はエラーでも続行
      this.isInitialized = true;
      console.log('⚠️ Using mock implementation');
    }
  }

  async analyzeSwingSequence(poseSequence: PoseKeypoint[][]): Promise<SwingAnalysisResult> {
    if (!this.isInitialized) {
      throw new Error('Analyzer not initialized');
    }

    // シミュレートされた処理時間
    await new Promise(resolve => setTimeout(resolve, 500));

    // 現在はダミー分析（後で実際のPyTorch推論に置き換え）
    const mockAnalysis: SwingAnalysisResult = {
      phase: this.SWING_PHASES[Math.floor(Math.random() * this.SWING_PHASES.length)],
      phaseConfidence: 75 + Math.random() * 20,
      qualityScore: 65 + Math.random() * 30,
      features: new Float32Array(128).map(() => Math.random()),
      recommendations: [
        'スイングテンポを一定に保ちましょう',
        '体重移動を意識してください',
        'フォロースルーを完全に振り切りましょう',
        '左腕の伸展を維持してください'
      ],
      technicalAdvice: [
        'アドレス時の肩のラインを確認',
        'バックスイングで左腕を伸ばす',
        'インパクトで頭の位置を安定',
        'フィニッシュまで振り切る'
      ]
    };

    console.log('🧠 PyTorch Analysis Result:', mockAnalysis);
    return mockAnalysis;
  }

  async compareSwings(userSwing: PoseKeypoint[][], referenceSwing: PoseKeypoint[][]): Promise<SwingComparison> {
    if (!this.isInitialized) {
      throw new Error('Analyzer not initialized');
    }

    // シミュレートされた処理時間
    await new Promise(resolve => setTimeout(resolve, 800));

    // ダミー比較結果
    const comparison: SwingComparison = {
      overallSimilarity: 70 + Math.random() * 25,
      phaseMatches: Array.from({length: 7}, (_, i) => {
        // 各フェーズの類似度をランダム生成
        const baseScore = 60 + Math.random() * 35;
        return Math.round(baseScore);
      }),
      weakestPhases: ['takeaway', 'impact'],
      improvementAreas: [
        'テイクアウェイの軌道修正が必要',
        'インパクトでの体軸安定を改善',
        'フォロースルーの完成度向上',
        'バックスイングの軌道を安定化'
      ]
    };

    console.log('📊 Swing Comparison Result:', comparison);
    return comparison;
  }

  getPhaseAdvice(phase: string): { title: string; description: string; drills: string[] } {
    const phaseGuides: Record<string, any> = {
      'address': {
        title: 'アドレス改善',
        description: 'すべてのスイングの基礎となる構え',
        drills: [
          '鏡の前でアドレス姿勢チェック（毎日5分）',
          'アライメントスティックを使った練習',
          'ボールポジション確認ドリル'
        ]
      },
      'takeaway': {
        title: 'テイクアウェイ安定化',
        description: 'スイング軌道を決める重要な始動',
        drills: [
          'ハーフスイングでのテイクアウェイ練習',
          '左腕リード意識の素振り',
          'クラブフェース向き確認ドリル'
        ]
      },
      'backswing': {
        title: 'バックスイング改善',
        description: 'パワーと正確性を生む上体回転',
        drills: [
          '右膝固定バックスイング練習',
          '肩90度回転意識ドリル',
          'スローモーション練習'
        ]
      },
      'top': {
        title: 'トップポジション安定',
        description: '切り返しタイミングの最適化',
        drills: [
          'トップでの一時停止練習',
          '切り返し意識の素振り',
          'リズム・テンポ統一練習'
        ]
      },
      'downswing': {
        title: 'ダウンスイング最適化',
        description: 'パワー伝達の核心部分',
        drills: [
          '下半身先行意識練習',
          'インサイドアウト軌道ドリル',
          '左腰リード練習'
        ]
      },
      'impact': {
        title: 'インパクト効率化',
        description: 'エネルギー最大化の瞬間',
        drills: [
          'インパクトバッグ練習',
          'ヘッドアップ防止ドリル',
          '左腕伸展維持練習'
        ]
      },
      'follow-through': {
        title: 'フォロースルー完成',
        description: 'バランス良い完結',
        drills: [
          'フィニッシュバランス練習',
          '完全振り切り意識ドリル',
          'I字フィニッシュ練習'
        ]
      }
    };
    
    return phaseGuides[phase] || { 
      title: '一般的改善', 
      description: '基本練習', 
      drills: ['基本素振り', 'ゆっくりスイング', 'バランス練習'] 
    };
  }

  // 開発用：分析統計
  getAnalysisStats(): { totalAnalyses: number; averageQuality: number; commonWeaknesses: string[] } {
    // ローカルストレージから統計取得（実装例）
    const analyses = JSON.parse(localStorage.getItem('pytorch-analyses') || '[]');
    
    return {
      totalAnalyses: analyses.length,
      averageQuality: analyses.length > 0 
        ? analyses.reduce((sum: number, a: any) => sum + a.qualityScore, 0) / analyses.length 
        : 0,
      commonWeaknesses: ['takeaway', 'impact', 'follow-through'] // 簡略化
    };
  }

  // 分析結果保存
  saveAnalysis(analysis: SwingAnalysisResult): void {
    const analyses = JSON.parse(localStorage.getItem('pytorch-analyses') || '[]');
    const savedAnalysis = {
      ...analysis,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    
    analyses.unshift(savedAnalysis);
    // 最新50件のみ保持
    const trimmed = analyses.slice(0, 50);
    localStorage.setItem('pytorch-analyses', JSON.stringify(trimmed));
    
    console.log('💾 Analysis saved to localStorage');
  }
}
