import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { ConsistencyAudit } from './components/ConsistencyAudit';
import { DataIssuesDiagnosis } from './components/DataIssuesDiagnosis';
import { FeatureEngineeringGuide } from './components/FeatureEngineeringGuide';
import { ModelTuningGuide } from './components/ModelTuningGuide';
import { FactorExplorer } from './components/FactorExplorer';
import { TuningSandbox } from './components/TuningSandbox';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <ExecutiveOverview onNavigateToTab={(tabId) => setActiveTab(tabId)} />
        )}
        {activeTab === 'consistency' && <ConsistencyAudit />}
        {activeTab === 'issues' && <DataIssuesDiagnosis />}
        {activeTab === 'features' && <FeatureEngineeringGuide />}
        {activeTab === 'model_tuning' && <ModelTuningGuide />}
        {activeTab === 'factors' && <FactorExplorer />}
        {activeTab === 'sandbox' && <TuningSandbox />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>AI-Stock Quant Research &amp; Alpha Engine · 诊断分析报告 · 运行环境 Python 3.8 / LightGBM 3.3.5 / tsx</p>
      </footer>
    </div>
  );
}
