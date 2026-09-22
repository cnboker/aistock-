import React, { useState } from 'react';
import { CRITICAL_ISSUES, CORRELATION_PAIRS } from '../data/reportData';
import { ShieldAlert, AlertCircle, ChevronDown, ChevronUp, Link2, Check, Flame, Clock } from 'lucide-react';

export const DataIssuesDiagnosis: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('ISSUE-01');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredIssues = CRITICAL_ISSUES.filter(
    (issue) => filterSeverity === 'ALL' || issue.severity === filterSeverity
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-850 border border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>量化系统七大核心缺陷深度归因诊断</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            基于流水线日志剖析：从数据源、特征工程、时间切分到模型门禁的全链路根因
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">严重级别筛选:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterSeverity(level)}
              className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold transition-colors ${
                filterSeverity === level
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Accordion */}
      <div className="space-y-3">
        {filteredIssues.map((issue) => {
          const isExpanded = expandedId === issue.id;
          const isCritical = issue.severity === 'CRITICAL';
          const isHigh = issue.severity === 'HIGH';

          return (
            <div
              key={issue.id}
              className={`rounded-xl border transition-all ${
                isCritical
                  ? 'border-rose-900/80 bg-slate-900/90'
                  : isHigh
                  ? 'border-amber-900/60 bg-slate-900/80'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? '' : issue.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {issue.id}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white tracking-tight">{issue.title}</h4>
                    <span className="text-xs font-mono text-slate-400 mt-0.5 block">
                      模块位置: {issue.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                      isCritical
                        ? 'bg-rose-900/40 text-rose-400'
                        : isHigh
                        ? 'bg-amber-900/40 text-amber-400'
                        : 'bg-blue-900/40 text-blue-400'
                    }`}
                  >
                    {issue.category}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 text-xs space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 font-semibold block mb-1">【实际现象与证据】</span>
                      <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
                        {issue.manifestation}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40">
                      <span className="text-rose-400 font-semibold block mb-1">【底层根本原因】</span>
                      <p className="text-slate-200 leading-relaxed">{issue.rootCause}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40">
                      <span className="text-amber-400 font-semibold block mb-1">【对实盘交易的破坏力】</span>
                      <p className="text-slate-200 leading-relaxed">{issue.impact}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                      <span className="text-emerald-400 font-semibold block mb-1">【针对性改善处方】</span>
                      <p className="text-slate-200 leading-relaxed">{issue.solution}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* High Correlation Matrix Inspector */}
      <div className="p-5 rounded-xl bg-slate-850 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-amber-400" />
              <span>特征高度冗余共线性矩阵 (|corr| &gt;= 0.8)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              共发现 11 对高度共线性特征，部分数学等价（相关系数接近 1.0），严重挤压树模型分裂并造成伪特征重要性
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900 text-slate-300">
                <th className="py-2.5 px-3">特征 A</th>
                <th className="py-2.5 px-3">特征 B</th>
                <th className="py-2.5 px-3">皮尔逊相关系数</th>
                <th className="py-2.5 px-3">危害等级</th>
                <th className="py-2.5 px-3">重构建议</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {CORRELATION_PAIRS.map((pair, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 font-semibold text-slate-100">{pair.factorA}</td>
                  <td className="py-2 px-3 font-semibold text-slate-100">{pair.factorB}</td>
                  <td className="py-2 px-3 font-bold text-amber-400">
                    {pair.correlation > 0 ? `+${pair.correlation.toFixed(3)}` : pair.correlation.toFixed(3)}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pair.impactLevel === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : pair.impactLevel === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {pair.impactLevel}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    {pair.correlation > 0.94
                      ? '数学等价，强制剔除其中稳定性较低者'
                      : '采用分层聚类 (Hierarchical Clustering) 抽取主成分'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
