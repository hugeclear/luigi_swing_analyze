import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Brain } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏌️‍♂️ Golf Analytics Platform
          </h1>
          <p className="text-xl text-gray-600">
            複数のアプローチでゴルフスイングを分析
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 既存のシミュレーション版 */}
          <Link to="/simulation" className="group">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
              <div className="flex items-center mb-4">
                <Activity className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-bold">シミュレーション分析</h3>
              </div>
              <p className="text-gray-600 mb-4">
                データシミュレーションによるスイング分析（現在実装済み）
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">稼働中</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">軽量</span>
              </div>
            </div>
          </Link>

          {/* 将来のPyTorch版 */}
          <div className="bg-gray-100 p-8 rounded-xl shadow-lg opacity-75">
            <div className="flex items-center mb-4">
              <Brain className="w-8 h-8 text-purple-500 mr-3" />
              <h3 className="text-xl font-bold">AI学習プラットフォーム</h3>
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">開発予定</span>
            </div>
            <p className="text-gray-600 mb-4">
              PyTorch AI × YouTube統合（今後実装予定）
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">PyTorch</span>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">YouTube API</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
