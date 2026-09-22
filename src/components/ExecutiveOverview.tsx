import React from 'react';
import { PIPELINE_STAGES, CRITICAL_ISSUES, MODEL_TRAINING_METRICS } from '../data/reportData';
import { AlertTriangle, XCircle, CheckCircle2, Clock, ArrowRight, Activity, ShieldAlert, Cpu, Database } from 'lucide-react';

interface ExecutiveOverviewProps {
  onNavigateToTab: (tabId: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ onNavigateToTab }) => {
  return (
    <div className="space-y-6">
      {/* Red Alert Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-rose-900/40 to-slate-900 border-l-4 border-rose-500 p-4 sm:p-5 rounded-r-xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <XCircle className="w-6 h-6 text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>模型训练门禁未通过 (Status: REJECT) — 模型未被保存</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Health 60/100
                </span>
              </h2>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                拦截核心原因：<strong className="text-rose-200">Top1 特征占据了 88.0% 的重要性</strong>（安全上限 45.0%），且该主导特征在 OOS 测试集发生
                <span className="text-amber-300 font-mono font-semibold"> OOS_FLIP (IC 符号由正变负)</span>。更严重的是，模型被拒后引发连锁反应：
                <strong className="text-rose-200">下游 Dual Alpha 直接将新 Genome 的 2 个特征与磁盘中旧模型的 3 个特征错位绑定</strong>。
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('issues')}
            className="self-start sm:self-center px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 shadow"
          >
            <span>排查根因与方案</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>生产门禁状态</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-rose-400">REJECT</span>
            <span className="text-xs text-slate-400 font-mono">(60 / 100)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Top1 依赖度 <span className="text-rose-300 font-mono font-bold">88.0%</span>，熔断上限 45%
          </p>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>候选特征池萎缩</span>
            <Database className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-amber-400">2 / 40</span>
            <span className="text-xs text-slate-400 font-mono">(留存率 5%)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            35 因子被排除，5 个有条件，最终仅 2 个
          </p>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>基因跨期稳定性</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-rose-400">3 / 43</span>
            <span className="text-xs text-slate-400 font-mono">(通过率 6.9%)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            28 个发生 IC 衰亡，19 个方向翻转
          </p>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>OOS 非重叠样本</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-amber-400">N = 7</span>
            <span className="text-xs text-slate-400 font-mono">(标准 &gt;= 30)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            持仓 24 bars，有效样本太少，统计意义极弱
          </p>
        </div>
      </div>

      {/* Pipeline Stage Tracker */}
      <div className="bg-slate-850 rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white">全流程执行链路全景 (Pipeline Stage Tracker)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              总计耗时 1046.92 秒（约 17.4 分钟），展示各环节产物与质检结论
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 mt-2 sm:mt-0">
            Python: 3.8 (aistock) · CWD: /home/scott/code/ai-stock
          </span>
        </div>

        <div className="space-y-3">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isReject = stage.status === 'REJECT';
            const isWarning = stage.status === 'WARNING';
            return (
              <div
                key={stage.id}
                className={`p-3 rounded-lg border transition-all ${
                  isReject
                    ? 'bg-rose-950/30 border-rose-800/80 hover:border-rose-700'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-800/60 hover:border-amber-700'
                    : 'bg-slate-900/60 border-slate-800/70 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-slate-100">{stage.name}</span>
                      <span className="ml-2 text-xs font-mono text-slate-400">{stage.durationSec}s</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-mono text-slate-400 truncate max-w-xs sm:max-w-sm">
                      {stage.keyArtifact}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] ${
                        isReject
                          ? 'bg-rose-500 text-white'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>
                </div>

                {stage.warningNote && (
                  <div className="mt-2 text-xs flex items-center space-x-1.5 pl-9 text-amber-300/90 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                    <span>{stage.warningNote}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Critical Issues Quick Access */}
      <div className="bg-slate-850 rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">7 大核心数据与模型缺陷清单</h3>
          <button
            onClick={() => onNavigateToTab('issues')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium"
          >
            <span>展开全部根因深度分析</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CRITICAL_ISSUES.slice(0, 4).map((issue) => (
            <div
              key={issue.id}
              className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {issue.id} · {issue.category}
                </span>
                <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                  {issue.severity}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100">{issue.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{issue.manifestation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
