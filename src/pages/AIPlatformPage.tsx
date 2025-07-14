import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Zap, AlertCircle, BarChart3, TrendingUp } from 'lucide-react';
import { PyTorchSwingAnalyzer } from '../services/pytorch/pytorchSwingAnalyzer';
import AnalysisDemo from '../components/pytorch/AnalysisDemo';

const AIPlatformPage: React.FC = () => {
  const [analyzer] = useState(() => new PyTorchSwingAnalyzer());
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'analysis' | 'stats' | 'roadmap'>('analysis');

  useEffect(() => {
    initializePyTorch();
  }, []);

  const initializePyTorch = async () => {
    try {
      setLoading(true);
      await analyzer.initialize();
      setIsInitialized(true);
    } catch (error) {
      console.error('PyTorch initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <div className="absolute inset-0 animate-ping">
              <Brain className="w-16 h-16 text-purple-300 mx-auto" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">PyTorch AI Loading...</h2>
          <p className="text-gray-600">AIモデルを初期化しています</p>
          <div className="mt-4 w-48 mx-auto bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'analysis':
        return isInitialized ? (
          <AnalysisDemo analyzer={analyzer} />
        ) : (
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <div className="flex items-center mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-red-800 font-semibold">PyTorch初期化エラー</h3>
            </div>
            <p className="text-red-700">
              AIモデルの読み込みに失敗しました。現在はモック実装で動作しています。
            </p>
          </div>
        );
      
      case 'stats':
        return <StatsPanel analyzer={analyzer} />;
      
      case 'roadmap':
        return <RoadmapPanel />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーション */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              ホームに戻る
            </Link>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                AI Platform
              </span>
              {isInitialized ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  ✅ PyTorch Ready
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  ⚠️ Mock Mode
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">🧠 AI学習プラットフォーム</h1>
          <p className="opacity-90 text-lg">PyTorch × YouTube × リアルタイム分析</p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{analyzer.getAnalysisStats().totalAnalyses}</p>
              <p className="text-sm opacity-75">実行済み分析</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(analyzer.getAnalysisStats().averageQuality)}%</p>
              <p className="text-sm opacity-75">平均品質スコア</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{analyzer.getAnalysisStats().commonWeaknesses.length}</p>
              <p className="text-sm opacity-75">特定された弱点</p>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setCurrentTab('analysis')}
              className={`flex-1 p-4 text-center font-medium transition-colors ${
                currentTab === 'analysis'
                  ? 'bg-purple-50 border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Zap className="inline mr-2" size={20} />
              AI分析
            </button>
            <button
              onClick={() => setCurrentTab('stats')}
              className={`flex-1 p-4 text-center font-medium transition-colors ${
                currentTab === 'stats'
                  ? 'bg-purple-50 border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="inline mr-2" size={20} />
              統計
            </button>
            <button
              onClick={() => setCurrentTab('roadmap')}
              className={`flex-1 p-4 text-center font-medium transition-colors ${
                currentTab === 'roadmap'
                  ? 'bg-purple-50 border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <TrendingUp className="inline mr-2" size={20} />
              ロードマップ
            </button>
          </div>
        </div>

        {/* タブコンテンツ */}
        {renderTabContent()}
      </div>
    </div>
  );
};

// 統計パネルコンポーネント
const StatsPanel: React.FC<{ analyzer: PyTorchSwingAnalyzer }> = ({ analyzer }) => {
  const stats = analyzer.getAnalysisStats();
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-blue-600">分析実績</h3>
          <div className="text-3xl font-bold mb-2">{stats.totalAnalyses}</div>
          <p className="text-gray-600 text-sm">累計分析回数</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-green-600">平均品質</h3>
          <div className="text-3xl font-bold mb-2">{Math.round(stats.averageQuality)}%</div>
          <p className="text-gray-600 text-sm">スイング品質スコア</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-orange-600">改善エリア</h3>
          <div className="text-3xl font-bold mb-2">{stats.commonWeaknesses.length}</div>
          <p className="text-gray-600 text-sm">特定された弱点数</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-4">よくある改善ポイント</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {stats.commonWeaknesses.map((weakness, index) => {
            const advice = analyzer.getPhaseAdvice(weakness);
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">{advice.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{advice.description}</p>
                <div className="text-xs text-gray-500">
                  推奨ドリル: {advice.drills[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ロードマップパネルコンポーネント
const RoadmapPanel: React.FC = () => {
  const roadmapItems = [
    {
      title: '📹 リアルタイム骨格検出',
      status: 'planning',
      description: 'MediaPipeを使用したライブカメラからの姿勢検出',
      eta: '今週末'
    },
    {
      title: '🎥 YouTube API統合',
      status: 'planning', 
      description: '個人の弱点に最適化されたゴルフTips推薦',
      eta: '来週'
    },
    {
      title: '🤖 実ONNXモデル統合',
      status: 'development',
      description: 'Python PyTorchモデルからONNXエクスポート',
      eta: '2週間後'
    },
    {
      title: '📊 進捗トラッキング',
      status: 'planning',
      description: 'AI分析による上達度可視化とレポート生成',
      eta: '3週間後'
    },
    {
      title: '🏌️ スイング比較機能',
      status: 'planning',
      description: 'プロスイングとの重ね合わせ比較',
      eta: '1ヶ月後'
    },
    {
      title: '🎯 AIコーチング',
      status: 'research',
      description: 'パーソナライズされた練習プラン自動生成',
      eta: '2ヶ月後'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'research': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '✅ 完了';
      case 'development': return '🔨 開発中';
      case 'planning': return '📋 計画中';
      case 'research': return '🔬 調査中';
      default: return '❓ 未定';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-4">開発ロードマップ</h3>
        <p className="text-gray-600 mb-6">
          PyTorch AI学習プラットフォームの段階的機能実装計画
        </p>
        
        <div className="space-y-4">
          {roadmapItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-lg">{item.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                  <span className="text-sm text-gray-500">{item.eta}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <h3 className="font-semibold mb-3 text-blue-800">🎯 次期マイルストーン</h3>
        <p className="text-blue-700 mb-4">
          <strong>リアルタイム骨格検出の実装</strong>が次の重要な目標です。
          MediaPipeを使用してカメラからライブでスイング分析を行います。
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium mb-2">技術要件</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• MediaPipe Pose統合</li>
              <li>• リアルタイム描画</li>
              <li>• フレームレート最適化</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium mb-2">期待される効果</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 即座のフィードバック</li>
              <li>• 実際のスイング分析</li>
              <li>• ユーザー体験向上</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPlatformPage;
