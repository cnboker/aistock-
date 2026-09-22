import React from 'react';
import { ShieldAlert, Activity, FileCheck, Layers, GitCompare, Wrench, Sliders, Database } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: '诊断全景', icon: Activity },
    { id: 'consistency', label: '数据一致性比对', icon: GitCompare },
    { id: 'issues', label: '核心缺陷与根因', icon: ShieldAlert },
    { id: 'features', label: '特征工程重构', icon: Layers },
    { id: 'model_tuning', label: '模型与权重调优', icon: Wrench },
    { id: 'factors', label: '因子库总览', icon: Database },
    { id: 'sandbox', label: '调优模拟沙盒', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-inner">
              <span className="text-lg tracking-wider font-mono">Qα</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-base sm:text-lg text-white tracking-tight">量化模型与特征工程诊断工作台</span>
                <span className="px-2 py-0.5 text-xs rounded-full font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                  GATE: REJECT
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Pipeline Run: 2026-09-22 07:30 UTC · 全流程 1046.9s · 发现 7 项高危问题
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
              <span className="text-slate-400">门禁健康分:</span>
              <span className="font-mono font-bold text-rose-400">60/100</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Top1占比:</span>
              <span className="font-mono font-bold text-rose-400">88.0%</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60 text-xs sm:text-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
