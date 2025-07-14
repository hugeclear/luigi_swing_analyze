import React, { useState } from 'react';
import { Brain, Play, BarChart3, Target } from 'lucide-react';
import { PyTorchSwingAnalyzer } from '../../services/pytorch/pytorchSwingAnalyzer';
import { SwingAnalysisResult } from '../../types/pytorch';

interface AnalysisDemoProps {
  analyzer: PyTorchSwingAnalyzer;
}

const AnalysisDemo: React.FC<AnalysisDemoProps> = ({ analyzer }) => {
  const [analysis, setAnalysis] = useState<SwingAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string>('');

  const runDemoAnalysis = async () => {
    try {
      setLoading(true);
      
      // ダミーポーズデータ生成
      const mockPoseSequence = Array.from({length: 30}, (_, frameIndex) => 
        Array.from({length: 17}, (_, keypointIndex) => ({
          x: 320 + Math.sin(frameIndex * 0.1 + keypointIndex) * 100,
          y: 240 + Math.cos(frameIndex * 0.1 + keypointIndex) * 80,
          confidence: 0.8 + Math.random() * 0.2
        }))
      );

      const result = await analyzer.analyzeSwingSequence(mockPoseSequence);
      setAnalysis(result);
      
      // 分析結果を保存
      analyzer.saveAnalysis(result);
      
    } catch (error) {
      console.error('Demo analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseDetails = (phase: string) => {
    if (!phase) return null;
    return analyzer.getPhaseAdvice(phase);
  };

  const phaseDetails = selectedPhase ? getPhaseDetails(selectedPhase) : null;

  return (
    <div className="space-y-6">
      {/* 分析実行セクション */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Brain className="mr-2 text-purple-500" />
            PyTorch AI分析デモ
          </h3>
          <button
            onClick={runDemoAnalysis}
            disabled={loading}
            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
              loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                AI分析中...
              </>
            ) : (
              <>
                <Play className="mr-2" size={16} />
                分析実行
              </>
            )}
          </button>
        </div>
        
        <p className="text-gray-600 text-sm">
          PyTorchベースのAIがスイングを分析し、詳細なフィードバックを提供します
        </p>
      </div>

      {/* 分析結果表示 */}
      {analysis && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* メイン結果 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-semibold mb-4 flex items-center">
              <BarChart3 className="mr-2 text-blue-500" />
              分析結果
            </h4>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">検出されたフェーズ</p>
                <p className="text-xl font-bold text-blue-800">{analysis.phase}</p>
                <p className="text-sm text-blue-600">
                  信頼度: {Math.round(analysis.phaseConfidence)}%
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">スイング品質</p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.qualityScore}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-green-800">
                    {Math.round(analysis.qualityScore)}%
                  </span>
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-600 font-medium">フェーズ詳細</p>
                <button
                  onClick={() => setSelectedPhase(analysis.phase)}
                  className="text-orange-800 hover:text-orange-900 font-medium underline"
                >
                  {analysis.phase} の改善アドバイスを見る →
                </button>
              </div>
            </div>
          </div>

          {/* 推奨事項 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-semibold mb-4 flex items-center">
              <Target className="mr-2 text-green-500" />
              AI推奨事項
            </h4>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">総合推奨:</p>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">技術的アドバイス:</p>
                <ul className="space-y-1">
                  {analysis.technicalAdvice.map((advice, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">→</span>
                      {advice}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フェーズ詳細情報 */}
      {phaseDetails && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-semibold mb-4 text-purple-800">{phaseDetails.title}</h4>
          <p className="text-gray-600 mb-4">{phaseDetails.description}</p>
          
          <div>
            <p className="font-medium text-gray-700 mb-2">推奨練習ドリル:</p>
            <div className="grid md:grid-cols-3 gap-3">
              {phaseDetails.drills.map((drill, index) => (
                <div key={index} className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">{drill}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!analysis && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            「分析実行」ボタンをクリックしてPyTorch AIによるスイング分析をお試しください
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisDemo;
