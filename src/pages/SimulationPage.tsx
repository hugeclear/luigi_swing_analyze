import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GolfSwingAnalyzer from '../components/GolfSwingAnalyzer';

const SimulationPage: React.FC = () => {
  return (
    <div>
      {/* 戻るボタン */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
        </div>
      </div>

      {/* 既存のコンポーネントをそのまま使用 */}
      <GolfSwingAnalyzer />
    </div>
  );
};

export default SimulationPage;
